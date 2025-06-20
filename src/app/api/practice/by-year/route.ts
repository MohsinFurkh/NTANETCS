import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const years = await prisma.$queryRaw<Array<{
      year: number;
      total_questions: number;
      attempted_questions: number;
      accuracy: number;
    }>>`
      WITH YearStats AS (
        SELECT 
          year,
          COUNT(*) as total_questions,
          (
            SELECT COUNT(DISTINCT qa."questionId")
            FROM "QuestionAttempt" qa
            JOIN "Question" q2 ON qa."questionId" = q2.id
            WHERE q2.year = q.year
          ) as attempted_questions,
          ROUND(
            (
              SELECT COUNT(DISTINCT qa."questionId")
              FROM "QuestionAttempt" qa
              JOIN "Question" q2 ON qa."questionId" = q2.id
              WHERE q2.year = q.year AND qa."isCorrect" = true
            ) * 100.0 /
            NULLIF(
              (
                SELECT COUNT(DISTINCT qa."questionId")
                FROM "QuestionAttempt" qa
                JOIN "Question" q2 ON qa."questionId" = q2.id
                WHERE q2.year = q.year
              ), 0
            )::numeric,
            2
          ) as accuracy
        FROM "Question" q
        GROUP BY year
        ORDER BY year DESC
      )
      SELECT 
        year,
        total_questions,
        COALESCE(attempted_questions, 0) as attempted_questions,
        COALESCE(accuracy, 0) as accuracy
      FROM YearStats;
    `;
    return NextResponse.json(years);
  } catch (error) {
    console.error('Error fetching year stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 