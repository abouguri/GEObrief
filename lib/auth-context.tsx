'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface UserProfile {
  plan: 'free' | 'pro' | 'annual';
  usageCount: number;
  usageResetDate: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load plan + usage from the users table. RLS restricts this to the caller's
   * own row, so the anon key is enough. The row itself is created by the
   * on_auth_user_created trigger (see migrations/002).
   */
  const loadProfile = useCallback(async (userId: string) => {
    try {
      const client = supabase();
      const { data, error: profileError } = await client
        .from('users')
        .select('plan, usage_count, usage_reset_date')
        .eq('id', userId)
        .single();

      if (profileError || !data) {
        console.error('Profile load error:', profileError);
        setProfile(null);
        return;
      }

      const row = data as {
        plan: 'free' | 'pro' | 'annual';
        usage_count: number;
        usage_reset_date: string;
      };

      setProfile({
        plan: row.plan,
        usageCount: row.usage_count,
        usageResetDate: row.usage_reset_date,
      });
    } catch (err) {
      console.error('Profile load error:', err);
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id);
    }
  }, [user, loadProfile]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const client = supabase();

        // Get current session
        const { data: { session }, error: sessionError } = await client.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
        } else {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            await loadProfile(session.user.id);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Auth initialization failed';
        console.error('Auth initialization error:', message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    try {
      const client = supabase();
      const { data: { subscription } } = client.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setError(null);

          if (session?.user) {
            loadProfile(session.user.id);
          } else {
            setProfile(null);
          }
        }
      );

      return () => {
        subscription?.unsubscribe();
      };
    } catch (err) {
      console.error('Failed to set up auth listener:', err);
    }
  }, [loadProfile]);

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const client = supabase();

      // Sign up with email/password. The matching public.users row is created
      // by a database trigger. The browser cannot insert it itself, since RLS
      // (correctly) refuses writes to that table from the anon key.
      const { data: { user: newUser }, error: signUpError } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;
      if (!newUser) throw new Error('Sign up failed');

      setUser(newUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const client = supabase();

      const { data: { user: signedInUser }, error: signInError } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!signedInUser) throw new Error('Sign in failed');

      setUser(signedInUser);
      await loadProfile(signedInUser.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const client = supabase();

      const { error: signOutError } = await client.auth.signOut();
      if (signOutError) throw signOutError;

      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const client = supabase();

      const { error: googleError } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (googleError) throw googleError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign in failed';
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        refreshProfile,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
