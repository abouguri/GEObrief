'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AlertCircle, Loader } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading, signUp, signInWithGoogle, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
      if (!email || !password || !confirmPassword) {
        setError('All fields are required');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }

      await signUp(email, password);
      router.push('/app/dashboard');
    } catch (err) {
      setError(authError || (err instanceof Error ? err.message : 'Sign up failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(authError || (err instanceof Error ? err.message : 'Google sign up failed'));
    } finally {
      setGoogleLoading(false);
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

      {/* Signup Form */}
      <div className="brand-pattern brand-extract flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create account</h1>
            <p className="text-ui-muted">Start generating GEO briefs free (3/month)</p>
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
                disabled={loading || googleLoading}
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
                disabled={loading || googleLoading}
              />
              <p className="text-xs text-ui-faint mt-1">Min. 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-ui-surface border border-ui-border focus:border-ui-ring focus:outline-none transition-colors text-ui-ink placeholder-ui-placeholder"
                disabled={loading || googleLoading}
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
              disabled={loading || googleLoading}
              className="w-full px-6 py-3 bg-ui-accent text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-ui-shell" />
            <span className="text-sm text-ui-muted">or</span>
            <div className="flex-1 h-px bg-ui-shell" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading || googleLoading}
            className="w-full px-6 py-3 border border-ui-border text-ui-ink rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-ui-ring hover:bg-ui-surface transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Signing up...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-ui-muted mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-ui-accent hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
