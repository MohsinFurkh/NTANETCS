'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const ADMIN_EMAILS = ['mohsinfurkh@gmail.com', 'sayimamukhtar@gmail.com'];

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check for success message
    if (searchParams?.get('registered')) {
      setMessage('Registration successful! Please log in.');
    }
    
    // Check for error message
    const error = searchParams?.get('error');
    if (error) {
      switch (error) {
        case 'CredentialsSignin':
          setError('Invalid email or password');
          break;
        case 'OAuthSignin':
          setError('Error signing in with OAuth provider');
          break;
        case 'OAuthCallback':
          setError('Error during OAuth callback');
          break;
        case 'OAuthCreateAccount':
          setError('Error creating OAuth account');
          break;
        case 'EmailCreateAccount':
          setError('Error creating email account');
          break;
        case 'Callback':
          setError('Error during callback');
          break;
        default:
          setError('An error occurred during sign in');
          break;
      }
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        console.error('Sign in error:', result.error);
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Check if user is admin
      if (ADMIN_EMAILS.includes(formData.email)) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-center">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to continue your preparation
        </p>

        {message && (
          <div className="bg-green-50 text-green-500 p-4 rounded-md mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                className="mr-2"
                checked={formData.remember}
                onChange={handleChange}
              />
              <span className="text-sm">Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary w-full ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* OAuth Options */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled={true}
              className="btn flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 opacity-50 cursor-not-allowed"
              onClick={() => signIn('google')}
            >
              <FaGoogle className="text-red-500" />
              Google
            </button>
            <button
              type="button"
              disabled={true}
              className="btn flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 opacity-50 cursor-not-allowed"
              onClick={() => signIn('github')}
            >
              <FaGithub className="text-gray-900" />
              GitHub
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 