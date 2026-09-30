import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './ScorePlate.module.css';

export default function ScorePlate({ item, rank = 1, delay = 0 }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = item.score || 0;
    const duration = 800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [item.score]);

  // Rank-based accents
  const rankClass = rank === 1 ? styles.rankToken1 : rank === 2 ? styles.rankToken2 : styles.rankToken3;
  const strokeColor = rank === 1 ? '#ffd166' : rank === 2 ? '#e2e8f0' : '#d08a5b';
  const glowFilter = rank === 1 ? 'gold-glow' : rank === 2 ? 'silver-glow' : 'bronze-glow';

  return (
    <motion.div
      className={`${styles.scorePlateWrapper} ${rank === 1 ? styles.rank1Wrapper : ''}`}
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.1, ease: 'easeOut' }}
    >
      {/* Rank Token Circle */}
      <div className={`${styles.rankToken} ${rankClass}`}>
        {rank}
      </div>

      <div className={`${styles.platesContainer} ${rank === 1 ? styles.rank1Height : ''}`}>
        {/* Name Plate */}
        <div className={styles.namePlate}>
          {rank === 1 && (
            <svg className={styles.crownBadge} viewBox="0 0 24 24" fill="#ffd166">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          )}

          <svg className={styles.plateSvgBackground} viewBox="0 0 400 60" preserveAspectRatio="none">
            {/* Double Chamfered Chamfered Frame */}
            <rect
              x="2"
              y="2"
              width="396"
              height="56"
              rx="6"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.8"
              opacity="0.85"
            />
            <rect
              x="6"
              y="6"
              width="388"
              height="48"
              rx="4"
              fill="none"
              stroke="#5cf2c8"
              strokeWidth="0.8"
              opacity="0.4"
            />

            {/* Corner Rivets */}
            <circle cx="8" cy="8" r="1.5" fill={strokeColor} />
            <circle cx="392" cy="8" r="1.5" fill={strokeColor} />
            <circle cx="8" cy="52" r="1.5" fill={strokeColor} />
            <circle cx="392" cy="52" r="1.5" fill={strokeColor} />
          </svg>

          <span className={styles.itemName} title={item.name}>
            {item.name}
          </span>
        </div>

        {/* Score Plate */}
        <div className={styles.scorePlate}>
          <svg className={styles.plateSvgBackground} viewBox="0 0 130 60" preserveAspectRatio="none">
            <rect
              x="2"
              y="2"
              width="126"
              height="56"
              rx="6"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.8"
              opacity="0.85"
            />
            <rect
              x="6"
              y="6"
              width="118"
              height="48"
              rx="4"
              fill="none"
              stroke="#5cf2c8"
              strokeWidth="0.8"
              opacity="0.4"
            />
            <circle cx="8" cy="8" r="1.5" fill={strokeColor} />
            <circle cx="122" cy="8" r="1.5" fill={strokeColor} />
            <circle cx="8" cy="52" r="1.5" fill={strokeColor} />
            <circle cx="122" cy="52" r="1.5" fill={strokeColor} />
          </svg>

          <span className={styles.itemScore}>
            {displayScore}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
