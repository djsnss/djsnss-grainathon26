import {
  API_BASE,
  ENDPOINTS,
  POLL_INTERVAL_MS,
  REQUEST_TIMEOUT_MS,
  ERROR_FALLBACK,
  SHOW_UNMATCHED_COMMITTEES
} from '../config/api';
import { DEPARTMENTS, normalizeDeptCode } from '../config/departments';
import { COMMITTEES_LIST } from '../config/committees';
import { sanitizeScore } from '../utils/formatScore';

// Helper to normalize committee strings for robust matching:
// Trims whitespace, converts to uppercase, removes leading "DJS ", and collapses multiple spaces.
function normalizeCommitteeName(name = '') {
  return String(name)
    .trim()
    .toUpperCase()
    .replace(/^DJS\s+/i, '')
    .replace(/\s+/g, ' ');
}

// Track logged unknown committee names so console.warn fires ONCE per unknown name
const loggedUnknownCommittees = new Set();

// 9 official department codes in order
const OFFICIAL_DEPTS = ['AIML', 'COMPS', 'IT', 'DS', 'EXTC', 'MECH', 'ICB', 'AIDS', 'OUTSIDER'];

// Generate zero-score fallback lists
export function createZeroDepartments() {
  return OFFICIAL_DEPTS.map((code, idx) => ({
    id: `dept-zero-${code}`,
    code,
    name: DEPARTMENTS[code]?.name || code,
    score: 0,
    rank: idx + 1
  }));
}

export function createZeroCommittees() {
  return COMMITTEES_LIST.map((officialName, idx) => ({
    id: `comm-zero-${idx + 1}`,
    name: officialName,
    score: 0,
    rank: idx + 1
  }));
}

// Helper: fetch with AbortController timeout
async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid response data: expected non-null object');
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Global Singleton Manager for API Polling and Data State
class ApiDataManager {
  constructor() {
    this.listeners = new Set();
    this.departments = createZeroDepartments();
    this.committees = createZeroCommittees();
    this.lastGoodDepartments = null;
    this.lastGoodCommittees = null;
    this.deptError = null;
    this.commError = null;
    this.isFetching = false;
    this.pollInterval = null;
    this.handleVisibility = null;
  }

