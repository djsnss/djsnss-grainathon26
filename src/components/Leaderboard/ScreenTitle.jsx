import React from 'react';
import TapeLabel from './TapeLabel';
import { SCREEN_TITLE } from '../../config/leaderboardConfig';
import styles from './ScreenTitle.module.css';

export default function ScreenTitle({ tapeLabel = 'LEADER BOARD' }) {
  return (
    <div className={styles.headerWrapper}>
      <h1 className={styles.mainTitle}>{SCREEN_TITLE}</h1>
      <TapeLabel text={tapeLabel} />
    </div>
  );
}
