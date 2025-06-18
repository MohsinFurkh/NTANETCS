import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const ADMIN_EMAILS = ['mohsinfurkh@gmail.com', 'sayimamukhtar@gmail.com'];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'question',
      'optionA',
      'optionB',
      'optionC',
      'optionD',
      'correctOption',
      'explanation',
      'subject',
      'topic',
      'year',
      'difficulty',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return new NextResponse(`Missing required field: ${field}`, { status: 400 });
      }
    }

    // Create the question
    const question = await prisma.question.create({
      data: {
        text: data.question,
        optionA: data.optionA,
        optionB: data.optionB,
        optionC: data.optionC,
        optionD: data.optionD,
        correctOption: data.correctOption,
        explanation: data.explanation,
        subject: data.subject,
        topic: data.topic,
        year: data.year,
        difficulty: data.difficulty,
        createdBy: session.user.email,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error adding question:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');
    const year = searchParams.get('year');

    // Build the filter
    const filter: Record<string, unknown> = {};
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (year) filter.year = parseInt(year);

    // Get the questions
    const questions = await prisma.question.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 