import React from 'react';
import styles from './Stage.module.css';

export default function Stage({ children, bgImage }) {
  const [hasBgImage, setHasBgImage] = React.useState(true);

  React.useEffect(() => {
    if (!bgImage) {
      setHasBgImage(false);
      return;
    }
    const img = new Image();
    img.src = bgImage;
    img.onload = () => setHasBgImage(true);
    img.onerror = () => setHasBgImage(false);
  }, [bgImage]);

  return (
    <div className={styles.stage}>
      {hasBgImage && bgImage ? (
        <div
          className={styles.bgContainer}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : (
        <div className={styles.fallbackGrid} />
      )}

      <div className={styles.vignetteOverlay} />

      <main className={styles.contentWrapper}>
        {children}
      </main>

      <div className={styles.creditBadge}>
        <span>DJSNSS</span> • GRAINATHON 5.0
      </div>
    </div>
  );
}
