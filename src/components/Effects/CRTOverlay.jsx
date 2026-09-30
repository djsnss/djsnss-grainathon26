import React from 'react';
import styles from './CRTOverlay.module.css';

export default function CRTOverlay() {
  return (
    <div className={styles.crtOverlayContainer}>
      <div className={styles.scanlines} />
      <div className={styles.rollBar} />
      <div className={styles.flicker} />
      <div className={styles.glassGlare} />
      <div className={styles.vignette} />
      <div className={styles.phosphorGlow} />
    </div>
  );
}
