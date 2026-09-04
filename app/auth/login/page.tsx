'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AlertCircle, Loader } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, signIn, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/app/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }

      await signIn(email, password);
      router.push('/app/dashboard');
    } catch (err) {
      setError(authError || (err instanceof Error ? err.message : 'Sign in failed'));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-ui-paper flex items-center justify-center">
        <Loader className="w-8 h-8 text-ui-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ui-paper text-ui-ink flex flex-col">
      {/* Nav */}
      <nav className="border-b border-ui-border bg-ui-shell backdrop-blur-lg">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <BrandLogo />
        </div>
      </nav>

      {/* Login Form */}
      <div className="brand-pattern brand-extract flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-ui-muted">Sign in to your GEObrief account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-ui-surface border border-ui-border focus:border-ui-ring focus:outline-none transition-colors text-ui-ink placeholder-ui-placeholder"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-ui-surface border border-ui-border focus:border-ui-ring focus:outline-none transition-colors text-ui-ink placeholder-ui-placeholder"
                disabled={loading}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-ui-accent text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-ui-shell" />
            <span className="text-sm text-ui-muted">or</span>
            <div className="flex-1 h-px bg-ui-shell" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-ui-muted">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-ui-accent hover:underline font-semibold">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
