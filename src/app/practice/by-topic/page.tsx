"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BlockMath } from 'react-katex';

interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  explanation: string;
  difficulty: string;
  topic: string;
}

export default function ByTopicPracticePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/auth/login';
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ attempted: 0, correct: 0 });
  const [topic, setTopic] = useState<string | null>(null);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);

  // Fetch available topics for selection
  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch('/api/practice/by-topic');
        const data = await res.json();
        const topics = data.map((item: { topic: string }) => item.topic).filter(Boolean);
        setAvailableTopics(topics);
        if (topics.length > 0 && topic === null) setTopic(topics[0]);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    }
    fetchTopics();
  }, []);

  // Fetch questions for the selected topic
  useEffect(() => {
    async function fetchQuestions() {
      if (!topic) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/practice/questions?topic=${encodeURIComponent(topic)}`);
        const data = await res.json();
        setQuestions(data);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowExplanation(false);
        setIsCorrect(null);
        setStats({ attempted: 0, correct: 0 });
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    }
    if (session && topic) fetchQuestions();
  }, [session, topic]);

  const handleOptionSelect = async (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    try {
      const response = await fetch('/api/practice/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: questions[currentQuestionIndex].id,
          answer: option,
        }),
      });
      const data = await response.json();
      setIsCorrect(data.isCorrect);
      setShowExplanation(true);
      setStats(prev => ({
        attempted: prev.attempted + 1,
        correct: prev.correct + (data.isCorrect ? 1 : 0),
      }));
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setIsCorrect(null);
    }
  };
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setIsCorrect(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Questions Available for Topic {topic}</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Topic Selector */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Topic:</label>
          <select
            value={topic ?? ''}
            onChange={e => setTopic(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {availableTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Practice by Topic</h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Attempted: {stats.attempted}</p>
            <p className="text-sm text-gray-600">Correct: {stats.correct}</p>
            <p className="text-sm text-gray-600">
              Accuracy: {stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0}%
            </p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-medium flex-1 pr-4">
              <BlockMath math={currentQuestion.text} />
            </h2>
            <span className="px-2 py-1 text-sm rounded bg-gray-100 text-gray-600">
              {currentQuestion.difficulty}
            </span>
          </div>
          {/* Options */}
          <div className="space-y-4">
            {['A', 'B', 'C', 'D'].map((option: string) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={!!selectedOption}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedOption === option
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                } ${selectedOption ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="font-medium">{option}.</span>{' '}
                <BlockMath math={currentQuestion[`option${option}` as keyof Question] as string} />
              </button>
            ))}
          </div>
        </div>
        {/* Explanation */}
        {showExplanation && (
          <div className={`bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 ${
            isCorrect ? 'border-green-500' : 'border-red-500'
          }`}>
            <h3 className="font-medium mb-2">Explanation</h3>
            <BlockMath math={currentQuestion.explanation} />
          </div>
        )}
        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevQuestion}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </button>
          {showExplanation && (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 