'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Auth initialization failed');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const client = supabase();
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setError(null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const client = supabase();

      // Sign up with email/password
      const { data: { user: newUser }, error: signUpError } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;
      if (!newUser) throw new Error('Sign up failed');

      // Create user record in users table
      const { error: userError } = await (client.from('users') as any)
        .insert({
          id: newUser.id,
          email: newUser.email,
          plan: 'free',
          usage_count: 0,
          usage_reset_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            .toISOString()
            .split('T')[0],
        });

      if (userError) throw userError;

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
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, signInWithGoogle, error }}>
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
