import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CHANNEL_TICK_ANGLES } from '../../config/knobConfig';
import styles from './Knob.module.css';

export default function Knob({
  label = 'CHANNEL',
  angle = 0,
  motionAngle = null,
  onClick,
  isInteractive = true,
  isInert = false,
  isTuning = false,
  ticks = [1, 2, 3],
  tickAngles = CHANNEL_TICK_ANGLES,
  onTuningDragDelta,
  onTuningStep,
  progress = 0
}) {
  const teethCount = 24;
  const [isHeld, setIsHeld] = useState(false);
  const isDraggingRef = useRef(false);
  const lastAngleRef = useRef(0);

  const handlePointerDown = (e) => {
    if (!isTuning || !isInteractive || isInert) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsHeld(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
    lastAngleRef.current = rad * (180 / Math.PI);
  };

  const handlePointerMove = (e) => {
    if (!isTuning || !isInteractive || isInert || !isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
    const currentAngle = rad * (180 / Math.PI);

    let delta = currentAngle - lastAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    lastAngleRef.current = currentAngle;
    onTuningDragDelta?.(delta);
  };

  const handlePointerUp = (e) => {
    if (!isTuning || !isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsHeld(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleKeyDown = (e) => {
    if (!isInteractive || isInert) return;

    if (isTuning) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        onTuningStep?.(-1);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        onTuningStep?.(1);
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        onTuningStep?.(-3);
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        onTuningStep?.(3);
      }
    } else {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    }
  };

  return (
    <div className={styles.knobContainer}>
      {/* Ticks ring around the brass collar */}
      <div className={styles.ticksContainer}>
        {ticks.map((num, i) => {
          const tAngle = tickAngles[i] !== undefined ? tickAngles[i] : (i * 60 - 60);
          const rad = (tAngle - 90) * (Math.PI / 180);
          const r = 54;
          const x = 60 + r * Math.cos(rad);
          const y = 60 + r * Math.sin(rad);

          return (
            <React.Fragment key={i}>
              <div
                className={styles.tickDot}
                style={{ left: `${x}px`, top: `${y}px` }}
              />
              <div
                className={styles.tickNumber}
                style={{
                  left: `${60 + (r + 10) * Math.cos(rad)}px`,
                  top: `${60 + (r + 10) * Math.sin(rad)}px`
                }}
              >
                {num}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Brass Outer Ring Collar */}
      <div className={styles.brassCollar}>
        <motion.button
          type="button"
          className={`${styles.knobButton} ${isTuning ? styles.tuningButton : ''} ${isHeld ? styles.held : ''} ${!isInteractive ? styles.nonInteractive : ''} ${isInert ? styles.inert : ''}`}
          onClick={!isTuning && isInteractive && !isInert ? onClick : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          role={isTuning ? 'slider' : 'button'}
          aria-label={isTuning ? `${label} Scroll Control` : `Change channel (current position ${angle} degrees)`}
          aria-valuenow={isTuning ? Math.round(progress * 100) : undefined}
          aria-valuemin={isTuning ? 0 : undefined}
          aria-valuemax={isTuning ? 100 : undefined}
          tabIndex={isInteractive && !isInert ? 0 : -1}
          style={{
            transformOrigin: '50% 50%',
            ...(motionAngle ? { rotate: motionAngle } : {})
          }}
          animate={motionAngle ? undefined : { rotate: angle }}
          initial={false}
          whileHover={isInteractive && !isInert ? { scale: 1.04 } : undefined}
          whileTap={isInteractive && !isInert ? { scale: 0.97 } : undefined}
          transition={motionAngle ? undefined : {
            type: 'spring',
            stiffness: 260,
            damping: 18
          }}
        >
          {/* SVG Knurled/Serrated Knob Body */}
          <svg viewBox="0 0 100 100" className={styles.knobBody}>
            <defs>
              <radialGradient id="bakeliteGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#3d3d3d" />
                <stop offset="40%" stopColor="#222222" />
                <stop offset="100%" stopColor="#0d0d0d" />
              </radialGradient>
              <linearGradient id="glareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
              </linearGradient>
            </defs>

            {/* Knurled Outer Serrated Edge */}
            <g>
              {Array.from({ length: teethCount }).map((_, idx) => {
                const rot = (idx * 360) / teethCount;
                return (
                  <rect
                    key={idx}
                    x="48"
                    y="1"
                    width="4"
                    height="6"
                    rx="1"
                    fill="#151515"
                    transform={`rotate(${rot} 50 50)`}
                  />
                );
              })}
            </g>

            {/* Main Outer Cap */}
            <circle cx="50" cy="50" r="45" fill="url(#bakeliteGrad)" stroke="#111" strokeWidth="1" />
            <circle cx="50" cy="50" r="45" fill="url(#glareGrad)" />

            {/* Recessed Inner Rim */}
            <circle cx="50" cy="50" r="34" fill="#181818" stroke="#0a0a0a" strokeWidth="2" />
            <circle cx="50" cy="50" r="32" fill="url(#bakeliteGrad)" />

            {/* Pointer Notch Line */}
            <rect x="47.5" y="10" width="5" height="18" rx="2" fill="#5cf2c8" />
            <rect x="48.5" y="11" width="3" height="16" rx="1.5" fill="#ffffff" />
          </svg>
        </motion.button>
      </div>

      <span className={styles.knobLabel}>{label}</span>
    </div>
  );
}
