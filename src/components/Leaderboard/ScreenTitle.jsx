import React from 'react';
import TapeLabel from './TapeLabel';
import styles from './ScreenTitle.module.css';

export default function ScreenTitle({ tapeLabel = 'LEADERBOARD' }) {
  return (
    <div className={styles.headerWrapper}>
      <h1 className={styles.mainTitle}>GRAINATHON 5.0</h1>
      <TapeLabel text={tapeLabel} />
    </div>
  );
}
