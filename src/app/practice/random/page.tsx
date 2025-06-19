"use client";

import React, { useEffect, useState } from 'react';

export default function RandomQuestionPage() {
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRandomQuestion() {
      setLoading(true);
      try {
        const res = await fetch('/api/practice/random');
        if (!res.ok) throw new Error('Failed to fetch random question');
        const data = await res.json();
        setQuestionId(data.id);
      } catch (err) {
        setError('Could not load random question.');
      } finally {
        setLoading(false);
      }
    }
    fetchRandomQuestion();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Random Practice Question</h1>
      {questionId ? (
        <div>Random Question ID: {questionId}</div>
      ) : (
        <div>No question found.</div>
      )}
    </div>
  );
} 