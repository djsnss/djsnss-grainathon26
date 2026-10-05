import React, { useState, useEffect, useCallback, useRef } from 'react';
import Stage from '../components/Stage/Stage';
import TV from '../components/TV/TV';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import { CHANNELS } from '../config/channelConfig';
import { LIVE_CONFIG } from '../config/liveConfig';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { TUNING_MIN_ANGLE, TUNING_MAX_ANGLE } from '../config/knobConfig';
import backgroundPic from '../assets/background.png';
import styles from './PageRotating.module.css';

export default function PageRotating() {
  // Starts on CH2 (index 1 in CHANNELS array)
  const [channelIndex, setChannelIndex] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [isStaticActive, setIsStaticActive] = useState(false);

  // Auto-rotation state flags initialized from LIVE_CONFIG
  const [enableChannelSwitching, setEnableChannelSwitching] = useState(
    LIVE_CONFIG.ENABLE_CHANNEL_SWITCHING
  );
  const [enablePageRotation, setEnablePageRotation] = useState(
    LIVE_CONFIG.ENABLE_PAGE_ROTATION
  );

  // Manual pause until timestamp (ms)
  const [manualPauseUntil, setManualPauseUntil] = useState(0);

  const staticTimeoutRef = useRef(null);
  const rotationTimerRef = useRef(null);

  const currentChannel = CHANNELS[channelIndex]; // index 1 (CH2) or index 2 (CH3)
  const { items } = useLeaderboard(currentChannel.dataKey);

  const totalPages = Math.max(1, Math.ceil(items.length / 3));

  // Ensure pageIndex is valid if item count shrinks during data polling
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  useEffect(() => {
    if (pageIndex > totalPages - 1) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [totalPages, pageIndex]);

  // Toggle Auto Rotation state (flips both flags in state)
  const toggleAuto = useCallback(() => {
    setEnablePageRotation((prevRotation) => {
      const nextVal = !prevRotation;
      setEnableChannelSwitching(nextVal);
      return nextVal;
    });
  }, []);

  // Pause auto-rotation for 15 seconds (MANUAL_PAUSE_MS) on manual user action
  const triggerManualPause = useCallback(() => {
    setManualPauseUntil(Date.now() + LIVE_CONFIG.MANUAL_PAUSE_MS);
  }, []);

  // Switch channel with static noise burst animation
  const switchChannel = useCallback((nextIdx) => {
    if (staticTimeoutRef.current) clearTimeout(staticTimeoutRef.current);

    setIsStaticActive(true);
    setChannelIndex(nextIdx);
    setPageIndex(0);

    try {
      const audio = new Audio('/static-click.mp3');
      audio.play().catch(() => {});
    } catch (e) {}

    staticTimeoutRef.current = setTimeout(() => {
      setIsStaticActive(false);
    }, 450);
  }, []);

  const handleNextChannel = useCallback(() => {
    triggerManualPause();
    const nextIdx = channelIndex === 1 ? 2 : 1;
    switchChannel(nextIdx);
  }, [channelIndex, switchChannel, triggerManualPause]);

  const handleSelectPage = useCallback((newPageIndex) => {
    triggerManualPause();
    setPageIndex(Math.max(0, Math.min(totalPages - 1, newPageIndex)));
  }, [totalPages, triggerManualPause]);

  const handleStepPage = useCallback((dir) => {
    triggerManualPause();
    setPageIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return totalPages - 1;
      if (next >= totalPages) return 0;
      return next;
    });
  }, [totalPages, triggerManualPause]);

  // Keyboard shortcut handler: 'P' to toggle AUTO, ArrowLeft / ArrowRight to change page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        toggleAuto();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleStepPage(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleStepPage(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAuto, handleStepPage]);

  // Chained setTimeout auto-rotation loop
  useEffect(() => {
    if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);

    const scheduleNextStep = () => {
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);

      // Pause while document is hidden/backgrounded
      if (document.hidden) return;

      // Pause if manual interaction pause is currently active
      const now = Date.now();
      if (manualPauseUntil > now) {
        const remainingPause = manualPauseUntil - now;
        rotationTimerRef.current = setTimeout(scheduleNextStep, remainingPause);
        return;
      }

      const isLastPage = safePageIndex >= totalPages - 1;

      if (!isLastPage) {
        // Rotate to next page on current channel if page rotation is enabled
        if (enablePageRotation) {
          rotationTimerRef.current = setTimeout(() => {
            setPageIndex((prev) => prev + 1);
          }, LIVE_CONFIG.PAGE_ROTATION_INTERVAL_MS);
        }
      } else {
        // On last page of current channel: calculate channel duration
        // Time on channel = max(pages * PAGE_ROTATION_INTERVAL_MS, CHANNEL_SWITCH_INTERVAL_MS)
        const elapsedTimeOnPages = (totalPages - 1) * LIVE_CONFIG.PAGE_ROTATION_INTERVAL_MS;
        const dwellTimeOnLastPage = Math.max(
          LIVE_CONFIG.PAGE_ROTATION_INTERVAL_MS,
          LIVE_CONFIG.CHANNEL_SWITCH_INTERVAL_MS - elapsedTimeOnPages
        );

        if (enableChannelSwitching) {
          rotationTimerRef.current = setTimeout(() => {
            const nextChannelIdx = channelIndex === 1 ? 2 : 1;
            switchChannel(nextChannelIdx);
          }, dwellTimeOnLastPage);
        } else if (enablePageRotation) {
          // Loop back to page 0 on same channel if channel switching is disabled
          rotationTimerRef.current = setTimeout(() => {
            setPageIndex(0);
          }, dwellTimeOnLastPage);
        }
      }
    };

    scheduleNextStep();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        scheduleNextStep();
      } else {
        if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    channelIndex,
    safePageIndex,
    totalPages,
    enableChannelSwitching,
    enablePageRotation,
    manualPauseUntil,
    switchChannel
  ]);

  // Compute pointer sweep progress and ticks for tuning knob
  const pageProgress = totalPages > 1 ? safePageIndex / (totalPages - 1) : 0;
  const pageTicks = Array.from({ length: totalPages }, (_, i) => `${i + 1}`);
  const pageTickAngles = Array.from({ length: totalPages }, (_, i) => {
    if (totalPages === 1) return 0;
    return TUNING_MIN_ANGLE + (i / (totalPages - 1)) * (TUNING_MAX_ANGLE - TUNING_MIN_ANGLE);
  });

  const isAutoActive = enablePageRotation || enableChannelSwitching;

  return (
    <Stage bgImage={backgroundPic}>
      <TV
        channelAngle={currentChannel.knobAngle}
        onNextChannel={handleNextChannel}
        isChannelInteractive={true}
        isTuningInteractive={true}
        isTuningInert={false}
        isStaticActive={isStaticActive}
        channelCode={currentChannel.chCode}
        onUserInteraction={triggerManualPause}
        progress={pageProgress}
        pageTicks={pageTicks}
        pageTickAngles={pageTickAngles}
        onTuningStep={handleStepPage}
      >
        <Leaderboard
          channel={currentChannel}
          pageIndex={safePageIndex}
          onSelectPage={handleSelectPage}
          isStatic={false}
        />
      </TV>

      {/* Low-opacity on-screen AUTO toggle button */}
      <button
        type="button"
        className={styles.autoToggleBtn}
        onClick={() => {
          triggerManualPause();
          toggleAuto();
        }}
        title="Toggle Auto Rotation (Keyboard Shortcut: P)"
        aria-label="Toggle Auto Rotation Mode"
      >
        <span className={`${styles.autoDot} ${isAutoActive ? styles.autoActive : ''}`} />
        AUTO {isAutoActive ? 'ON' : 'OFF'}
      </button>
    </Stage>
  );
}
