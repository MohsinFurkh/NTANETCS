"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const ADMIN_EMAILS = ['mohsinfurkh@gmail.com', 'sayimamukhtar@gmail.com'];

interface NavigationItem {
  name: string
  href: string
}

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  const navigation: NavigationItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Practice', href: '/practice' },
    { name: 'Mock Tests', href: '/mock-tests' },
    { name: 'Notes', href: '/notes' },
    { name: 'About', href: '/about' },
  ]

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              UGC NET CS
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-secondary font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Navigation */}
            {status === 'authenticated' ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className={`${
                    pathname === (isAdmin ? '/admin/dashboard' : '/dashboard')
                      ? 'text-secondary font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className={`${
                    pathname === '/auth/login'
                      ? 'text-secondary font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'text-secondary font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  } block px-3 py-2 text-base`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Navigation */}
              {status === 'authenticated' ? (
                <>
                  <Link
                    href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                    className={`${
                      pathname === (isAdmin ? '/admin/dashboard' : '/dashboard')
                        ? 'text-secondary font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    } block px-3 py-2 text-base`}
                    onClick={() => setIsOpen(false)}
                  >
                    {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className={`${
                      pathname === '/auth/login'
                        ? 'text-secondary font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    } block px-3 py-2 text-base`}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-primary font-semibold block px-3 py-2 text-base"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation 