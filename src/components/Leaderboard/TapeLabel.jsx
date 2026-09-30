import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TapeLabel.module.css';

export default function TapeLabel({ text = 'LEADERBOARD' }) {
  return (
    <div className={styles.tapeContainer}>
      {/* SVG Masking Tape background with torn zigzag left and right edges */}
      <svg
        className={styles.tapeSvg}
        viewBox="0 0 240 40"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3e8d2" />
            <stop offset="50%" stopColor="#ebdcb9" />
            <stop offset="100%" stopColor="#d9c59e" />
          </linearGradient>
          <filter id="paperFiber">
            <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="2" result="noise" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        </defs>

        {/* Torn Edge Path */}
        <path
          d="M 8,4 
             L 12,1 L 16,5 L 20,2 L 24,6 
             L 220,6 L 224,2 L 228,5 L 232,1 L 236,4 
             L 234,36 L 230,39 L 226,35 L 222,38 L 218,34
             L 20,34 L 16,38 L 12,35 L 8,39 L 4,36 Z"
          fill="url(#tapeGrad)"
          stroke="#cca46e"
          strokeWidth="0.8"
          filter="url(#paperFiber)"
        />
      </svg>

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
