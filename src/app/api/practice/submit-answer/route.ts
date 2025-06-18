import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const { questionId, answer } = data;

    if (!questionId || !answer) {
      return new NextResponse('Question ID and answer are required', { status: 400 });
    }

    // Get the question to check the correct answer
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        correctOption: true,
      },
    });

    if (!question) {
      return new NextResponse('Question not found', { status: 404 });
    }

    // Get user ID
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Record the attempt
    const isCorrect = answer === question.correctOption;
    const attempt = await prisma.questionAttempt.create({
      data: {
        userId: user.id,
        questionId: questionId,
        answer: answer,
        isCorrect: isCorrect,
      },
    });

    return NextResponse.json({
      isCorrect,
      attemptId: attempt.id,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 