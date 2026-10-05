/**
 * SINGLE SOURCE OF TRUTH FOR DEPARTMENT IDENTITIES & TV SHOW THEMES
 * 
 * Edit accent colors, show names, and short badges in this file only.
 */
export const DEPARTMENTS = {
  DS: { name: 'DS', show: 'Brooklyn Nine-Nine', short: 'B99', accent: '#4aa3ff' },
  COMPS: { name: 'COMPS', show: 'The Big Bang Theory', short: 'TBBT', accent: '#ffd23f' },
  IT: { name: 'IT', show: 'The Office', short: 'OFFICE', accent: '#8fd16a' },
  MECH: { name: 'MECH', show: 'Breaking Bad', short: 'Br/Ba', accent: '#3fbf6b' },
  EXTC: { name: 'EXTC', show: 'How I Met Your Mother', short: 'HIMYM', accent: '#ff9f45' },
  AIML: { name: 'AIML', show: 'Friends', short: 'FRIENDS', accent: '#ff5a6e' },
  ICB: { name: 'ICB', show: 'Stranger Things', short: 'ST', accent: '#ff3b3b' },
  AIDS: { name: 'AIDS', show: 'Modern Family', short: 'MF', accent: '#b78cff' },
  OTHER: { name: 'OTHER', show: 'Guest Stars', short: 'GUEST', accent: '#9fb8b5' }
};

export const DEFAULT_DEPARTMENT = {
  name: '',
  show: '',
  short: '',
  accent: ''
};

export const DEPARTMENT_ALIASES = {
  'CSEDS': 'DS',
  'OTHER': 'OUTSIDER',
  'AIHL': 'AIML',
  'GUEST': 'OUTSIDER'
};

/**
 * Normalizes a raw department code or alias to its official department key.
 * Example: "CSEDS" -> "DS", "OTHER" -> "OUTSIDER", "AIHL" -> "AIML".
 * Returns null if the code is unknown.
 */
export function normalizeDeptCode(rawCode = '') {
  if (!rawCode) return null;
  let upper = String(rawCode).trim().toUpperCase();
  if (DEPARTMENT_ALIASES[upper]) {
    upper = DEPARTMENT_ALIASES[upper];
  }
  if (DEPARTMENTS[upper]) {
    return upper;
  }
  return null;
}

/**
 * Look up department config by department code or name.
 * Unknown codes fall back to neutral defaults with no show or badge.
 */
export function getDepartmentConfig(itemOrCode) {
  if (!itemOrCode) return DEFAULT_DEPARTMENT;

  const rawCode = typeof itemOrCode === 'string'
    ? itemOrCode
    : (itemOrCode.code || itemOrCode.deptCode || itemOrCode.dept || itemOrCode.name || '');

  if (!rawCode) return DEFAULT_DEPARTMENT;

  const normalizedKey = normalizeDeptCode(rawCode);
  if (normalizedKey && DEPARTMENTS[normalizedKey]) {
    return DEPARTMENTS[normalizedKey];
  }

  return { ...DEFAULT_DEPARTMENT, name: rawCode };
}
