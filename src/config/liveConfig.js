// Configuration for auto-rotation and live display behavior
export const LIVE_CONFIG = {
  // Flag to enable or disable automatic channel switching (true = switch between channels)
  ENABLE_CHANNEL_SWITCHING: true,

  // Flag to enable or disable automatic page rotation (true = rotate pages on the current channel)
  ENABLE_PAGE_ROTATION: true,

  // Time in milliseconds to display each page before advancing (5000ms = 5 seconds)
  PAGE_ROTATION_INTERVAL_MS: 3000,

  // The last page stays on screen for at least this long, safe range 2000-5000
  LAST_PAGE_MIN_MS: 3000,

  // Duration in milliseconds to pause auto-rotation after manual user interaction (15000ms = 15 seconds)
  MANUAL_PAUSE_MS: 7000
};
