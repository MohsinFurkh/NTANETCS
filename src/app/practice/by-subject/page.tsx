'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SubjectStats {
  subject: string;
  totalQuestions: number;
  attempted: number;
  accuracy: number;
}

export default function SubjectPracticePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/auth/login';
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectStats[]>([]);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await fetch('/api/practice/subjects');
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchSubjects();
    }
  }, [session]);

  const handleStartPractice = (subject: string) => {
    router.push(`/practice/by-subject/${encodeURIComponent(subject)}`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Practice by Subject</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject: SubjectStats) => (
          <div
            key={subject.subject}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">{subject.subject}</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-medium">{subject.totalQuestions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Attempted:</span>
                <span className="font-medium">{subject.attempted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-medium">{subject.accuracy}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${(subject.attempted / subject.totalQuestions) * 100}%` }}
              ></div>
            </div>

            <button
              onClick={() => handleStartPractice(subject.subject)}
              className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Start Practice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 