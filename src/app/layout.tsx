import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { NextAuthProvider } from '../components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UGC NET CS',
  description: 'UGC NET Computer Science Practice Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  )
} 