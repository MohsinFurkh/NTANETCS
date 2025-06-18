import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import PracticeLayout from '@/components/PracticeLayout';
import Link from 'next/link';

interface YearStats {
  year: number | string | bigint;
  total_questions: number | bigint;
  attempted_questions: number | bigint;
  accuracy: number | bigint;
}

async function getYearStats() {
  const years = await prisma.$queryRaw`
    WITH YearStats AS (
      SELECT 
        year,
        COUNT(*) as total_questions,
        (
          SELECT COUNT(DISTINCT qa.questionId)
          FROM QuestionAttempt qa
          JOIN Question q2 ON qa.questionId = q2.id
          WHERE q2.year = q.year
        ) as attempted_questions,
        ROUND(
          CAST(
            (
              SELECT COUNT(DISTINCT qa.questionId)
              FROM QuestionAttempt qa
              JOIN Question q2 ON qa.questionId = q2.id
              WHERE q2.year = q.year AND qa.isCorrect = true
            ) * 100.0 / 
            NULLIF(
              (
                SELECT COUNT(DISTINCT qa.questionId)
                FROM QuestionAttempt qa
                JOIN Question q2 ON qa.questionId = q2.id
                WHERE q2.year = q.year
              ), 0
            ) AS FLOAT
          ), 2
        ) as accuracy
      FROM Question q
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

  return years;
}

export default async function YearwisePracticePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const yearStats = await getYearStats();

  return (
    <PracticeLayout>
      <h1 className="text-2xl font-bold mb-6">Practice by Year</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yearStats.map((year: YearStats) => (
          <Link
            key={year.year}
            href={`/practice/by-year/${year.year}`}
            className="block p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Year {Number(year.year)}</h2>
              <span className="text-sm text-gray-500">
                {Number(year.attempted_questions)} / {Number(year.total_questions)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.round((Number(year.attempted_questions) / Number(year.total_questions)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>
                  {Math.round((Number(year.attempted_questions) / Number(year.total_questions)) * 100)}%
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Accuracy</span>
                <span>{Math.round(Number(year.accuracy))}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PracticeLayout>
  );
} 