import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { QuestionAttempt as PrismaQuestionAttempt } from '@prisma/client';

interface QuestionAttempt {
  id: string;
  isCorrect: boolean;
  createdAt: Date;
  questionText: string;
  subject: string;
}

interface MockTest {
  score: number;
  startedAt: Date;
  endedAt: Date | null;
  mockTest: {
    title: string;
    totalMarks: number;
  };
}

interface SubjectProgress {
  subject: string;
  totalQuestions: number;
  attempted: number;
  accuracy: number;
}

async function getStats() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Unauthorized');
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get overall statistics
    const [
      totalQuestions,
      totalAttempted,
      correctAttempts,
      subjectProgress,
      recentAttempts,
      mockTestStats
    ] = await Promise.all([
      // Total questions available
      prisma.question.count(),

      // Total questions attempted by user (unique questions)
      prisma.questionAttempt.findMany({
        where: {
          userId: user.id,
        },
        distinct: ['questionId'],
      }).then((attempts: PrismaQuestionAttempt[]) => attempts.length),

      // Total correct attempts (unique questions with correct answers)
      prisma.questionAttempt.findMany({
        where: {
          userId: user.id,
          isCorrect: true,
        },
        distinct: ['questionId'],
      }).then((attempts: PrismaQuestionAttempt[]) => attempts.length),

      // Progress by subject
      prisma.$queryRaw`
        WITH SubjectCounts AS (
          SELECT 
            subject,
            CAST(COUNT(*) AS INTEGER) as total
          FROM Question
          GROUP BY subject
        ),
        UserAttempts AS (
          SELECT 
            q.subject,
            COUNT(DISTINCT qa.questionId) as attempted,
            ROUND(CAST(AVG(CASE WHEN qa.isCorrect THEN 100.0 ELSE 0 END) AS FLOAT), 2) as accuracy
          FROM Question q
          JOIN QuestionAttempt qa ON q.id = qa.questionId
          WHERE qa.userId = ${user.id}
          GROUP BY q.subject
        )
        SELECT 
          sc.subject,
          sc.total as totalQuestions,
          COALESCE(CAST(ua.attempted AS INTEGER), 0) as attempted,
          COALESCE(CAST(ua.accuracy AS FLOAT), 0) as accuracy
        FROM SubjectCounts sc
        LEFT JOIN UserAttempts ua ON sc.subject = ua.subject
        ORDER BY sc.subject
      `,

      // Recent attempts (last 5 unique questions, taking the most recent attempt)
      prisma.$queryRaw`
        WITH RankedAttempts AS (
          SELECT 
            qa.id,
            qa.isCorrect,
            qa.createdAt,
            q.text as questionText,
            q.subject,
            ROW_NUMBER() OVER (PARTITION BY qa.questionId ORDER BY qa.createdAt DESC) as rn
          FROM QuestionAttempt qa
          JOIN Question q ON qa.questionId = q.id
          WHERE qa.userId = ${user.id}
        )
        SELECT 
          id,
          isCorrect,
          createdAt,
          questionText,
          subject
        FROM RankedAttempts
        WHERE rn = 1
        ORDER BY createdAt DESC
        LIMIT 5
      `,

      // Mock test statistics
      prisma.mockTestAttempt.findMany({
        where: {
          userId: user.id,
        },
        select: {
          score: true,
          startedAt: true,
          endedAt: true,
          mockTest: {
            select: {
              title: true,
              totalMarks: true,
            },
          },
        },
        orderBy: {
          startedAt: 'desc',
        },
        take: 5,
      }),
    ]);

    // Calculate overall accuracy
    const accuracy = totalAttempted > 0
      ? Math.round((correctAttempts / totalAttempted) * 100)
      : 0;

    // Calculate average mock test score
    const averageMockScore = mockTestStats.length > 0
      ? Math.round(
          (mockTestStats as MockTest[]).reduce((acc: number, test: MockTest) => 
            acc + (test.score / test.mockTest.totalMarks) * 100, 0
          ) / mockTestStats.length
        )
      : 0;

    return {
      overall: {
        totalQuestions,
        totalAttempted,
        correctAttempts,
        accuracy,
        averageMockScore,
      },
      subjectProgress: (subjectProgress as SubjectProgress[]).map((subject: SubjectProgress) => ({
        ...subject,
        progress: Math.round((Number(subject.attempted) / Number(subject.totalQuestions)) * 100),
      })),
      recentAttempts: (recentAttempts as QuestionAttempt[]).map((attempt: QuestionAttempt) => ({
        id: attempt.id,
        isCorrect: attempt.isCorrect,
        date: attempt.createdAt,
        questionText: attempt.questionText,
        subject: attempt.subject,
      })),
      mockTestStats: (mockTestStats as MockTest[]).map((test: MockTest) => ({
        title: test.mockTest.title,
        score: test.score,
        totalMarks: test.mockTest.totalMarks,
        percentage: Math.round((test.score / test.mockTest.totalMarks) * 100),
        date: test.startedAt,
        duration: test.endedAt 
          ? Math.round((test.endedAt.getTime() - test.startedAt.getTime()) / 60000)
          : null,
      })),
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      overall: {
        totalQuestions: 0,
        totalAttempted: 0,
        correctAttempts: 0,
        accuracy: 0,
        averageMockScore: 0,
      },
      subjectProgress: [],
      recentAttempts: [],
      mockTestStats: [],
    };
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const stats = await getStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {session.user?.name || 'Student'}!</h1>

      {/* Overall Progress Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>
          <div className="space-y-2">
            <p>Questions Attempted: {stats.overall.totalAttempted} / {stats.overall.totalQuestions}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${Math.round((stats.overall.totalAttempted / stats.overall.totalQuestions) * 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {Math.round((stats.overall.totalAttempted / stats.overall.totalQuestions) * 100)}% Complete
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Accuracy</h3>
          <div className="flex items-center justify-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-24 h-24">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                />
                <circle
                  className="text-blue-600"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 40}`,
                    strokeDashoffset: `${2 * Math.PI * 40 * (1 - stats.overall.accuracy / 100)}`,
                    transform: 'rotate(-90deg)',
                    transformOrigin: '48px 48px',
                  }}
                />
              </svg>
              <span className="absolute text-xl font-bold">{stats.overall.accuracy}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Mock Tests</h3>
          <div className="space-y-2">
            <p>Average Score: {stats.overall.averageMockScore}%</p>
            <p>Recent Tests: {stats.mockTestStats.length}</p>
            <Link 
              href="/practice/mock-test" 
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Take Mock Test
            </Link>
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Subject Progress</h3>
        <div className="space-y-4">
          {stats.subjectProgress.map((subject: any) => (
            <div key={subject.subject} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{subject.subject}</span>
                <span className="text-sm text-gray-600">
                  {subject.attempted} / {subject.totalQuestions} ({subject.accuracy}% accuracy)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recent Questions</h3>
          <div className="space-y-4">
            {stats.recentAttempts.map((attempt: any) => (
              <div key={attempt.id} className="border-l-4 pl-4 py-2 space-y-1" 
                style={{ borderColor: attempt.isCorrect ? '#10B981' : '#EF4444' }}>
                <p className="text-sm font-medium truncate">{attempt.questionText}</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{attempt.subject}</span>
                  <span>{new Date(attempt.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recent Mock Tests</h3>
          <div className="space-y-4">
            {stats.mockTestStats.map((test: any, index: number) => (
              <div key={index} className="border-l-4 border-blue-600 pl-4 py-2 space-y-1">
                <p className="font-medium">{test.title}</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{test.score} / {test.totalMarks} ({test.percentage}%)</span>
                  <span>{new Date(test.date).toLocaleDateString()}</span>
                </div>
                {test.duration && (
                  <p className="text-sm text-gray-600">Duration: {test.duration} minutes</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link 
          href="/practice"
          className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
        >
          Practice Questions
        </Link>
        <Link 
          href="/practice/mock-test"
          className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors"
        >
          Take Mock Test
        </Link>
        <Link 
          href="/practice/by-subject"
          className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors"
        >
          Subject Practice
        </Link>
        <Link 
          href="/practice/review-mistakes"
          className="bg-red-600 text-white p-4 rounded-lg text-center hover:bg-red-700 transition-colors"
        >
          Review Mistakes
        </Link>
      </div>
    </div>
  );
} 