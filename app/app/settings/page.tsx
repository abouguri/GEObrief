'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, LogOut } from 'lucide-react';
import AppNav from '@/components/AppNav';
import AuthGuard from '@/components/AuthGuard';
import UsageBanner from '@/components/UsageBanner';
import { useAuth } from '@/lib/auth-context';
import {
  FREE_BRIEF_LIMIT,
  GUMROAD_BILLING_URL,
  GUMROAD_LIFETIME_URL,
  GUMROAD_PRO_URL,
  PLAN_LABELS,
} from '@/lib/config';

/**
 * Format a Postgres DATE ('YYYY-MM-DD') for display.
 * Parsed field-by-field because `new Date('2026-09-01')` is treated as UTC
 * midnight, which renders as the previous day west of Greenwich.
 */
function formatResetDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return value;

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-clay-border last:border-0">
      <span className="text-sm text-clay-muted">{label}</span>
      <span className="text-sm font-medium text-right">{children}</span>
    </div>
  );
}

function SettingsContent() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const isPaid = profile ? profile.plan !== 'free' : false;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.replace('/');
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-clay-paper text-clay-ink">
      <AppNav />

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-clay-muted">Your account, plan, and billing.</p>
        </div>

        {/* Account */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-clay-faint mb-3">
            Account
          </h2>
          <div className="p-5 rounded-lg bg-clay-surface border border-clay-border">
            <Row label="Email">{user?.email ?? '—'}</Row>
            <Row label="Signed in with">
              {user?.app_metadata?.provider === 'google' ? 'Google' : 'Email & password'}
            </Row>
            <Row label="Member since">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '—'}
            </Row>
          </div>
        </section>

        {/* Plan & usage */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-clay-faint mb-3">
            Plan &amp; Usage
          </h2>
          <div className="space-y-4">
            <UsageBanner profile={profile} />

            <div className="p-5 rounded-lg bg-clay-surface border border-clay-border">
              <Row label="Current plan">
                <span className={isPaid ? 'text-clay-accent' : undefined}>
                  {profile ? PLAN_LABELS[profile.plan] : '—'}
                </span>
              </Row>
              <Row label="Briefs this month">
                {profile
                  ? isPaid
                    ? `${profile.usageCount} (unlimited)`
                    : `${profile.usageCount} of ${FREE_BRIEF_LIMIT}`
                  : '—'}
              </Row>
              {!isPaid && (
                <Row label="Free briefs reset">
                  {profile ? formatResetDate(profile.usageResetDate) : '—'}
                </Row>
              )}
            </div>

            {isPaid ? (
              <a
                href={GUMROAD_BILLING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-clay-shell hover:border-clay-ring transition-colors font-semibold text-sm"
              >
                Manage billing on Gumroad
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="p-5 rounded-lg bg-clay-soft border border-clay-ring">
                <h3 className="font-semibold mb-1">Go unlimited</h3>
                <p className="text-sm text-clay-muted mb-4">
                  Unlimited briefs, no monthly cap. Cancel any time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={GUMROAD_PRO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-clay-accent text-white rounded font-semibold text-center hover:opacity-90 transition-opacity text-sm"
                  >
                    Pro — $15/mo
                  </a>
                  <a
                    href={GUMROAD_LIFETIME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-clay-shell hover:border-clay-ring rounded font-semibold text-center transition-colors text-sm"
                  >
                    Lifetime — $59
                  </a>
                </div>
                <p className="text-xs text-clay-faint mt-3">
                  Use the same email as this account so your plan upgrades automatically.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Session */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-clay-faint mb-3">
            Session
          </h2>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-clay-surface border border-clay-border hover:border-red-500/40 hover:text-red-700 transition-colors font-semibold text-sm disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </section>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
