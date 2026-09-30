import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ColumnHeaders.module.css';

export default function ColumnHeaders({ leftHeader = 'DEPARTMENT', rightHeader = 'SCORE' }) {
  return (
    <div className={styles.headersRow}>
      <AnimatePresence mode="wait">
        <motion.span
          key={leftHeader}
          className={styles.leftHeader}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.2 }}
        >
          {leftHeader}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.span
          key={rightHeader}
          className={styles.rightHeader}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
        >
          {rightHeader}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
