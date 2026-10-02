import React, { useState, useEffect, useRef } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import ScreenTitle from './ScreenTitle';
import ColumnHeaders from './ColumnHeaders';
import ScorePlate from './ScorePlate';
import TrailingRow from './TrailingRow';
import { TUNING_MIN_ANGLE, TUNING_MAX_ANGLE, POINTER_REST_ANGLE } from '../../config/knobConfig';
import { AUTO_SCROLL, ROTATION_INTERVAL_MS } from '../../config/channelConfig';
import styles from './Leaderboard.module.css';

export default function Leaderboard({
  channel,
  scrollContainerRef,
  tuningAngleMV,
  isStatic = false,
  userInteracted = false,
  onUserInteraction
}) {
  const { tapeLabel, leftHeader, rightHeader, dataKey } = channel;
  const { topThree, trailingRows } = useLeaderboard(dataKey);

  const localScrollRef = useRef(null);
  const scrollRef = scrollContainerRef || localScrollRef;

  const [showIndicator, setShowIndicator] = useState(false);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(30);
  const idleTimerRef = useRef(null);
  const isUserScrollingRef = useRef(false);

  // Reset scroll to top on channel change and check scrollability
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      const el = scrollRef.current;
      const isScrollable = el.scrollHeight > el.clientHeight;
      if (!isScrollable) {
        setShowIndicator(false);
      }
    }
    if (tuningAngleMV) {
      tuningAngleMV.set(TUNING_MIN_ANGLE - POINTER_REST_ANGLE);
    }
  }, [channel.id, scrollRef, tuningAngleMV]);

  // Smooth AUTO_SCROLL effect across channel dwell time (disabled when user interacts or content fits)
  useEffect(() => {
    if (isStatic || !AUTO_SCROLL || userInteracted) return;

    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;

    let animationFrameId;
    let startTime = null;
    const duration = Math.max(3000, ROTATION_INTERVAL_MS - 1500);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (scrollRef.current && !isUserScrollingRef.current) {
        scrollRef.current.scrollTop = progress * maxScroll;
      }

      if (progress < 1 && !isUserScrollingRef.current) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(step);
    }, 600);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [channel.id, isStatic, userInteracted, scrollRef]);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;

    // Detect user manual scroll interaction
    if (e.isTrusted && !userInteracted) {
      isUserScrollingRef.current = true;
      onUserInteraction?.();
    }

    if (maxScroll <= 0) {
      if (showIndicator) setShowIndicator(false);
      return;
    }

    const p = Math.max(0, Math.min(1, el.scrollTop / maxScroll));

    // Synchronize tuning knob angle via motion value without React re-renders
    if (tuningAngleMV) {
      const targetAngle = TUNING_MIN_ANGLE + p * (TUNING_MAX_ANGLE - TUNING_MIN_ANGLE) - POINTER_REST_ANGLE;
      tuningAngleMV.set(targetAngle);
    }

    // CRT Scroll Indicator logic (fades out after 1.5s idle)
    setShowIndicator(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setShowIndicator(false);
    }, 1500);

    // Compute scrollbar thumb dimensions
    const containerH = el.clientHeight;
    const calculatedHeight = Math.max(20, (containerH / el.scrollHeight) * containerH);
    const calculatedTop = (el.scrollTop / maxScroll) * (containerH - calculatedHeight);
    setThumbHeight(calculatedHeight);
    setThumbTop(calculatedTop);
  };

  // Hero static mode for Page "/" (CH1 top 3 plates centered vertically, no scroll area)
  if (isStatic) {
    const leaderScore = topThree[0]?.score || 1250;
    return (
      <div className={styles.leaderboardContainer} aria-live="polite">
        <ScreenTitle tapeLabel={tapeLabel} />
        <ColumnHeaders leftHeader={leftHeader} rightHeader={rightHeader} />

        <div className={styles.heroContainer}>
          {topThree.map((item, index) => (
            <ScorePlate
              key={item.id || index}
              item={item}
              rank={item.rank}
              delay={index + 1}
              isHero={true}
              maxScore={leaderScore}
            />
          ))}
        </div>
      </div>
    );
  }

  // Interactive / Rotating mode for Page "/live" (CH2 / CH3)
  return (
    <div className={styles.leaderboardContainer} aria-live="polite">
      {/* Title & Channel Tape Label (Fixed Header) */}
      <ScreenTitle tapeLabel={tapeLabel} />

      {/* Column Headers (Fixed Header) */}
      <ColumnHeaders leftHeader={leftHeader} rightHeader={rightHeader} />

      {/* Scrollable Container Wrapper with CRT Scroll Indicator */}
      <div className={styles.scrollWrapper}>
        <div
          className={styles.scrollArea}
          ref={scrollRef}
          onScroll={handleScroll}
          onWheel={() => { onUserInteraction?.(); }}
          onTouchMove={() => { onUserInteraction?.(); }}
          tabIndex={0}
          aria-label="Leaderboard List"
        >
          {/* Top 3 Score Plates */}
          <div className={styles.topSection}>
            {topThree.map((item, index) => (
              <ScorePlate
                key={item.id || index}
                item={item}
                rank={item.rank}
                delay={index + 1}
                isHero={false}
              />
            ))}
          </div>

          {/* Trailing Rows (Ranks 4 to 15) */}
          <div className={styles.trailingSection}>
            {trailingRows.map((item, index) => (
              <TrailingRow
                key={item.id || index}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Thin Mint CRT-Style Scroll Indicator */}
        <div className={`${styles.scrollTrack} ${showIndicator ? styles.visible : ''}`}>
          <div
            className={styles.scrollThumb}
            style={{
              height: `${thumbHeight}px`,
              transform: `translateY(${thumbTop}px)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
