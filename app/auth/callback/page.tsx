'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/**
 * Landing point for Google OAuth and email-confirmation redirects.
 *
 * Supabase's browser client exchanges the `?code=` param automatically when
 * it initialises, but that race is not guaranteed to be finished by the time
 * this page mounts — so we exchange explicitly if no session exists yet.
 */
export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        const client = supabase();
        const params = new URLSearchParams(window.location.search);

        // Supabase reports OAuth failures as query params, not exceptions
        const providerError = params.get('error_description') || params.get('error');
        if (providerError) {
          setError(providerError);
          return;
        }

        const { data: existing } = await client.auth.getSession();

        if (!existing.session) {
          const code = params.get('code');

          if (!code) {
            setError('No sign-in code was returned. Please try signing in again.');
            return;
          }

          const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setError(exchangeError.message);
            return;
          }
        }

        router.replace('/app/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign in could not be completed.');
      }
    };

    completeSignIn();
  }, [router]);

  return (
    <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center px-6">
      {error ? (
        <div className="max-w-md w-full p-6 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h1 className="font-semibold mb-1">Sign in failed</h1>
              <p className="text-sm text-white/60">{error}</p>
            </div>
          </div>
          <Link
            href="/auth/login"
            className="block w-full px-4 py-2 bg-brand-accent text-brand-dark rounded font-semibold text-center hover:opacity-90 transition-opacity"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-brand-accent mx-auto mb-4" />
          <p className="text-white/60">Completing sign in…</p>
        </div>
      )}
    </div>
  );
}
