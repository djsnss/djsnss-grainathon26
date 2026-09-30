import { useState, useCallback, useRef } from 'react';
import { CHANNELS } from '../data/leaderboardData';

export function useChannel() {
  const [channelIndex, setChannelIndex] = useState(0);
  const [isStaticActive, setIsStaticActive] = useState(false);
  const timeoutRef = useRef(null);

  const changeChannel = useCallback((nextIdx) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsStaticActive(true);
    setChannelIndex(nextIdx);

    // TODO: Trigger optional TV static click / switch audio sound here
    const audio = new Audio('/static-click.mp3'); audio.play();

    timeoutRef.current = setTimeout(() => {
      setIsStaticActive(false);
    }, 450);
  }, []);

  const nextChannel = useCallback(() => {
    const nextIdx = (channelIndex + 1) % CHANNELS.length;
    changeChannel(nextIdx);
  }, [channelIndex, changeChannel]);

  const prevChannel = useCallback(() => {
    const prevIdx = (channelIndex - 1 + CHANNELS.length) % CHANNELS.length;
    changeChannel(prevIdx);
  }, [channelIndex, changeChannel]);

  return {
    channelIndex,
    currentChannel: CHANNELS[channelIndex],
    nextChannel,
    prevChannel,
    isStaticActive
  };
}
