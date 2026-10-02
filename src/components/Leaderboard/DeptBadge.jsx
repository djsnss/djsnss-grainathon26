import React from 'react';
import styles from './DeptBadge.module.css';

export default function DeptBadge({ short, accent = '#5cf2c8', size = 38 }) {
  if (!short) return null;

  // Auto-scale font size for longer dept short text (e.g. FRIENDS, OFFICE, HIMYM)
  let fontSize = size >= 34 ? 11 : 8.5;
  if (short.length >= 7) {
    fontSize = size >= 34 ? 7.5 : 6;
  } else if (short.length >= 5) {
    fontSize = size >= 34 ? 8.5 : 6.8;
  } else if (short.length >= 4) {
    fontSize = size >= 34 ? 9.5 : 7.6;
  }

  const strokeWidth = size >= 34 ? 1.6 : 1.2;

  return (
    <div
      className={styles.deptBadgeWrapper}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
      title={`Show Identity: ${short}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className={styles.deptBadgeSvg}
      >
        <defs>
          <filter id={`badge-glow-${short.replace(/[^a-zA-Z0-9]/g, '')}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular/Hex Token */}
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="rgba(6, 22, 26, 0.94)"
          stroke={accent}
          strokeWidth={strokeWidth}
          style={{ filter: `drop-shadow(0 0 4px ${accent})` }}
        />

        {/* Faint Inner Dotted Accent Ring */}
        <circle
          cx="20"
          cy="20"
          r="14.5"
          fill="none"
          stroke={accent}
          strokeWidth="0.7"
          strokeDasharray="3 2"
          opacity="0.45"
        />

        {/* Hand-drawn Arc Highlight */}
        <path
          d="M 9 14 A 13 13 0 0 1 31 14"
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        {/* Dept Short Text */}
        <text
          x="20"
          y="20.5"
          textAnchor="middle"
          dominantBaseline="central"
          fill={accent}
          fontSize={fontSize}
          fontWeight="800"
          fontFamily="var(--font-mono, monospace)"
          letterSpacing="0.4px"
          style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
        >
          {short}
        </text>
      </svg>
    </div>
  );
}
