'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { status } = useSession();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Prepare for</span>
            <span className="block text-primary">UGC NET Computer Science</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Practice questions, take mock tests, and improve your score with our comprehensive preparation platform.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/practice"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10"
              >
                Start Practice
              </Link>
            </div>
            {status === 'unauthenticated' && (
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/auth/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <h3 className="mt-2 text-xl font-semibold text-gray-900">Practice Questions</h3>
            <p className="mt-2 text-base text-gray-500">
              Access a vast collection of UGC NET CS questions with detailed explanations.
            </p>
          </div>

          <div className="text-center">
            <h3 className="mt-2 text-xl font-semibold text-gray-900">Mock Tests</h3>
            <p className="mt-2 text-base text-gray-500">
              Take full-length mock tests under timed conditions to simulate the actual exam.
            </p>
          </div>

          <div className="text-center">
            <h3 className="mt-2 text-xl font-semibold text-gray-900">Performance Analytics</h3>
            <p className="mt-2 text-base text-gray-500">
              Track your progress and identify areas for improvement with detailed analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 