import React, { useState, useEffect } from 'react';
import CRTOverlay from '../Effects/CRTOverlay';
import StaticNoise from '../Effects/StaticNoise';
import { CRT } from '../../config/crtConfig';
import styles from './TVScreen.module.css';

export default function TVScreen({ children, isStaticActive, channelCode }) {
  const [showOsd, setShowOsd] = useState(false);

  useEffect(() => {
    if (channelCode) {
      setShowOsd(true);
      const timer = setTimeout(() => setShowOsd(false), 1600);
      return () => clearTimeout(timer);
    }
  }, [channelCode]);

  const crtVars = {
    '--crt-scanline-opacity': CRT.scanlineOpacity,
    '--crt-scanline-size': `${CRT.scanlineSize}px`,
    '--crt-scanline-drift-speed': `${CRT.scanlineDriftSpeed}s`,
    '--crt-roll-opacity': CRT.rollBarOpacity,
    '--crt-roll-height': `${CRT.rollBarHeight}%`,
    '--crt-roll-speed': `${CRT.rollBarSpeed}s`,
    '--crt-flicker-intensity': CRT.flickerIntensity,
    '--crt-flicker-speed': `${CRT.flickerSpeed}s`,
    '--crt-jitter-amount': `${CRT.jitterAmount}px`,
    '--crt-chromatic-offset': `${CRT.chromaticOffset}px`
  };

  return (
    <div className={styles.screenBezelFrame}>
      <div className={styles.brassTrim} />

      <div className={styles.crtGlassArea} style={crtVars}>
        {/* On-Screen Display Channel Indicator */}
        {showOsd && (
          <div className={styles.osdBadge}>
            {channelCode}
          </div>
        )}

        {/* CRT Scanlines, Glow, & Glare Layers */}
        <CRTOverlay />

        {/* TV Channel Static Noise Burst Transition */}
        <StaticNoise active={isStaticActive} />

        {/* Safe Inner Content Canvas */}
        <div className={styles.screenInnerContent}>
          {children}
        </div>
      </div>
    </div>
  );
}
