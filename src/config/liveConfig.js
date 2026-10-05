// Configuration for auto-rotation and live display behavior
export const LIVE_CONFIG = {
  // Flag to enable or disable automatic channel switching (true = switch between channels)
  ENABLE_CHANNEL_SWITCHING: true,

  // Flag to enable or disable automatic page rotation (true = rotate pages on the current channel)
  ENABLE_PAGE_ROTATION: true,

  // Time in milliseconds to display each page before advancing (5000ms = 5 seconds)
  PAGE_ROTATION_INTERVAL_MS: 3000,

  // Minimum time in milliseconds to stay on a channel before switching (10000ms = 10 seconds)
  CHANNEL_SWITCH_INTERVAL_MS: 15000,

  // Duration in milliseconds to pause auto-rotation after manual user interaction (15000ms = 15 seconds)
  MANUAL_PAUSE_MS: 15000
};
