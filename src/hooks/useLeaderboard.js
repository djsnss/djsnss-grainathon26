import { useState, useEffect, useMemo } from 'react';
import { leaderboardData } from '../data/leaderboardData';
import { DEPARTMENTS } from '../config/departments';
import { COMMITTEES_LIST } from '../config/committees';

// Helper to normalize committee strings for robust matching:
// Trims whitespace, converts to uppercase, removes leading "DJS ", and collapses multiple spaces.
function normalizeCommitteeName(name = '') {
  return String(name)
    .trim()
    .toUpperCase()
    .replace(/^DJS\s+/i, '')
    .replace(/\s+/g, ' ');
}

// Track logged unknown committee names so console.warn fires ONCE per unknown committee
const loggedUnknownCommittees = new Set();

export function useLeaderboard(dataKey = 'topDepartments') {
  const [data, setData] = useState(leaderboardData[dataKey] || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      setData(leaderboardData[dataKey] || []);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [dataKey]);

  const sortedList = useMemo(() => {
    // --- DEPARTMENT FILTER ---
    if (dataKey === 'topDepartments') {
      const filteredData = data.filter((item) => {
        const code = String(item.code || item.deptCode || item.dept || item.name || '').toUpperCase().trim();
        return Boolean(DEPARTMENTS[code]);
      });
      const list = [...filteredData].sort((a, b) => b.score - a.score);
      return list.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
    }

    // --- COMMITTEE PROCESSING (Master List Fallback & Overlay) ---
    if (dataKey === 'topCommittees') {
      // 1. Build initial master map initialized at 0 score for all 14 official committees
      const committeeMap = new Map();
      COMMITTEES_LIST.forEach((officialName, idx) => {
        const normKey = normalizeCommitteeName(officialName);
        committeeMap.set(normKey, {
          id: `master-${idx + 1}`,
          name: officialName,
          score: 0,
          isOfficial: true
        });
      });

      const unknownItems = [];

      // 2. Overlay scores from incoming data
      data.forEach((item) => {
        const normKey = normalizeCommitteeName(item.name);
        if (committeeMap.has(normKey)) {
          const committee = committeeMap.get(normKey);
          committee.score = Number(item.score) || 0;
          if (item.id) committee.id = item.id;
        } else {
          // Log console.warn ONCE per unknown committee name and retain with its score
          if (!loggedUnknownCommittees.has(item.name)) {
            console.warn(`[Leaderboard] Unknown committee name in data: "${item.name}"`);
            loggedUnknownCommittees.add(item.name);
          }
          unknownItems.push({
            id: item.id || `unknown-${item.name}`,
            name: item.name,
            score: Number(item.score) || 0
          });
        }
      });

      // 3. Combine master committees (with overlay scores or 0) + any unknown entries
      const combined = [...committeeMap.values(), ...unknownItems];

      // 4. Sort by score descending; break ties alphabetically by committee name (stable)
      combined.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.name.localeCompare(b.name);
      });

      // 5. Re-assign ranks 1 to N
      return combined.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
    }

    const list = [...data].sort((a, b) => b.score - a.score);
    return list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [data, dataKey]);

  const topThree = useMemo(() => sortedList.slice(0, 3), [sortedList]);
  const trailingRows = useMemo(() => sortedList.slice(3), [sortedList]);

  return {
    items: sortedList,
    topThree,
    trailingRows,
    loading,
    error
  };
}
