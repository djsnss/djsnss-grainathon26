import React, { useState } from 'react';
import Knob from './Knob';
import SpeakerGrille from './SpeakerGrille';
import Screw, { ScrewDefs } from './Screws';
import { CHANNEL_TICK_ANGLES } from '../../config/knobConfig';
import styles from './SideControls.module.css';

export default function SideControls({
  channelAngle,
  onNextChannel,
  isChannelInteractive = true,
  tuningAngleMV,
  onTuningDragDelta,
  onTuningStep,
  isTuningInteractive = true,
  isTuningInert = false
}) {
  const [toggleState, setToggleState] = useState(false);

  return (
    <div className={styles.sidePanel}>
      <ScrewDefs />
      
      {/* Screw Overlays at Panel Corners */}
      <svg className={styles.screwsSvg} viewBox="0 0 190 520">
        <Screw x={16} y={16} size={11} rotation={25} />
        <Screw x={174} y={16} size={11} rotation={110} />
        <Screw x={16} y={504} size={11} rotation={75} />
        <Screw x={174} y={504} size={11} rotation={140} />
      </svg>

      {/* Stacked Knobs */}
      <div className={styles.knobStack}>
        {/* Upper Knob: Channel Switch */}
        <Knob
          label="CHANNEL"
          angle={channelAngle}
          onClick={isChannelInteractive ? onNextChannel : undefined}
          isInteractive={isChannelInteractive}
          ticks={[1, 2, 3]}
          tickAngles={CHANNEL_TICK_ANGLES}
        />

        {/* Lower Knob: Tuning Scroll Control */}
        <Knob
          label="TUNING"
          motionAngle={isTuningInteractive ? tuningAngleMV : null}
          angle={!isTuningInteractive ? CHANNEL_TICK_ANGLES[0] : 0}
          isInteractive={isTuningInteractive}
          isInert={isTuningInert}
          isTuning={isTuningInteractive}
          ticks={['A', 'B', 'C']}
          tickAngles={CHANNEL_TICK_ANGLES}
          onTuningDragDelta={isTuningInteractive ? onTuningDragDelta : undefined}
          onTuningStep={isTuningInteractive ? onTuningStep : undefined}
        />
      </div>

      {/* Speaker Grille */}
      <SpeakerGrille slatsCount={14} />

      {/* Small Row of Push Buttons & Metallic Toggle */}
      <div className={styles.buttonRow}>
        <button
          className={styles.pushButton}
          aria-label="Power Button"
          title="TV Power"
        />
        
        <div
          className={styles.toggleSwitch}
          onClick={() => setToggleState(!toggleState)}
          aria-label="Mode Toggle"
          title="Display Mode Toggle"
        >
          <div
            className={styles.toggleHandle}
            style={{ transform: toggleState ? 'translateX(12px)' : 'translateX(0)' }}
          />
        </div>

        <button
          className={styles.pushButton}
          aria-label="Aux Button"
          title="Auxiliary Control"
        />
      </div>
    </div>
  );
}
