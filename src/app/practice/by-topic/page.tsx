"use client";

import React, { useEffect, useState } from 'react';

interface TopicStats {
  topic: string;
  total_questions: number | bigint;
  attempted_questions: number | bigint;
  accuracy: number | bigint;
}

export default function ByTopicPage() {
  const [topicStats, setTopicStats] = useState<TopicStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopicStats() {
      setLoading(true);
      try {
        const res = await fetch('/api/practice/by-topic');
        if (!res.ok) throw new Error('Failed to fetch topic stats');
        const data = await res.json();
        setTopicStats(data);
      } catch (err) {
        setError('Could not load topic stats.');
      } finally {
        setLoading(false);
      }
    }
    fetchTopicStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Practice by Topic</h1>
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead>
          <tr>
            <th className="px-2 py-2">Topic</th>
            <th className="px-2 py-2">Total Questions</th>
            <th className="px-2 py-2">Attempted</th>
            <th className="px-2 py-2">Accuracy (%)</th>
          </tr>
        </thead>
        <tbody>
          {topicStats.map((stat) => (
            <tr key={stat.topic}>
              <td className="px-2 py-2">{stat.topic}</td>
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