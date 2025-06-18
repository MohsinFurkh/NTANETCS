'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Something went wrong!</h2>
      <p className="text-gray-600 text-center max-w-md">
        {error.message || 'There was an error loading your dashboard. Please try again.'}
      </p>
      <div className="space-x-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
} 