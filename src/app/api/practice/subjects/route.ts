import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get all subjects with their question counts and user's attempt statistics
    const subjectsWithStats = await prisma.$queryRaw`
      WITH SubjectCounts AS (
        SELECT 
          subject,
          CAST(COUNT(*) AS INTEGER) as totalQuestions
        FROM question
        GROUP BY subject
      ),
      UserAttempts AS (
        SELECT 
          q.subject,
          CAST(COUNT(*) AS INTEGER) as attempted,
          ROUND(CAST(AVG(CASE WHEN qa.iscorrect THEN 100.0 ELSE 0 END) AS FLOAT), 2) as accuracy
        FROM question q
        JOIN questionattempt qa ON q.id = qa.questionid
        WHERE qa.userid = (SELECT id FROM user WHERE email = ${session.user.email})
        GROUP BY q.subject
      )
      SELECT 
        sc.subject,
        sc.totalQuestions,
        COALESCE(CAST(ua.attempted AS INTEGER), 0) as attempted,
        COALESCE(CAST(ua.accuracy AS FLOAT), 0) as accuracy
      FROM SubjectCounts sc
      LEFT JOIN UserAttempts ua ON sc.subject = ua.subject
      ORDER BY sc.subject
    `;

    // Convert BigInt values to numbers before sending response
    const serializedStats = (subjectsWithStats as Array<{
      subject: string;
      totalQuestions: bigint | number;
      attempted: bigint | number;
      accuracy: number | bigint;
    }>).map((stat) => ({
      ...stat,
      totalQuestions: Number(stat.totalQuestions),
      attempted: Number(stat.attempted),
      accuracy: Number(stat.accuracy),
    }));

    return NextResponse.json(serializedStats);
  } catch (error) {
    console.error('Error fetching subject statistics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 