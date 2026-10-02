import React, { useState, useEffect, useCallback, useRef } from 'react';
import Stage from '../components/Stage/Stage';
import TV from '../components/TV/TV';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import { CHANNELS, ROTATION_INTERVAL_MS } from '../config/channelConfig';
import backgroundPic from '../assets/background.png';

export default function PageRotating() {
  // Starts on CH2 (index 1 in CHANNELS array)
  const [channelIndex, setChannelIndex] = useState(1);
  const [isStaticActive, setIsStaticActive] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  
  const staticTimeoutRef = useRef(null);

  const currentChannel = CHANNELS[channelIndex]; // index 1 (CH2) or index 2 (CH3)

  // Switch between CH2 (index 1) and CH3 (index 2)
  const switchChannel = useCallback((nextIdx) => {
    if (staticTimeoutRef.current) clearTimeout(staticTimeoutRef.current);

    setIsStaticActive(true);
    setChannelIndex(nextIdx);
    setUserInteracted(false); // Reset user interaction state on channel change

    try {
      const audio = new Audio('/static-click.mp3');
      audio.play().catch(() => {});
    } catch (e) {}

    staticTimeoutRef.current = setTimeout(() => {
      setIsStaticActive(false);
    }, 450);
  }, []);

  const handleNextChannel = useCallback(() => {
    const nextIdx = channelIndex === 1 ? 2 : 1;
    switchChannel(nextIdx);
  }, [channelIndex, switchChannel]);

  const handleUserInteraction = useCallback(() => {
    setUserInteracted(true);
  }, []);

  // Keyboard navigation (ArrowRight / ArrowLeft switches between CH2 & CH3)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        handleNextChannel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextChannel]);

  // Auto-rotation timer keyed on current channelIndex (restarts on manual change, paused on document.hidden)
  useEffect(() => {
    let rotationTimer = null;

    const startTimer = () => {
      if (document.hidden) return;
      rotationTimer = setTimeout(() => {
        const nextIdx = channelIndex === 1 ? 2 : 1;
        switchChannel(nextIdx);
      }, ROTATION_INTERVAL_MS);
    };

    startTimer();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rotationTimer) clearTimeout(rotationTimer);
      } else {
        if (rotationTimer) clearTimeout(rotationTimer);
        startTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (rotationTimer) clearTimeout(rotationTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [channelIndex, switchChannel]);

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
        onUserInteraction={handleUserInteraction}
      >
        <Leaderboard
          channel={currentChannel}
          isStatic={false}
          userInteracted={userInteracted}
          onUserInteraction={handleUserInteraction}
        />
      </TV>
    </Stage>
  );
}
