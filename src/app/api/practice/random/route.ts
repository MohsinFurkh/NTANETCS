import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // For demo, just return a random question id (no user context)
    const question = await prisma.$queryRaw<Array<{
      id: string;
      text: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      explanation: string;
      difficulty: string;
    }>>`
      SELECT id, text, "optionA", "optionB", "optionC", "optionD", explanation, difficulty
      FROM "Question"
      ORDER BY RANDOM()
      LIMIT 1
    `;
    return NextResponse.json(question[0] || null);
  } catch (error) {
    console.error('Error fetching random question:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 