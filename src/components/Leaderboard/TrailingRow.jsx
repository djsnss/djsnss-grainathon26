import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDepartmentConfig } from '../../config/departments';
import { sanitizeScore, formatScore } from '../../utils/formatScore';
import DeptBadge from './DeptBadge';
import styles from './TrailingRow.module.css';

export default function TrailingRow({ item, index = 0 }) {
  const dept = getDepartmentConfig(item.code || item.deptCode || item.dept || item.name);
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

  return (
    <motion.div
      className={styles.trailingRow}
      style={{
        '--dept-accent': dept.accent || 'transparent'
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 + index * 0.05 }}
    >
      <span className={styles.rankBadge}>
        #{item.rank}
      </span>

      <span className={styles.rowName} title={dept.name || item.name}>
        {dept.name || item.name}
      </span>

      {dept.short && (
        <div className={styles.deptBadgeWrapper}>
          <DeptBadge short={dept.short} accent={dept.accent} size={26} />
        </div>
      )}

      <div className={styles.dottedLeader} />

      <span className={styles.rowScore}>
        {formatScore(displayScore)}
      </span>
    </motion.div>
  );
}
