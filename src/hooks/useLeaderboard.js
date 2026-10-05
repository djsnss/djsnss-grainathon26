import { useState, useEffect, useMemo } from 'react';
import { API_BASE } from '../config/api';
import { apiDataManager } from '../services/apiService';
import { leaderboardData } from '../data/leaderboardData';
import { DEPARTMENTS, normalizeDeptCode } from '../config/departments';
import { COMMITTEES_LIST } from '../config/committees';
import { sanitizeScore } from '../utils/formatScore';

// Helper to normalize committee strings for robust matching:
function normalizeCommitteeName(name = '') {
  return String(name)
    .trim()
    .toUpperCase()
    .replace(/^DJS\s+/i, '')
    .replace(/\s+/g, ' ');
}

// Track logged unknown committee names for mock fallback mode
const loggedUnknownCommitteesMock = new Set();

export function useLeaderboard(dataKey = 'topDepartments') {
  // If API_BASE is non-empty, use real API data manager. Otherwise, use mock data.
  const isApiMode = Boolean(API_BASE);

  const [apiTick, setApiTick] = useState(0);

  useEffect(() => {
    if (!isApiMode) return;
    const unsubscribe = apiDataManager.subscribe(() => {
      setApiTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, [isApiMode]);

  // --- MOCK MODE DATA GENERATION ---
  const mockSortedList = useMemo(() => {
    if (isApiMode) return [];
    const rawData = leaderboardData[dataKey] || [];

    if (dataKey === 'topDepartments') {
      const filteredData = rawData.filter((item) => {
        const code = String(item.code || item.deptCode || item.dept || item.name || '').toUpperCase().trim();
        return Boolean(DEPARTMENTS[code]);
      });
      const list = [...filteredData].sort((a, b) => sanitizeScore(b.score) - sanitizeScore(a.score));
      return list.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
    }

    if (dataKey === 'topCommittees') {
      const committeeMap = new Map();
      COMMITTEES_LIST.forEach((officialName, idx) => {
        const normKey = normalizeCommitteeName(officialName);
        committeeMap.set(normKey, {
          id: `master-${idx + 1}`,
          name: officialName,
          score: 0
        });
      });

      const unknownItems = [];

      rawData.forEach((item) => {
        const normKey = normalizeCommitteeName(item.name);
        if (committeeMap.has(normKey)) {
          const committee = committeeMap.get(normKey);
          committee.score = sanitizeScore(item.score);
          if (item.id) committee.id = item.id;
        } else {
          if (!loggedUnknownCommitteesMock.has(item.name)) {
            console.warn(`[Leaderboard Mock] Unknown committee name in data: "${item.name}"`);
            loggedUnknownCommitteesMock.add(item.name);
          }
          unknownItems.push({
            id: item.id || `unknown-${item.name}`,
            name: item.name,
            score: sanitizeScore(item.score)
          });
        }
      });

      const combined = [...committeeMap.values(), ...unknownItems];
      combined.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.name.localeCompare(b.name);
      });

      return combined.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
    }

    const list = [...rawData].sort((a, b) => sanitizeScore(b.score) - sanitizeScore(a.score));
    return list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [dataKey, isApiMode]);

  // --- FINAL LIST SELECTION ---
  const sortedList = useMemo(() => {
    if (!isApiMode) {
      return mockSortedList;
    }

    if (dataKey === 'topDepartments') {
      return apiDataManager.departments;
    }

    if (dataKey === 'topCommittees') {
      return apiDataManager.committees;
    }

    return apiDataManager.departments;
  }, [isApiMode, mockSortedList, dataKey, apiTick]);

  const topThree = useMemo(() => sortedList.slice(0, 3), [sortedList]);
  const trailingRows = useMemo(() => sortedList.slice(3), [sortedList]);

  const error = isApiMode
    ? (dataKey === 'topDepartments' ? apiDataManager.deptError : apiDataManager.commError)
    : null;

  return {
    items: sortedList,
    topThree,
    trailingRows,
    loading: false,
    error
  };
}
