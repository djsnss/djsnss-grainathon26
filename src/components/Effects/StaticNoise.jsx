import React from 'react';
import styles from './StaticNoise.module.css';

export default function StaticNoise({ active }) {
  if (!active) return null;

  return (
    <div className={styles.noiseContainer}>
      <svg className={styles.noiseSvg} xmlns="http://www.w3.org/2000/svg">
        <filter id="staticNoiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#staticNoiseFilter)" />
      </svg>

      <div className={styles.whiteTearLine} />
    </div>
  );
}
