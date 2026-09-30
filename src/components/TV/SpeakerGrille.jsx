import React from 'react';
import styles from './SpeakerGrille.module.css';

export default function SpeakerGrille({ slatsCount = 12 }) {
  return (
    <div className={styles.speakerFrame}>
      {Array.from({ length: slatsCount }).map((_, idx) => (
        <div key={idx} className={styles.slat} />
      ))}
    </div>
  );
}
