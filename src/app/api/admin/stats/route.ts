import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDashboardStats } from '@/lib/admin';

const ADMIN_EMAILS = ['mohsinfurkh@gmail.com', 'sayimamukhtar@gmail.com'];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 