import { CHANNEL_TICK_ANGLES, POINTER_REST_ANGLE } from '../config/knobConfig';

export const leaderboardData = {
  topDepartments: [
    { id: 1, name: 'AI & Data Science (AIHL)', score: 1250 },
    { id: 2, name: 'Computer Engineering', score: 1120 },
    { id: 3, name: 'Information Technology', score: 980 },
    { id: 4, name: 'Electronics & Telecom', score: 860 },
    { id: 5, name: 'Mechanical Engineering', score: 740 },
    { id: 6, name: 'Civil Engineering', score: 610 },
    { id: 7, name: 'Cyber Security', score: 540 },
    { id: 8, name: 'Chemical Engineering', score: 420 }
  ],
  topCommittees: [
    { id: 1, name: 'Rotaract Club NSS', score: 980 },
    { id: 2, name: 'ACM Student Chapter', score: 890 },
    { id: 3, name: 'IEEE DJ Sanghvi', score: 810 },
    { id: 4, name: 'E-Cell DJCE', score: 720 },
    { id: 5, name: 'CSI Student Branch', score: 650 },
    { id: 6, name: 'NSS Cultural Wing', score: 580 }
  ],
  topDonors: [
    { id: 1, name: 'Siddharth Mehta', score: 5000 },
    { id: 2, name: 'Aarav Sharma', score: 3800 },
    { id: 3, name: 'Rohan Deshmukh', score: 2900 },
    { id: 4, name: 'Ananya Gupta', score: 2100 },
    { id: 5, name: 'Kavya Nair', score: 1650 },
    { id: 6, name: 'Vikramaditya Joshi', score: 1400 },
    { id: 7, name: 'Priya Iyer', score: 1100 }
  ]
};

export const CHANNELS = [
  {
    id: 0,
    knobAngle: CHANNEL_TICK_ANGLES[0] - POINTER_REST_ANGLE,
    tapeLabel: 'LEADERBOARD',
    subTitle: 'TOP DEPARTMENTS',
    leftHeader: 'DEPARTMENT',
    rightHeader: 'SCORE',
    dataKey: 'topDepartments',
    chCode: 'CH 01'
  },
  {
    id: 1,
    knobAngle: CHANNEL_TICK_ANGLES[1] - POINTER_REST_ANGLE,
    tapeLabel: 'TOP COMMITTEES',
    subTitle: 'COMMITTEE RANKINGS',
    leftHeader: 'COMMITTEE',
    rightHeader: 'SCORE',
    dataKey: 'topCommittees',
    chCode: 'CH 02'
  },
  {
    id: 2,
    knobAngle: CHANNEL_TICK_ANGLES[2] - POINTER_REST_ANGLE,
    tapeLabel: 'TOP DONORS',
    subTitle: 'DONOR HALL OF FAME',
    leftHeader: 'DONOR NAME',
    rightHeader: 'AMOUNT',
    dataKey: 'topDonors',
    chCode: 'CH 03'
  }
];

