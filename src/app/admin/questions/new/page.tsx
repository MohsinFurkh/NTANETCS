'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import Image from 'next/image';

const ADMIN_EMAILS = ['mohsinfurkh@gmail.com', 'sayimamukhtar@gmail.com'];

interface QuestionForm {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  subject: string;
  topic: string;
  year: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isFree: boolean;
}

const SUBJECTS = [
  'Computer Fundamentals',
  'Operating Systems',
  'Computer Networks',
  'Database Management',
  'Data Structures',
  'Algorithms',
  'Software Engineering',
  'Web Technologies',
  'Computer Security',
  'Programming Concepts',
];

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export default function AddNewQuestion() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/auth/login';
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<QuestionForm>({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
    explanation: '',
    subject: SUBJECTS[0],
    topic: '',
    year: new Date().getFullYear(),
    difficulty: 'Medium',
    isFree: false,
  });

  const [questionImageUrl, setQuestionImageUrl] = useState<string | null>(null);
  const [optionAImageUrl, setOptionAImageUrl] = useState<string | null>(null);
  const [optionBImageUrl, setOptionBImageUrl] = useState<string | null>(null);
  const [optionCImageUrl, setOptionCImageUrl] = useState<string | null>(null);
  const [optionDImageUrl, setOptionDImageUrl] = useState<string | null>(null);
  const [explanationImageUrl, setExplanationImageUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? Number(newValue) : newValue,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrl: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add question');
      }

      setSuccess(true);
      setFormData({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A',
        explanation: '',
        subject: SUBJECTS[0],
        topic: '',
        year: new Date().getFullYear(),
        difficulty: 'Medium',
        isFree: false,
      });

      // Redirect to questions list after successful submission
      setTimeout(() => {
        router.push('/admin/questions');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Question</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Question added successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Text */}
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">
              Question Text
            </label>
            <textarea
              id="question"
              name="question"
              rows={4}
              required
              value={formData.question}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
            <div className="mt-2">
              <span className="text-xs text-gray-500">LaTeX Preview:</span>
              <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
                <BlockMath math={formData.question} errorColor="#cc0000" />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-500">Optional Image</label>
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, setQuestionImageUrl)} />
              {questionImageUrl && (
                <Image src={questionImageUrl} alt="Question" className="mt-2 max-h-32" width={300} height={128} />
              )}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="optionA" className="block text-sm font-medium text-gray-700">
                Option A
              </label>
              <input
                type="text"
                id="optionA"
                name="optionA"
                required
                value={formData.optionA}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              <div className="mt-2">
                <span className="text-xs text-gray-500">LaTeX Preview:</span>
                <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
                  <BlockMath math={formData.optionA} errorColor="#cc0000" />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-500">Optional Image</label>
                <input type="file" accept="image/*" onChange={e => handleImageChange(e, setOptionAImageUrl)} />
                {optionAImageUrl && (
                  <Image src={optionAImageUrl} alt="Option A" className="mt-2 max-h-24" width={200} height={96} />
                )}
              </div>
            </div>
            <div>
              <label htmlFor="optionB" className="block text-sm font-medium text-gray-700">
                Option B
              </label>
              <input
                type="text"
                id="optionB"
                name="optionB"
                required
                value={formData.optionB}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              <div className="mt-2">
                <span className="text-xs text-gray-500">LaTeX Preview:</span>
                <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
                  <BlockMath math={formData.optionB} errorColor="#cc0000" />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-500">Optional Image</label>
                <input type="file" accept="image/*" onChange={e => handleImageChange(e, setOptionBImageUrl)} />
                {optionBImageUrl && (
                  <Image src={optionBImageUrl} alt="Option B" className="mt-2 max-h-24" width={200} height={96} />
                )}
              </div>
            </div>
            <div>
              <label htmlFor="optionC" className="block text-sm font-medium text-gray-700">
                Option C
              </label>
              <input
                type="text"
                id="optionC"
                name="optionC"
                required
                value={formData.optionC}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              <div className="mt-2">
                <span className="text-xs text-gray-500">LaTeX Preview:</span>
                <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
                  <BlockMath math={formData.optionC} errorColor="#cc0000" />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-500">Optional Image</label>
                <input type="file" accept="image/*" onChange={e => handleImageChange(e, setOptionCImageUrl)} />
                {optionCImageUrl && (
                  <Image src={optionCImageUrl} alt="Option C" className="mt-2 max-h-24" width={200} height={96} />
                )}
              </div>
            </div>
            <div>
              <label htmlFor="optionD" className="block text-sm font-medium text-gray-700">
                Option D
              </label>
              <input
                type="text"
                id="optionD"
                name="optionD"
                required
                value={formData.optionD}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              <div className="mt-2">
                <span className="text-xs text-gray-500">LaTeX Preview:</span>
                <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
                  <BlockMath math={formData.optionD} errorColor="#cc0000" />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-500">Optional Image</label>
                <input type="file" accept="image/*" onChange={e => handleImageChange(e, setOptionDImageUrl)} />
                {optionDImageUrl && (
                  <Image src={optionDImageUrl} alt="Option D" className="mt-2 max-h-24" width={200} height={96} />
                )}
              </div>
            </div>
          </div>

          {/* Correct Option */}
          <div>
            <label htmlFor="correctOption" className="block text-sm font-medium text-gray-700">
              Correct Option
            </label>
            <select
              id="correctOption"
              name="correctOption"
              required
              value={formData.correctOption}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>

          {/* Explanation */}
          <div>
            <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
              Explanation
            </label>
            <textarea
              id="explanation"
              name="explanation"
              rows={3}
              required
              value={formData.explanation}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
            <div className="mt-2">
              <span className="text-xs text-gray-500">LaTeX Preview:</span>
              <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
                <BlockMath math={formData.explanation} errorColor="#cc0000" />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-500">Optional Image</label>
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, setExplanationImageUrl)} />
              {explanationImageUrl && (
                <Image src={explanationImageUrl} alt="Explanation" className="mt-2 max-h-32" width={300} height={128} />
              )}
            </div>
          </div>

          {/* Subject and Topic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                {SUBJECTS.map((subject: string) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                required
                value={formData.topic}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          {/* Year and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                required
                min="2000"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                name="difficulty"
                required
                value={formData.difficulty}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                {DIFFICULTY_LEVELS.map((level: string) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Free/Premium Option */}
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="isFree"
              name="isFree"
              checked={formData.isFree}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isFree" className="text-sm font-medium">
              Make this question free
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 