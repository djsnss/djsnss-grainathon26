import React from 'react';
import styles from './TVCabinet.module.css';

export default function TVCabinet({ children }) {
  return (
    <div className={styles.cabinetWrapper}>
      <div className={styles.woodBody}>
        <div className={styles.topEdgeHighlight} />

        {/* SVG Wood-Grain Texture Overlay Filter */}
        <svg className={styles.woodGrainTexture} xmlns="http://www.w3.org/2000/svg">
          <filter id="woodGrainFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05 0.005"
              numOctaves="3"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#woodGrainFilter)" />
        </svg>

        {children}
      </div>

      {/* Two Vintage Wooden Stubby Feet */}
      <div className={styles.feetContainer}>
        <div className={styles.stubbyFoot} />
        <div className={styles.stubbyFoot} />
      </div>
    </div>
  );
}
