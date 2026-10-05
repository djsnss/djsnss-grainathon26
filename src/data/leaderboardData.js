import { CHANNELS } from '../config/channelConfig';

export { CHANNELS };

export const leaderboardData = {
  topDepartments: [
    { id: 1, code: 'AIML', name: 'AIML', score: 1250 },
    { id: 2, code: 'COMPS', name: 'COMPS', score: 1120 },
    { id: 3, code: 'IT', name: 'IT', score: 980 },
    { id: 4, code: 'DS', name: 'DS', score: 860 },
    { id: 5, code: 'EXTC', name: 'EXTC', score: 740 },
    { id: 6, code: 'MECH', name: 'MECH', score: 610 },
    { id: 7, code: 'ICB', name: 'ICB', score: 540 },
    { id: 8, code: 'AIDS', name: 'AIDS', score: 420 },
    { id: 9, code: 'OTHER', name: 'OTHER', score: 310 }
  ],
  topCommittees: [
    { id: 1, name: 'DJS ACM', score: 980 },
    { id: 2, name: 'DJS CSI', score: 890 },
    { id: 3, name: 'DJS GDG', score: 810 },
    { id: 4, name: 'DJS SAE', score: 720 },
    { id: 5, name: 'DJS MUNSOC', score: 650 },
    { id: 6, name: 'DJS Beats', score: 580 },
    { id: 7, name: 'DJS Express', score: 490 },
    { id: 8, name: 'DJS S4DS', score: 380 }
    // Remaining committees (DJS IETE, DJS ISACA, DJS LITSOC, DJS Dhadak, DJS Aura, DJS Antariksh) are omitted to verify score 0 fallback
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
