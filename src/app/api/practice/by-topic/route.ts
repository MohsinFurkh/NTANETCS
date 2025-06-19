import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const topics = await prisma.$queryRaw<Array<{
      topic: string;
      total_questions: number;
      attempted_questions: number;
      accuracy: number;
    }>>`
      WITH TopicStats AS (
        SELECT 
          topic,
          COUNT(*) as total_questions,
          (
            SELECT COUNT(DISTINCT qa."questionId")
            FROM "QuestionAttempt" qa
            JOIN "Question" q2 ON qa."questionId" = q2.id
            WHERE q2.topic = q.topic
          ) as attempted_questions,
          ROUND(
            CAST(
              (
                SELECT COUNT(DISTINCT qa."questionId")
                FROM "QuestionAttempt" qa
                JOIN "Question" q2 ON qa."questionId" = q2.id
                WHERE q2.topic = q.topic AND qa.isCorrect = true
              ) * 100.0 / 
              NULLIF(
                (
                  SELECT COUNT(DISTINCT qa."questionId")
                  FROM "QuestionAttempt" qa
                  JOIN "Question" q2 ON qa."questionId" = q2.id
                  WHERE q2.topic = q.topic
                ), 0
              ) AS FLOAT
            ), 2
          ) as accuracy
        FROM "Question" q
        GROUP BY topic
        ORDER BY topic ASC
      )
      SELECT 
        topic,
        total_questions,
        COALESCE(attempted_questions, 0) as attempted_questions,
        COALESCE(accuracy, 0) as accuracy
      FROM TopicStats;
    `;
    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error fetching topic stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 