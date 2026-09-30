import React, { useEffect } from 'react';
import Stage from './components/Stage/Stage';
import TV from './components/TV/TV';
import Leaderboard from './components/Leaderboard/Leaderboard';
import { useChannel } from './hooks/useChannel';
import { CHANNEL_TICK_ANGLES, POINTER_REST_ANGLE } from './config/knobConfig';
import backgroundPic from './assets/background.png';

export default function App() {
  const {
    channelIndex,
    currentChannel,
    nextChannel,
    prevChannel,
    isStaticActive
  } = useChannel();

  const channelAngle = CHANNEL_TICK_ANGLES[channelIndex] - POINTER_REST_ANGLE;

  // Keyboard Navigation: ArrowRight / ArrowLeft to switch channel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextChannel();
      } else if (e.key === 'ArrowLeft') {
        prevChannel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextChannel, prevChannel]);

  return (
    <Stage bgImage={backgroundPic}>
      <TV
        channelAngle={channelAngle}
        onNextChannel={nextChannel}
        isStaticActive={isStaticActive}
        channelCode={currentChannel.chCode}
      >
        <Leaderboard channel={currentChannel} />
      </TV>
    </Stage>
  );
}

