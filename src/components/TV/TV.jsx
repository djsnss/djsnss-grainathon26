import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';
import TVCabinet from './TVCabinet';
import TVScreen from './TVScreen';
import SideControls from './SideControls';
import { TUNING_MIN_ANGLE, TUNING_MAX_ANGLE, POINTER_REST_ANGLE } from '../../config/knobConfig';
import styles from './TV.module.css';

export default function TV({
  children,
  channelAngle,
  onNextChannel,
  isStaticActive,
  channelCode
}) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const tuningAngleMV = useMotionValue(TUNING_MIN_ANGLE - POINTER_REST_ANGLE);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = window.innerWidth;
      const parentHeight = window.innerHeight;
      
      // Target design size 1000px wide, 620px high
      const scaleX = (parentWidth * 0.92) / 1000;
      const scaleY = (parentHeight * 0.92) / 620;
      const nextScale = Math.min(scaleX, scaleY, 1.25);
      
      setScale(Math.max(nextScale, 0.45));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTuningDragDelta = (delta) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;

    const currentAngle = tuningAngleMV.get();
    const nextAngle = currentAngle + delta;
    
    let rawP = (nextAngle - (TUNING_MIN_ANGLE - POINTER_REST_ANGLE)) / (TUNING_MAX_ANGLE - TUNING_MIN_ANGLE);
    let clampedP = Math.max(0, Math.min(1, rawP));

    // Detent snap when passing a row boundary (15 rows = 14 intervals)
    const rowInterval = 1 / 14;
    const nearestRow = Math.round(clampedP / rowInterval);
    const snapTarget = nearestRow * rowInterval;
    if (Math.abs(clampedP - snapTarget) < 0.008) {
      clampedP = snapTarget;
    }

    el.scrollTop = clampedP * maxScroll;
    const finalAngle = TUNING_MIN_ANGLE + clampedP * (TUNING_MAX_ANGLE - TUNING_MIN_ANGLE) - POINTER_REST_ANGLE;
    tuningAngleMV.set(finalAngle);
  };

  const handleTuningStep = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const rowHeight = 36;
    el.scrollTop += direction * rowHeight;
  };

  const childrenWithProps = React.isValidElement(children)
    ? React.cloneElement(children, { scrollContainerRef, tuningAngleMV })
    : children;

  return (
    <div className={styles.tvViewportContainer} ref={containerRef}>
      <div
        className={styles.tvScalableWrapper}
        style={{ transform: `scale(${scale})` }}
      >
        <TVCabinet>
          {/* Main CRT Screen Area */}
          <TVScreen isStaticActive={isStaticActive} channelCode={channelCode}>
            {childrenWithProps}
          </TVScreen>

          {/* Right Control Panel (Knobs, Speaker Grille, Buttons) */}
          <SideControls
            channelAngle={channelAngle}
            onNextChannel={onNextChannel}
            tuningAngleMV={tuningAngleMV}
            onTuningDragDelta={handleTuningDragDelta}
            onTuningStep={handleTuningStep}
          />
        </TVCabinet>
      </div>
    </div>
  );
}
