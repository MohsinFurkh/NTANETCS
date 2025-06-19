import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const difficulties = await prisma.$queryRaw<any[]>`
      WITH DifficultyStats AS (
        SELECT 
          difficulty,
          COUNT(*) as total_questions,
          (
            SELECT COUNT(DISTINCT qa.questionid)
            FROM questionattempt qa
            JOIN question q2 ON qa.questionid = q2.id
            WHERE q2.difficulty = q.difficulty
          ) as attempted_questions,
          ROUND(
            CAST(
              (
                SELECT COUNT(DISTINCT qa.questionid)
                FROM questionattempt qa
                JOIN question q2 ON qa.questionid = q2.id
                WHERE q2.difficulty = q.difficulty AND qa.iscorrect = true
              ) * 100.0 / 
              NULLIF(
                (
                  SELECT COUNT(DISTINCT qa.questionid)
                  FROM questionattempt qa
                  JOIN question q2 ON qa.questionid = q2.id
                  WHERE q2.difficulty = q.difficulty
                ), 0
              ) AS FLOAT
            ), 2
          ) as accuracy
        FROM question q
        GROUP BY difficulty
        ORDER BY 
          CASE difficulty
            WHEN 'Easy' THEN 1
            WHEN 'Medium' THEN 2
            WHEN 'Hard' THEN 3
            ELSE 4
          END
      )
      SELECT 
        difficulty,
        total_questions,
        COALESCE(attempted_questions, 0) as attempted_questions,
        COALESCE(accuracy, 0) as accuracy
      FROM DifficultyStats;
    `;
    return NextResponse.json(difficulties);
  } catch (error) {
    console.error('Error fetching difficulty stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 