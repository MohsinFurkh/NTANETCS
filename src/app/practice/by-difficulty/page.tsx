import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import PracticeLayout from '@/components/PracticeLayout';
import Link from 'next/link';

async function getDifficultyStats() {
  const difficulties = await prisma.$queryRaw`
    WITH DifficultyStats AS (
      SELECT 
        difficulty,
        COUNT(*) as total_questions,
        (
          SELECT COUNT(DISTINCT qa.questionId)
          FROM QuestionAttempt qa
          JOIN Question q2 ON qa.questionId = q2.id
          WHERE q2.difficulty = q.difficulty
        ) as attempted_questions,
        ROUND(
          CAST(
            (
              SELECT COUNT(DISTINCT qa.questionId)
              FROM QuestionAttempt qa
              JOIN Question q2 ON qa.questionId = q2.id
              WHERE q2.difficulty = q.difficulty AND qa.isCorrect = true
            ) * 100.0 / 
            NULLIF(
              (
                SELECT COUNT(DISTINCT qa.questionId)
                FROM QuestionAttempt qa
                JOIN Question q2 ON qa.questionId = q2.id
                WHERE q2.difficulty = q.difficulty
              ), 0
            ) AS FLOAT
          ), 2
        ) as accuracy
      FROM Question q
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

  return difficulties;
}

const difficultyColors = {
  Easy: 'bg-green-600',
  Medium: 'bg-yellow-500',
  Hard: 'bg-red-600',
};

export default async function DifficultyPracticePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const difficultyStats = await getDifficultyStats();

  return (
    <PracticeLayout>
      <h1 className="text-2xl font-bold mb-6">Practice by Difficulty</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {difficultyStats.map((difficulty: any) => (
          <Link
            key={difficulty.difficulty}
            href={`/practice/by-difficulty/${difficulty.difficulty.toLowerCase()}`}
            className="block p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${difficultyColors[difficulty.difficulty as keyof typeof difficultyColors] || 'bg-gray-600'}`} />
                <h2 className="text-xl font-semibold">{difficulty.difficulty}</h2>
              </div>
              <span className="text-sm text-gray-500">
                {Number(difficulty.attempted_questions)} / {Number(difficulty.total_questions)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${difficultyColors[difficulty.difficulty as keyof typeof difficultyColors] || 'bg-gray-600'}`}
                  style={{
                    width: `${Math.round((Number(difficulty.attempted_questions) / Number(difficulty.total_questions)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>
                  {Math.round((Number(difficulty.attempted_questions) / Number(difficulty.total_questions)) * 100)}%
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Accuracy</span>
                <span>{Math.round(Number(difficulty.accuracy))}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PracticeLayout>
  );
} 