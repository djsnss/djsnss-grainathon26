import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDepartmentConfig } from '../../config/departments';
import { sanitizeScore, formatScore } from '../../utils/formatScore';
import DeptBadge from './DeptBadge';
import styles from './ScorePlate.module.css';

export default function ScorePlate({
  item,
  rank = 1,
  delay = 0,
  isHero = false
}) {
  const [displayScore, setDisplayScore] = useState(() => sanitizeScore(item.score));

  useEffect(() => {
    const end = sanitizeScore(item.score);
    let start = displayScore;

    if (start === end) {
      setDisplayScore(end);
      return;
    }

    const duration = 800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [item.score]);

  // Dept lookup
  const dept = getDepartmentConfig(item.code || item.deptCode || item.dept || item.name);

  // Rank-based accents
  const rankClass = rank === 1 ? styles.rankToken1 : rank === 2 ? styles.rankToken2 : styles.rankToken3;
  const strokeColor = rank === 1 ? '#ffd166' : rank === 2 ? '#e2e8f0' : '#d08a5b';



  return (
    <motion.div
      className={`${styles.scorePlateWrapper} ${rank === 1 ? styles.rank1Wrapper : ''} ${isHero ? styles.heroWrapper : ''} ${isHero && rank === 1 ? styles.heroRank1Wrapper : ''}`}
      style={{
        '--dept-accent': dept.accent || '#5cf2c8'
      }}
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.1, ease: 'easeOut' }}
    >
      {/* Rank Token Circle */}
      <div className={`${styles.rankToken} ${rankClass} ${isHero ? styles.heroRankToken : ''}`}>
        {rank}
      </div>

      <div className={`${styles.platesContainer} ${rank === 1 ? styles.rank1Height : ''} ${isHero ? styles.heroPlatesContainer : ''} ${isHero && rank === 1 ? styles.heroRank1Height : ''}`}>
        {/* Name Plate */}
        <div className={`${styles.namePlate} ${isHero ? styles.heroNamePlate : ''}`}>


          {rank === 1 && (
            <svg className={`${styles.crownBadge} ${isHero ? styles.heroCrownBadge : ''}`} viewBox="0 0 24 24" fill="#ffd166">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          )}

          <svg className={styles.plateSvgBackground} viewBox="0 0 400 60" preserveAspectRatio="none">
            {/* Double Chamfered Frame */}
            <rect
              x="2"
              y="2"
              width="396"
              height="56"
              rx="6"
              fill="none"
              stroke={strokeColor}
              strokeWidth={isHero ? "2.0" : "1.8"}
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

          <div className={`${styles.namePlateTextContainer} ${isHero ? styles.heroTextContainer : ''}`}>
            <span className={`${styles.itemName} ${isHero ? styles.heroItemName : ''}`} title={dept.name || item.name}>
              {dept.name || item.name}
            </span>
            {dept.show && (
              <span className={`${styles.deptShowSubtitle} ${isHero ? styles.heroShowSubtitle : ''}`} title={dept.show}>
                {dept.show}
              </span>
            )}
          </div>

          {dept.short && (
            <div className={styles.badgeWrapper}>
              <DeptBadge short={dept.short} accent={dept.accent} size={isHero ? 40 : 38} />
            </div>
          )}
        </div>

        {/* Score Plate */}
        <div className={`${styles.scorePlate} ${isHero ? styles.heroScorePlate : ''}`}>
          <svg className={styles.plateSvgBackground} viewBox="0 0 130 60" preserveAspectRatio="none">
            <rect
              x="2"
              y="2"
              width="126"
              height="56"
              rx="6"
              fill="none"
              stroke={strokeColor}
              strokeWidth={isHero ? "2.0" : "1.8"}
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

          <span className={`${styles.itemScore} ${isHero ? styles.heroItemScore : ''}`}>
            {formatScore(displayScore)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
