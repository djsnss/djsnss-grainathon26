import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TapeLabel.module.css';

export default function TapeLabel({ text = 'LEADER BOARD' }) {
  return (
    <div className={styles.tapeContainer}>
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          className={styles.tapeText}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
