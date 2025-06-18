import prisma from './prisma';

interface UserStats {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  _count: {
    attempts: number;
    mockTests: number;
  };
  attempts: {
    isCorrect: boolean;
  }[];
  mockTests: {
    score: number;
  }[];
}

export async function getDashboardStats() {
  const [
    totalUsers,
    totalQuestions,
    totalMockTests,
    questionsBySubject,
    questionsByYear,
    userStats
  ] = await Promise.all([
    // Get total users
    prisma.user.count(),
    
    // Get total questions
    prisma.question.count(),
    
    // Get total mock tests
    prisma.mockTest.count(),
    
    // Get questions by subject
    prisma.question.groupBy({
      by: ['subject'],
      _count: true,
    }),
    
    // Get questions by year
    prisma.question.groupBy({
      by: ['year'],
      _count: true,
    }),
    
    // Get detailed user statistics
    prisma.user.findMany({
      where: {
        role: 'user', // Only get regular users
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            attempts: true,
            mockTests: true,
          },
        },
        attempts: {
          select: {
            isCorrect: true,
          },
        },
        mockTests: {
          select: {
            score: true,
          },
        },
      },
    }),
  ]);

  // Calculate user statistics
  const userStatistics = (userStats as UserStats[]).map(user => {
    const totalAttempts = user.attempts.length;
    const correctAttempts = user.attempts.filter(attempt => attempt.isCorrect).length;
    const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    const averageScore = user.mockTests.length > 0
      ? user.mockTests.reduce((acc, test) => acc + test.score, 0) / user.mockTests.length
      : 0;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      joinedDate: user.createdAt,
      questionsAttempted: totalAttempts,
      mockTestsTaken: user._count.mockTests,
      accuracy: Math.round(accuracy * 100) / 100,
      averageScore: Math.round(averageScore * 100) / 100,
    };
  });

  return {
    totalUsers,
    totalQuestions,
    totalMockTests,
    questionsBySubject,
    questionsByYear,
    userStatistics,
  };
} 