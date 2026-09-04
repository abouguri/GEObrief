'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth, type UserProfile } from '@/lib/auth-context';
import { FREE_BRIEF_LIMIT, GUMROAD_PRO_URL, PLAN_LABELS } from '@/lib/config';
import BrandLogo from '@/components/BrandLogo';

const LINKS = [
  { href: '/app/dashboard', label: 'Dashboard' },
  { href: '/app/history', label: 'History' },
  { href: '/app/settings', label: 'Settings' },
];

/**
 * Persistent quota readout. Lives in the nav on every app screen so users
 * always know where they stand: passive pressure, no modal, no nagging.
 */
function QuotaPill({ profile }: { profile: UserProfile | null }) {
  if (!profile) {
    return (
      <div className="hidden items-center rounded-full border border-ui-border bg-ui-shell px-3 py-1.5 sm:flex">
        <span className="text-xs text-ui-ghost">Loading usage…</span>
      </div>
    );
  }

  if (profile.plan !== 'free') {
    return (
      <div className="flex items-center rounded-full border border-ui-ring bg-ui-soft px-3 py-1.5">
        <span className="text-xs font-semibold text-ui-accent">
          {PLAN_LABELS[profile.plan]} · Unlimited
        </span>
      </div>
    );
  }

  const remaining = Math.max(FREE_BRIEF_LIMIT - profile.usageCount, 0);
  const atLimit = remaining === 0;

  return (
    <div
      className="flex items-center gap-2.5 rounded-full border border-ui-border bg-ui-shell px-3 py-1.5"
      title={`${remaining} of ${FREE_BRIEF_LIMIT} free briefs left this month`}
    >
      <div className="hidden gap-[3px] sm:flex" aria-hidden="true">
        {Array.from({ length: FREE_BRIEF_LIMIT }).map((_, i) => (
          <span
            key={i}
            className={`h-1 w-3.5 rounded-full ${
              i < remaining ? 'bg-ui-accent' : 'bg-ui-border'
            }`}
          />
        ))}
      </div>
      <span className="text-[12.5px] font-semibold text-ui-ink">
        {atLimit ? 'No briefs left' : `${remaining} brief${remaining === 1 ? '' : 's'} left`}
      </span>
      <span className="text-[12.5px] text-ui-ghost" aria-hidden="true">
        ·
      </span>
      <a
        href={GUMROAD_PRO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12.5px] font-semibold text-ui-accent transition-opacity hover:opacity-80"
      >
        Upgrade
      </a>
    </div>
  );
}

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch {
      // signOut surfaces the failure through the auth context's error state
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-ui-border bg-ui-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-6 py-3.5">
        <BrandLogo />

        <div className="order-2 flex items-center gap-0.5 sm:order-none">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={
                pathname === link.href
                  ? 'rounded-lg bg-ui-highlight-soft px-3 py-1.5 text-[13.5px] font-semibold text-ui-ink'
                  : 'rounded-lg px-3 py-1.5 text-[13.5px] text-ui-muted transition-colors hover:bg-ui-shell hover:text-ui-ink'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <QuotaPill profile={profile} />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-[13px] text-ui-muted transition-colors hover:text-ui-ink"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
