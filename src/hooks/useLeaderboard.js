import { useState, useEffect, useMemo } from 'react';
import { leaderboardData } from '../data/leaderboardData';

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

  // TODO: Implement live API polling hook (e.g. setInterval every 30s to fetch /api/leaderboard)

  const sortedList = useMemo(() => {
    const list = [...data].sort((a, b) => b.score - a.score);
    return list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [data]);

  const topThree = useMemo(() => sortedList.slice(0, 3), [sortedList]);
  const trailingRows = useMemo(() => sortedList.slice(3, 8), [sortedList]);

  return {
    items: sortedList,
    topThree,
    trailingRows,
    loading,
    error
  };
}
