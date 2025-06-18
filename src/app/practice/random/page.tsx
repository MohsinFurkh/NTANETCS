import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import PracticeLayout from '@/components/PracticeLayout';

async function getRandomQuestionId(userId: string) {
  // Get a random question that hasn't been attempted yet
  const question = await prisma.$queryRaw<{ id: string }[]>`
    WITH UnattemptedQuestions AS (
      SELECT q.id
      FROM Question q
      LEFT JOIN QuestionAttempt qa ON q.id = qa.questionId AND qa.userId = ${userId}
      WHERE qa.id IS NULL
    )
    SELECT id
    FROM UnattemptedQuestions
    ORDER BY RANDOM()
    LIMIT 1
  `;

  // If no unattempted questions, get any random question
  if (!question || question.length === 0) {
    const anyQuestion = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id
      FROM Question
      ORDER BY RANDOM()
      LIMIT 1
    `;
    return anyQuestion[0]?.id;
  }

  return question[0]?.id;
}

export default async function RandomPracticePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email || '',
    },
    select: {
      id: true,
    },
  });

  if (!user) redirect('/auth/login');

  const randomQuestionId = await getRandomQuestionId(user.id);
  
  // If no questions available, show a message
  if (!randomQuestionId) {
    return (
      <PracticeLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">No Questions Available</h1>
          <p className="text-gray-600">
            Please check back later when questions have been added to the system.
          </p>
        </div>
      </PracticeLayout>
    );
  }

  // Redirect to the question page
  redirect(`/practice/question/${randomQuestionId}`);
} 