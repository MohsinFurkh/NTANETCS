"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PracticeLayoutProps {
  children: React.ReactNode;
}

export default function PracticeLayout({ children }: PracticeLayoutProps) {
  const pathname = usePathname();

  const practiceLinks = [
    { href: '/practice/by-subject', label: 'By Subject' },
    { href: '/practice/by-year', label: 'By Year' },
    { href: '/practice/by-topic', label: 'By Topic' },
    { href: '/practice/by-difficulty', label: 'By Difficulty' },
    { href: '/practice/random', label: 'Random' },
  ];

  return (
    <div className="space-y-6">
      <nav className="bg-white shadow-sm rounded-lg p-4">
        <ul className="flex flex-wrap gap-4">
          {practiceLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-4 py-2 rounded-md transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="bg-white shadow-sm rounded-lg p-6">
        {children}
      </div>
    </div>
  );
} 