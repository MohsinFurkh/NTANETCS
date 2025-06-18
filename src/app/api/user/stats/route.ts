import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface MockTestStat {
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

interface RecentAttempt {
  id: string;
  isCorrect: boolean;
  createdAt: Date;
  question: {
    text: string;
    subject: string;
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401 }
      );
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
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }), 
        { status: 404 }
      );
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

      // Total questions attempted by user
      prisma.questionAttempt.count({
        where: {
          userId: user.id,
        },
      }),

      // Total correct attempts
      prisma.questionAttempt.count({
        where: {
          userId: user.id,
          isCorrect: true,
        },
      }),

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
            CAST(COUNT(*) AS INTEGER) as attempted,
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

      // Recent attempts (last 5)
      prisma.questionAttempt.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          isCorrect: true,
          createdAt: true,
          question: {
            select: {
              text: true,
              subject: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),

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
          mockTestStats.reduce((acc: number, test: MockTestStat) => acc + (test.score / test.mockTest.totalMarks) * 100, 0) /
          mockTestStats.length
        )
      : 0;

    return NextResponse.json({
      overall: {
        totalQuestions,
        totalAttempted,
        correctAttempts,
        accuracy,
        averageMockScore,
      },
      subjectProgress: subjectProgress.map((subject: SubjectProgress) => ({
        ...subject,
        progress: Math.round((Number(subject.attempted) / Number(subject.totalQuestions)) * 100),
      })),
      recentAttempts: recentAttempts.map((attempt: RecentAttempt) => ({
        id: attempt.id,
        isCorrect: attempt.isCorrect,
        date: attempt.createdAt,
        questionText: attempt.question.text,
        subject: attempt.question.subject,
      })),
      mockTestStats: mockTestStats.map((test: MockTestStat) => ({
        title: test.mockTest.title,
        score: test.score,
        totalMarks: test.mockTest.totalMarks,
        percentage: Math.round((test.score / test.mockTest.totalMarks) * 100),
        date: test.startedAt,
        duration: test.endedAt 
          ? Math.round((test.endedAt.getTime() - test.startedAt.getTime()) / 60000)
          : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
} 