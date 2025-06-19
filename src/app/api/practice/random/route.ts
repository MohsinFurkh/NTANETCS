import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // For demo, just return a random question id (no user context)
    const question = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM question
      ORDER BY RANDOM()
      LIMIT 1
    `;
    return NextResponse.json({ id: question[0]?.id });
  } catch (error) {
    console.error('Error fetching random question:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 