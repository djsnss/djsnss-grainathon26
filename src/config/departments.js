/**
 * SINGLE SOURCE OF TRUTH FOR DEPARTMENT IDENTITIES & TV SHOW THEMES
 * 
 * Edit accent colors, show names, and short badges in this file only.
 */
export const DEPARTMENTS = {
  DS:    { name: 'DS',    show: 'Brooklyn Nine-Nine',    short: 'B99',     accent: '#4aa3ff' },
  COMPS: { name: 'COMPS', show: 'The Big Bang Theory',   short: 'TBBT',    accent: '#ffd23f' },
  IT:    { name: 'IT',    show: 'The Office',            short: 'OFFICE',  accent: '#8fd16a' },
  MECH:  { name: 'MECH',  show: 'Breaking Bad',          short: 'Br/Ba',   accent: '#3fbf6b' },
  EXTC:  { name: 'EXTC',  show: 'How I Met Your Mother', short: 'HIMYM',   accent: '#ff9f45' },
  AIML:  { name: 'AIML',  show: 'Friends',               short: 'FRIENDS', accent: '#ff5a6e' },
  ICB:      { name: 'ICB',      show: 'Stranger Things',       short: 'ST',    accent: '#ff3b3b' },
  AIDS:     { name: 'AIDS',     show: 'Modern Family',         short: 'MF',    accent: '#b78cff' },
  OUTSIDER: { name: 'OUTSIDER', show: 'Guest Stars',           short: 'GUEST', accent: '#9fb8b5' }
};

export const DEFAULT_DEPARTMENT = {
  name: '',
  show: '',
  short: '',
  accent: ''
};

/**
 * Look up department config by department code or name.
 * Unknown codes fall back to neutral defaults with no show or badge.
 * Automatically maps legacy "AIHL" code to "AIML".
 */
export function getDepartmentConfig(itemOrCode) {
  if (!itemOrCode) return DEFAULT_DEPARTMENT;

  const rawCode = typeof itemOrCode === 'string'
    ? itemOrCode
    : (itemOrCode.code || itemOrCode.deptCode || itemOrCode.dept || itemOrCode.name || '');

  if (!rawCode) return DEFAULT_DEPARTMENT;

  let upper = String(rawCode).toUpperCase().trim();
  if (upper === 'AIHL') upper = 'AIML';

  // Direct code match (e.g. "DS", "AIML")
  if (DEPARTMENTS[upper]) {
    return DEPARTMENTS[upper];
  }

  // Substring match for verbose department names (e.g. "AI & Data Science (AIML)")
  for (const key of Object.keys(DEPARTMENTS)) {
    if (upper.includes(key)) {
      return DEPARTMENTS[key];
    }
  }

  return { ...DEFAULT_DEPARTMENT, name: rawCode };
}
