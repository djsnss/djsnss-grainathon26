import React from 'react';
import Stage from '../components/Stage/Stage';
import TV from '../components/TV/TV';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import { CHANNELS } from '../config/channelConfig';
import backgroundPic from '../assets/background.png';

export default function PageStatic() {
  const ch1 = CHANNELS[0]; // CH1: Top 3 Departments static podium

  return (
    <Stage bgImage={backgroundPic}>
      <TV
        channelAngle={ch1.knobAngle}
        onNextChannel={undefined}
        isChannelInteractive={false}
        isTuningInteractive={false}
        isTuningInert={true}
        isStaticActive={false}
        channelCode={ch1.chCode}
      >
        <Leaderboard channel={ch1} isStatic={true} />
      </TV>
    </Stage>
  );
}
