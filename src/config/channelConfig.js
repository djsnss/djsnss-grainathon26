import { CHANNEL_TICK_ANGLES, POINTER_REST_ANGLE } from './knobConfig';

// Safe range for rotation interval: 7000ms - 10000ms
export const ROTATION_INTERVAL_MS = 8000;

// Enable auto-scrolling for channels with overflowing content
export const AUTO_SCROLL = true;

// Maximum entries displayed in full leaderboard views
export const MAX_ENTRIES = 15;

/**
 * Channel Definitions:
 * - CH1 (id: 0, tickIndex: 0): Top 3 departments static podium.
 * - CH2 (id: 1, tickIndex: 1): Full department list.
 * - CH3 (id: 2, tickIndex: 2): Donating committees list.
 */
export const CHANNELS = [
  {
    id: 0,
    chCode: 'CH 01',
    tickIndex: 0,
    knobAngle: CHANNEL_TICK_ANGLES[0] - POINTER_REST_ANGLE,
    tapeLabel: 'LEADER BOARD',
    subTitle: 'TOP DEPARTMENTS',
    leftHeader: 'DEPARTMENT',
    rightHeader: 'SCORE',
    dataKey: 'topDepartments',
    limit: 3
  },
  {
    id: 1,
    chCode: 'CH 02',
    tickIndex: 1,
    knobAngle: CHANNEL_TICK_ANGLES[1] - POINTER_REST_ANGLE,
    tapeLabel: 'ALL DEPARTMENTS',
    subTitle: 'DEPARTMENT RANKINGS',
    leftHeader: 'DEPARTMENT',
    rightHeader: 'SCORE',
    dataKey: 'topDepartments',
    limit: MAX_ENTRIES
  },
  {
    id: 2,
    chCode: 'CH 03',
    tickIndex: 2,
    knobAngle: CHANNEL_TICK_ANGLES[2] - POINTER_REST_ANGLE,
    tapeLabel: 'TOP COMMITTEES',
    subTitle: 'COMMITTEE RANKINGS',
    leftHeader: 'COMMITTEE',
    rightHeader: 'SCORE',
    dataKey: 'topCommittees',
    limit: MAX_ENTRIES
  }
];
