'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuestionForm {
  text: string;
  options: string[];
  answer: number;
  explanation: string;
  year: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isFree: boolean;
}

const initialForm: QuestionForm = {
  text: '',
  options: ['', '', '', ''],
  answer: 0,
  explanation: '',
  year: new Date().getFullYear().toString(),
  subject: '',
  topic: '',
  difficulty: 'Medium',
  isFree: false,
};

export default function AdminQuestions() {
  const [form, setForm] = useState<QuestionForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add question');
      }

      setMessage({ type: 'success', text: 'Question added successfully!' });
      setForm(initialForm);
      router.refresh();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add question. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Questions</h1>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Text */}
        <div>
          <label htmlFor="text" className="block text-sm font-medium mb-2">
            Question Text
          </label>
          <textarea
            id="text"
            rows={4}
            className="input"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            required
          />
        </div>

        {/* Options */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">Options</label>
          {form.options.map((option, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="radio"
                name="answer"
                checked={form.answer === index}
                onChange={() => setForm({ ...form, answer: index })}
                className="w-4 h-4"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...form.options];
                  newOptions[index] = e.target.value;
                  setForm({ ...form, options: newOptions });
                }}
                className="input flex-1"
                placeholder={`Option ${index + 1}`}
                required
              />
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div>
          <label htmlFor="explanation" className="block text-sm font-medium mb-2">
            Explanation
          </label>
          <textarea
            id="explanation"
            rows={4}
            className="input"
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            required
          />
        </div>

        {/* Year, Subject, Topic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="year" className="block text-sm font-medium mb-2">
              Year
            </label>
            <input
              type="number"
              id="year"
              className="input"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              min="2000"
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="input"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-2">
              Topic
            </label>
            <input
              type="text"
              id="topic"
              className="input"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Difficulty and Free/Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="input"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFree"
              className="w-4 h-4 mr-2"
              checked={form.isFree}
              onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
            />
            <label htmlFor="isFree" className="text-sm font-medium">
              Make this question free
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Adding Question...' : 'Add Question'}
        </button>
      </form>
    </div>
  );
} 