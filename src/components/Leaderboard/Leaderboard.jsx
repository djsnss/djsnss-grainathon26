import React, { useState, useEffect, useRef } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import ScreenTitle from './ScreenTitle';
import ColumnHeaders from './ColumnHeaders';
import ScorePlate from './ScorePlate';
import TrailingRow from './TrailingRow';
import { TUNING_MIN_ANGLE, TUNING_MAX_ANGLE, POINTER_REST_ANGLE } from '../../config/knobConfig';
import styles from './Leaderboard.module.css';

export default function Leaderboard({ channel, scrollContainerRef, tuningAngleMV }) {
  const { tapeLabel, leftHeader, rightHeader, dataKey } = channel;
  const { topThree, trailingRows } = useLeaderboard(dataKey);

  const localScrollRef = useRef(null);
  const scrollRef = scrollContainerRef || localScrollRef;

  const [showIndicator, setShowIndicator] = useState(false);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(30);
  const idleTimerRef = useRef(null);

  // Reset scroll to top on channel change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    if (tuningAngleMV) {
      tuningAngleMV.set(TUNING_MIN_ANGLE - POINTER_REST_ANGLE);
    }
  }, [channel.id, scrollRef, tuningAngleMV]);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const p = maxScroll > 0 ? Math.max(0, Math.min(1, el.scrollTop / maxScroll)) : 0;

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
    if (maxScroll > 0) {
      const containerH = el.clientHeight;
      const calculatedHeight = Math.max(20, (containerH / el.scrollHeight) * containerH);
      const calculatedTop = (el.scrollTop / maxScroll) * (containerH - calculatedHeight);
      setThumbHeight(calculatedHeight);
      setThumbTop(calculatedTop);
    }
  };

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
