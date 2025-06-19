'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { BookOpen, Clock, TrendingUp, Users, Award, FileText, Target, CheckCircle } from 'lucide-react';

export default function Home() {
  const { status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4 mr-2" />
            Qualified JRF 3 Times - Learn from Experience
          </div>
          
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Master the</span>
            <span className="block text-blue-600">NTA NET JRF Exam</span>
          </h1>
          
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            Your complete preparation platform for UGC NET Computer Science &amp; JRF. 
            Access organized question banks, expert-crafted materials, and realistic mock tests 
            designed by someone who&apos;s cracked the exam multiple times.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/practice"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Target className="w-5 h-5 mr-2" />
              Start Practice Now
            </Link>
            {status === 'unauthenticated' && (
              <Link
                href="/auth/register"
                className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Free Today
              </Link>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">2x</div>
            <div className="text-sm text-gray-600">Yearly Exams</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1000+</div>
            <div className="text-sm text-gray-600">Practice Questions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">15+</div>
            <div className="text-sm text-gray-600">Years Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">3x</div>
            <div className="text-sm text-gray-600">JRF Qualified</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive resources designed to tackle every challenge you face
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Organized Question Bank</h3>
              <p className="text-gray-600 mb-4">
                Previous year questions systematically sorted by year, subject, and topic. No more hunting through scattered PDFs.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Year-wise categorization</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Subject-wise filtering</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Topic-wise organization</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Realistic Mock Tests</h3>
              <p className="text-gray-600 mb-4">
                Full-length mock tests that simulate actual exam conditions. Practice with the same time pressure you&apos;ll face.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Exact exam format</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Timed practice sessions</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Instant results</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Study Material</h3>
              <p className="text-gray-600 mb-4">
                Curated study materials specifically designed for NET JRF preparation, based on multiple qualification experience.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Concept explanations</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Important formulas</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Quick revision notes</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Analytics</h3>
              <p className="text-gray-600 mb-4">
                Detailed insights into your preparation progress. Identify weak areas and track improvement over time.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Score tracking</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Weakness identification</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Progress monitoring</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Exam Strategy</h3>
              <p className="text-gray-600 mb-4">
                Learn proven strategies and time management techniques from someone who has succeeded multiple times.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Time management tips</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Question prioritization</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Exam day preparation</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Support</h3>
              <p className="text-gray-600 mb-4">
                Join a community of serious aspirants. Share doubts, discuss solutions, and motivate each other.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Discussion forums</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Doubt resolution</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Peer motivation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Problem-Solution Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              We Understand Your Challenges
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Having faced these problems myself, I&apos;ve built solutions that actually work
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-red-600 mb-2">❌ The Problem</h3>
                <p className="text-gray-700">
                  Scattered question papers across different websites, no proper organization by topics or difficulty levels.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-red-600 mb-2">❌ The Problem</h3>
                <p className="text-gray-700">
                  Generic study materials that don&apos;t address NET JRF specific requirements and exam patterns.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-red-600 mb-2">❌ The Problem</h3>
                <p className="text-gray-700">
                  Mock tests that don&apos;t simulate real exam conditions or provide meaningful feedback.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-700 mb-2">✅ Our Solution</h3>
                <p className="text-gray-700">
                  Systematically organized question bank with year-wise, subject-wise, and topic-wise filtering for focused practice.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-700 mb-2">✅ Our Solution</h3>
                <p className="text-gray-700">
                  Curated materials specifically designed for NET JRF, created by someone who has qualified multiple times.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-700 mb-2">✅ Our Solution</h3>
                <p className="text-gray-700">
                  Realistic mock tests with exact exam patterns, timing, and detailed performance analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Crack NET JRF?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of candidates who are preparing smarter, not harder. 
            Your success story starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/practice"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Free Practice
            </Link>
            <Link
              href="/mock-tests"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Clock className="w-5 h-5 mr-2" />
              Take Mock Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}