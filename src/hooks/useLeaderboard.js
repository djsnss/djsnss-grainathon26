import { useState, useEffect, useMemo } from 'react';
import { leaderboardData } from '../data/leaderboardData';
import { DEPARTMENTS } from '../config/departments';

export function useLeaderboard(dataKey = 'topDepartments') {
  const [data, setData] = useState(leaderboardData[dataKey] || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Synchronize or fetch data when dataKey changes
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      setData(leaderboardData[dataKey] || []);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [dataKey]);

  const sortedList = useMemo(() => {
    // --- DEPARTMENT FILTER (Easy to comment out or remove later) ---
    // Filters topDepartments to only valid codes matching DEPARTMENTS (drops unknown codes)
    let filteredData = data;
    if (dataKey === 'topDepartments') {
      filteredData = data.filter((item) => {
        const code = String(item.code || item.deptCode || item.dept || item.name || '').toUpperCase().trim();
        return Boolean(DEPARTMENTS[code]);
      });
    }
    // --- END DEPARTMENT FILTER ---

    const list = [...filteredData].sort((a, b) => b.score - a.score);
    return list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [data, dataKey]);

  const topThree = useMemo(() => sortedList.slice(0, 3), [sortedList]);
  const trailingRows = useMemo(() => sortedList.slice(3, 9), [sortedList]);

  return {
    items: sortedList,
    topThree,
    trailingRows,
    loading,
    error
  };
}
