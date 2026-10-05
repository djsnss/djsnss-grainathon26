import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import ScreenTitle from './ScreenTitle';
import ColumnHeaders from './ColumnHeaders';
import ScorePlate from './ScorePlate';
import styles from './Leaderboard.module.css';

export default function Leaderboard({
  channel,
  pageIndex = 0,
  onSelectPage,
  isStatic = false
}) {
  const { tapeLabel, leftHeader, rightHeader, dataKey } = channel;
  const { items, topThree } = useLeaderboard(dataKey);

  // Hero static mode for Page "/" (CH1 top 3 static podium, no pagination)
  if (isStatic) {
    const leaderScore = topThree[0]?.score || 1250;
    return (
      <div className={styles.leaderboardContainer} aria-live="polite">
        <ScreenTitle tapeLabel={tapeLabel} />
        <ColumnHeaders leftHeader={leftHeader} rightHeader={rightHeader} />

        <div className={styles.heroContainer}>
          {topThree.map((item, index) => (
            <ScorePlate
              key={item.id || item.code || item.name || index}
              item={item}
              rank={item.rank}
              delay={index + 1}
              isHero={true}
              maxScore={leaderScore}
            />
          ))}
        </div>
      </div>
    );
  }

  // Interactive / Rotating mode for Page "/live" (CH2 / CH3 Paginated 3 Items/Page)
  const totalPages = Math.max(1, Math.ceil(items.length / 3));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const pageItems = items.slice(safePageIndex * 3, (safePageIndex + 1) * 3);

  return (
    <div className={styles.leaderboardContainer} aria-live="polite">
      {/* Title & Channel Tape Label (Fixed Header) */}
      <ScreenTitle tapeLabel={tapeLabel} />

      {/* Column Headers (Fixed Header) */}
      <ColumnHeaders leftHeader={leftHeader} rightHeader={rightHeader} />

      {/* Paginated Content Area */}
      <div className={styles.pagedWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${channel.id}-page-${safePageIndex}`}
            className={styles.pagedPlatesContainer}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {pageItems.map((item, index) => (
              <ScorePlate
                key={item.id || item.code || item.name || index}
                item={item}
                rank={item.rank}
                delay={index + 1}
                isHero={false}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Small Page Dots Indicator */}
        {totalPages > 1 && (
          <div className={styles.dotsContainer}>
            {Array.from({ length: totalPages }).map((_, pIdx) => (
              <button
                key={pIdx}
                type="button"
                className={`${styles.pageDot} ${pIdx === safePageIndex ? styles.activeDot : ''}`}
                onClick={() => onSelectPage?.(pIdx)}
                aria-label={`Go to page ${pIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
