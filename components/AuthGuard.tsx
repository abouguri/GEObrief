'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

/**
 * Client-side gate for the /app pages. Redirects signed-out visitors to
 * login. The real protection is server-side — every API route verifies the
 * access token and RLS scopes each query to its owner — this only keeps
 * signed-out users from staring at an empty dashboard.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-ui-paper text-ui-ink flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-ui-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
