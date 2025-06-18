import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import PracticeLayout from '@/components/PracticeLayout';
import Link from 'next/link';

async function getTopicStats() {
  const topics = await prisma.$queryRaw`
    WITH TopicStats AS (
      SELECT 
        topic,
        COUNT(*) as total_questions,
        (
          SELECT COUNT(DISTINCT qa.questionId)
          FROM QuestionAttempt qa
          JOIN Question q2 ON qa.questionId = q2.id
          WHERE q2.topic = q.topic
        ) as attempted_questions,
        ROUND(
          CAST(
            (
              SELECT COUNT(DISTINCT qa.questionId)
              FROM QuestionAttempt qa
              JOIN Question q2 ON qa.questionId = q2.id
              WHERE q2.topic = q.topic AND qa.isCorrect = true
            ) * 100.0 / 
            NULLIF(
              (
                SELECT COUNT(DISTINCT qa.questionId)
                FROM QuestionAttempt qa
                JOIN Question q2 ON qa.questionId = q2.id
                WHERE q2.topic = q.topic
              ), 0
            ) AS FLOAT
          ), 2
        ) as accuracy
      FROM Question q
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

  return topics;
}

export default async function TopicwisePracticePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const topicStats = await getTopicStats();

  return (
    <PracticeLayout>
      <h1 className="text-2xl font-bold mb-6">Practice by Topic</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topicStats.map((topic: any) => (
          <Link
            key={topic.topic}
            href={`/practice/by-topic/${encodeURIComponent(topic.topic)}`}
            className="block p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold truncate" title={topic.topic}>
                {topic.topic}
              </h2>
              <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                {Number(topic.attempted_questions)} / {Number(topic.total_questions)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.round((Number(topic.attempted_questions) / Number(topic.total_questions)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>
                  {Math.round((Number(topic.attempted_questions) / Number(topic.total_questions)) * 100)}%
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Accuracy</span>
                <span>{Math.round(Number(topic.accuracy))}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PracticeLayout>
  );
} 