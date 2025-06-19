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
            SELECT COUNT(DISTINCT qa.questionid)
            FROM questionattempt qa
            JOIN question q2 ON qa.questionid = q2.id
            WHERE q2.year = q.year
          ) as attempted_questions,
          ROUND(
            CAST(
              (
                SELECT COUNT(DISTINCT qa.questionid)
                FROM questionattempt qa
                JOIN question q2 ON qa.questionid = q2.id
                WHERE q2.year = q.year AND qa.iscorrect = true
              ) * 100.0 / 
              NULLIF(
                (
                  SELECT COUNT(DISTINCT qa.questionid)
                  FROM questionattempt qa
                  JOIN question q2 ON qa.questionid = q2.id
                  WHERE q2.year = q.year
                ), 0
              ) AS FLOAT
            ), 2
          ) as accuracy
        FROM question q
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