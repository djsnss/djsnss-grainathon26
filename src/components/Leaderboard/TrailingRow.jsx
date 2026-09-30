import React from 'react';
import { motion } from 'framer-motion';
import styles from './TrailingRow.module.css';

export default function TrailingRow({ item, index = 0 }) {
  return (
    <motion.div
      className={styles.trailingRow}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 + index * 0.05 }}
    >
      <span className={styles.rankBadge}>
        #{item.rank}
      </span>

      <span className={styles.rowName} title={item.name}>
        {item.name}
      </span>

      <div className={styles.dottedLeader} />

      <span className={styles.rowScore}>
        {item.score}
      </span>
    </motion.div>
  );
}
