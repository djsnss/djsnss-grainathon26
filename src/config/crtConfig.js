/**
 * CRT Effect Configuration
 * Each property controls a specific visual aspect of the CRT screen overlay.
 */
export const CRT = {
  // Opacity of the scanline pattern overlay (Safe range: 0.05 - 0.40)
  scanlineOpacity: 0.06,

  // Height of each scanline row in pixels (Safe range: 1 - 6 px)
  scanlineSize: 3,

  // Duration of scanline downward drift animation in seconds (Safe range: 2 - 20 s/loop)
  scanlineDriftSpeed: 4,

  // Opacity of the rolling scan bar (Safe range: 0.02 - 0.25)
  rollBarOpacity: 0.10,

  // Height of the rolling bar as percentage of screen height (Safe range: 10 - 40 %)
  rollBarHeight: 22,

  // Duration of roll bar top-to-bottom pass in seconds (Safe range: 3 - 15 s/pass)
  rollBarSpeed: 4.5,

  // Maximum opacity variance during screen flicker (Safe range: 0.01 - 0.15)
  flickerIntensity: 0.05,

  // Duration of single flicker animation cycle in seconds (Safe range: 0.05 - 0.5 s)
  flickerSpeed: 0.10,

  // Horizontal displacement jitter in pixels (Safe range: 0 - 2 px)
  jitterAmount: 0.6,

  // Chromatic aberration color fringe displacement in pixels (Safe range: 0 - 2 px)
  chromaticOffset: 0.6
};

// Respect user preference for reduced motion under prefers-reduced-motion
export const RESPECT_REDUCED_MOTION = true;