  // Parse raw department JSON object: {"AIDS":392, "CSEDS":1514.6, ...}
  processDepartments(rawObj) {
    const scores = {};
    OFFICIAL_DEPTS.forEach(code => { scores[code] = 0; });

    if (rawObj && typeof rawObj === 'object') {
      Object.entries(rawObj).forEach(([rawKey, rawVal]) => {
        const officialCode = normalizeDeptCode(rawKey);
        if (officialCode && scores.hasOwnProperty(officialCode)) {
          scores[officialCode] = sanitizeScore(rawVal);
        }
      });
    }

    const list = OFFICIAL_DEPTS.map((code) => ({
      id: `dept-${code}`,
      code,
      name: DEPARTMENTS[code]?.name || code,
      score: scores[code]
    }));

    // Sort by raw score descending; break ties alphabetically
    list.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name);
    });

    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  // Parse raw committees JSON object: {"OTHER":{"Beats":29,"munsoc":5},"MECH":{"SAE":80}}
  processCommittees(rawObj) {
    const committeeMap = new Map();
    COMMITTEES_LIST.forEach((officialName, idx) => {
      const normKey = normalizeCommitteeName(officialName);
      committeeMap.set(normKey, {
        id: `comm-master-${idx + 1}`,
        name: officialName,
        score: 0
      });
    });

    const unknownMap = new Map();

    if (rawObj && typeof rawObj === 'object') {
      Object.values(rawObj).forEach((deptInnerObj) => {
        if (deptInnerObj && typeof deptInnerObj === 'object') {
          Object.entries(deptInnerObj).forEach(([rawCommName, rawVal]) => {
            const normKey = normalizeCommitteeName(rawCommName);
            const score = sanitizeScore(rawVal);

            if (committeeMap.has(normKey)) {
              committeeMap.get(normKey).score += score;
            } else if (SHOW_UNMATCHED_COMMITTEES) {
              if (!loggedUnknownCommittees.has(rawCommName)) {
                console.warn(`[API] Unmatched committee name in /api/committee: "${rawCommName}"`);
                loggedUnknownCommittees.add(rawCommName);
              }
              if (unknownMap.has(normKey)) {
                unknownMap.get(normKey).score += score;
              } else {
                unknownMap.set(normKey, {
                  id: `comm-unmatched-${rawCommName}`,
                  name: rawCommName,
                  score
                });
              }
            }
          });
        }
      });
    }

    const combined = [...committeeMap.values(), ...unknownMap.values()];

    // Sort by raw score descending; break ties alphabetically
    combined.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name);
    });

    return combined.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  async fetchAll() {
    if (!API_BASE || this.isFetching) return;
    if (typeof document !== 'undefined' && document.hidden) return;

    this.isFetching = true;

    const deptUrl = `${API_BASE}${ENDPOINTS.departments}`;
    const commUrl = `${API_BASE}${ENDPOINTS.committees}`;

    const [deptRes, commRes] = await Promise.allSettled([
      fetchWithTimeout(deptUrl, REQUEST_TIMEOUT_MS),
      fetchWithTimeout(commUrl, REQUEST_TIMEOUT_MS)
    ]);

    let deptChanged = false;
    let commChanged = false;

    // 1. Process Departments result independently
    if (deptRes.status === 'fulfilled') {
      this.deptError = null;
      const newList = this.processDepartments(deptRes.value);
      this.lastGoodDepartments = newList;
      if (JSON.stringify(newList) !== JSON.stringify(this.departments)) {
        this.departments = newList;
        deptChanged = true;
      }
    } else {
      console.warn(`[API Error] GET ${deptUrl} failed:`, deptRes.reason?.message || deptRes.reason);
      this.deptError = deptRes.reason;

      const fallbackList = (ERROR_FALLBACK === 'last' && this.lastGoodDepartments)
        ? this.lastGoodDepartments
        : createZeroDepartments();

      if (JSON.stringify(fallbackList) !== JSON.stringify(this.departments)) {
        this.departments = fallbackList;
        deptChanged = true;
      }
    }

    // 2. Process Committees result independently
    if (commRes.status === 'fulfilled') {
      this.commError = null;
      const newList = this.processCommittees(commRes.value);
      this.lastGoodCommittees = newList;
      if (JSON.stringify(newList) !== JSON.stringify(this.committees)) {
        this.committees = newList;
        commChanged = true;
      }
    } else {
      console.warn(`[API Error] GET ${commUrl} failed:`, commRes.reason?.message || commRes.reason);
      this.commError = commRes.reason;

      const fallbackList = (ERROR_FALLBACK === 'last' && this.lastGoodCommittees)
        ? this.lastGoodCommittees
        : createZeroCommittees();

      if (JSON.stringify(fallbackList) !== JSON.stringify(this.committees)) {
        this.committees = fallbackList;
        commChanged = true;
      }
    }

    this.isFetching = false;

    if (deptChanged || commChanged) {
      this.notifyListeners();
    }
  }

  startPolling() {
    if (!API_BASE || this.pollInterval) return;

    // Immediate initial fetch
    this.fetchAll();

    // Set up polling interval
    this.pollInterval = setInterval(() => {
      this.fetchAll();
    }, POLL_INTERVAL_MS);

    // Pause on tab hidden, resume on tab visible
    if (typeof document !== 'undefined') {
      this.handleVisibility = () => {
        if (!document.hidden) {
          this.fetchAll();
        }
      };
      document.addEventListener('visibilitychange', this.handleVisibility);
    }
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (typeof document !== 'undefined' && this.handleVisibility) {
      document.removeEventListener('visibilitychange', this.handleVisibility);
      this.handleVisibility = null;
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    if (this.listeners.size === 1 && API_BASE) {
      this.startPolling();
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }

  notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }
}

export const apiDataManager = new ApiDataManager();
