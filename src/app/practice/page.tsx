'use client';

import Link from 'next/link';

export default function PracticePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Practice Questions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Practice by Subject */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Practice by Subject</h2>
          <p className="text-gray-600 mb-4">
            Choose specific computer science subjects to focus your practice.
          </p>
          <Link 
            href="/practice/by-subject"
            className="inline-block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Start Subject Practice
          </Link>
        </div>

        {/* Practice by Year */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Practice by Year</h2>
          <p className="text-gray-600 mb-4">
            Practice questions from specific UGC NET exam years.
          </p>
          <Link 
            href="/practice/by-year"
            className="inline-block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Start Year-wise Practice
          </Link>
        </div>

        {/* Practice by Topic */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Practice by Topic</h2>
          <p className="text-gray-600 mb-4">
            Focus on specific topics within computer science subjects.
          </p>
          <Link 
            href="/practice/by-topic"
            className="inline-block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Start Topic Practice
          </Link>
        </div>

        {/* Random Practice */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Random Practice</h2>
          <p className="text-gray-600 mb-4">
            Practice questions randomly selected from all subjects and years.
          </p>
          <Link 
            href="/practice/random"
            className="inline-block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Start Random Practice
          </Link>
        </div>

        {/* Practice by Difficulty */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Practice by Difficulty</h2>
          <p className="text-gray-600 mb-4">
            Choose questions based on their difficulty level.
          </p>
          <Link 
            href="/practice/by-difficulty"
            className="inline-block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Start Difficulty-based Practice
          </Link>
        </div>

        {/* Previous Attempts */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Previous Attempts</h2>
          <p className="text-gray-600 mb-4">
            Review your previous practice sessions and track progress.
          </p>
          <Link 
            href="/practice/history"
            className="inline-block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            View Practice History
          </Link>
        </div>
      </div>
    </div>
  );
} 