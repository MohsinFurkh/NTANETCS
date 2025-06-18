'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const ADMIN_EMAILS = ['mohsinfurkh@gmail.com', 'sayimamukhtar@gmail.com'];

interface DashboardStats {
  totalUsers: number;
  totalQuestions: number;
  totalMockTests: number;
  questionsBySubject: Array<{ subject: string; _count: number }>;
  questionsByYear: Array<{ year: number; _count: number }>;
  userStatistics: Array<{
    id: string;
    name: string | null;
    email: string;
    joinedDate: Date;
    questionsAttempted: number;
    mockTestsTaken: number;
    accuracy: number;
    averageScore: number;
  }>;
}

interface QuestionsBySubject {
  subject: string;
  _count: number;
}

interface QuestionsByYear {
  year: number;
  _count: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/auth/login';
    },
  });

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
      fetchStats();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return null;
  }

  if (!stats) {
    return <div>Error loading dashboard statistics.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Questions</h2>
          <p className="text-3xl font-bold text-primary">{stats.totalQuestions}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Mock Tests</h2>
          <p className="text-3xl font-bold text-primary">{stats.totalMockTests}</p>
        </div>
      </div>

      {/* Questions by Subject */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Questions by Subject</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.questionsBySubject.map((item: QuestionsBySubject) => (
                <tr key={item.subject}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item._count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Questions by Year */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Questions by Year</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.questionsByYear.map((item: QuestionsByYear) => (
                <tr key={item.year}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item._count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mock Tests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.userStatistics.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.joinedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.questionsAttempted}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.mockTestsTaken}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.accuracy}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.averageScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Link 
          href="/admin/questions/new"
          className="btn btn-primary w-full"
        >
          Add New Question
        </Link>
        <Link 
          href="/admin/mock-tests/new"
          className="btn btn-primary w-full"
        >
          Create Mock Test
        </Link>
        <Link 
          href="/admin/users"
          className="btn btn-primary w-full"
        >
          Manage Users
        </Link>
      </div>
    </div>
  );
} 