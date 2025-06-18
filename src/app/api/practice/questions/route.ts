import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');

    if (!subject) {
      return new NextResponse('Subject is required', { status: 400 });
    }

    // Get questions for the subject that haven't been attempted by the user
    const questions = await prisma.question.findMany({
      where: {
        subject: subject,
        attempts: {
          none: {
            user: {
              email: session.user.email,
            },
          },
        },
      },
      select: {
        id: true,
        text: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        explanation: true,
        difficulty: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 10, // Limit to 10 questions per session
    });

    // If no unattempted questions, get random questions from the subject
    if (questions.length === 0) {
      const allQuestions = await prisma.question.findMany({
        where: {
          subject: subject,
        },
        select: {
          id: true,
          text: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          explanation: true,
          difficulty: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 10,
      });

      return NextResponse.json(allQuestions);
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 