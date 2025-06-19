"use client";

import React, { useEffect, useState } from 'react';

interface DifficultyStats {
  difficulty: string;
  total_questions: number | bigint;
  attempted_questions: number | bigint;
  accuracy: number | bigint;
}

export default function ByDifficultyPage() {
  const [difficultyStats, setDifficultyStats] = useState<DifficultyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDifficultyStats() {
      setLoading(true);
      try {
        const res = await fetch('/api/practice/by-difficulty');
        if (!res.ok) throw new Error('Failed to fetch difficulty stats');
        const data = await res.json();
        setDifficultyStats(data);
      } catch {
        setError('Could not load difficulty stats.');
      } finally {
        setLoading(false);
      }
    }
    fetchDifficultyStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Practice by Difficulty</h1>
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead>
          <tr>
            <th className="px-2 py-2">Difficulty</th>
            <th className="px-2 py-2">Total Questions</th>
            <th className="px-2 py-2">Attempted</th>
            <th className="px-2 py-2">Accuracy (%)</th>
          </tr>
        </thead>
        <tbody>
          {difficultyStats.map((stat) => (
            <tr key={stat.difficulty}>
              <td className="px-2 py-2">{stat.difficulty}</td>
              <td className="px-2 py-2">{Number(stat.total_questions)}</td>
              <td className="px-2 py-2">{Number(stat.attempted_questions)}</td>
              <td className="px-2 py-2">{Number(stat.accuracy)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 