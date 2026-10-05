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
  progress = 0,
  onSelectPage,
  pageIndex = 0,
  totalPages = 1,
  onUserInteraction
}) {
  const teethCount = 24;
  const [isHeld, setIsHeld] = useState(false);
  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);

  const handlePointerDown = (e) => {
    if (!isInteractive || isInert) return;
    if (!isTuning) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    setIsHeld(true);
    onUserInteraction?.();
  };

  const handlePointerMove = (e) => {
    if (!isTuning || !isInteractive || isInert || !isDraggingRef.current) return;
    dragMovedRef.current = true;
    onUserInteraction?.();

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
    let deg = rad * (180 / Math.PI);

    // Convert deg relative to top (12 o'clock = 0 deg)
    let relDeg = deg + 90;
    if (relDeg > 180) relDeg -= 360;

    const minA = TUNING_MIN_ANGLE;
    const maxA = TUNING_MAX_ANGLE;
    let clampedP = (relDeg - minA) / (maxA - minA);
    clampedP = Math.max(0, Math.min(1, clampedP));

    if (totalPages > 1 && onSelectPage) {
      const targetPage = Math.round(clampedP * (totalPages - 1));
      onSelectPage(targetPage);
    }
  };

  const handlePointerUp = (e) => {
    if (!isTuning || !isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsHeld(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
    onUserInteraction?.();
  };

  const handleClick = (e) => {
    if (!isInteractive || isInert) return;
    onUserInteraction?.();

    if (isTuning) {
      if (!dragMovedRef.current && totalPages > 1 && onSelectPage) {
        onSelectPage((pageIndex + 1) % totalPages);
      }
    } else {
      onClick?.();
    }
  };

  const handleWheel = (e) => {
    if (!isTuning || !isInteractive || isInert) return;
    e.preventDefault();
    onUserInteraction?.();
    const dir = e.deltaY > 0 ? 1 : -1;
    if (totalPages > 1 && onSelectPage) {
      const nextP = (pageIndex + dir + totalPages) % totalPages;
      onSelectPage(nextP);
    }
  };

  const handleKeyDown = (e) => {
    if (!isInteractive || isInert) return;

    if (isTuning) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        onUserInteraction?.();
        if (totalPages > 1 && onSelectPage) {
          onSelectPage((pageIndex - 1 + totalPages) % totalPages);
        }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        onUserInteraction?.();
        if (totalPages > 1 && onSelectPage) {
          onSelectPage((pageIndex + 1) % totalPages);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onUserInteraction?.();
        if (totalPages > 1 && onSelectPage) {
          onSelectPage((pageIndex + 1) % totalPages);
        }
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
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          role={isTuning ? 'slider' : 'button'}
          aria-label={isTuning ? `${label} Scroll Control` : `Change channel (current position ${angle} degrees)`}
          aria-valuenow={isTuning ? Math.round(progress * 100) : undefined}
          aria-valuemin={isTuning ? 0 : undefined}
          aria-valuemax={isTuning ? 100 : undefined}
          tabIndex={isInteractive && !isInert ? 0 : -1}
          style={{
            transformOrigin: '50% 50%',
            touchAction: 'none',
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
