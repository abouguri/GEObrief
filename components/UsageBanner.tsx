'use client';

import { FREE_BRIEF_LIMIT, GUMROAD_PRO_URL, PLAN_LABELS } from '@/lib/config';
import type { UserProfile } from '@/lib/auth-context';

/** Usage meter + upgrade CTA. Shared by the dashboard and settings pages. */
export default function UsageBanner({ profile }: { profile: UserProfile | null }) {
  if (!profile) {
    return (
      <div className="p-4 rounded-lg bg-ui-surface border border-ui-border">
        <p className="text-sm text-ui-faint">Loading usage…</p>
      </div>
    );
  }

  const isPaid = profile.plan !== 'free';
  const used = Math.min(profile.usageCount, FREE_BRIEF_LIMIT);
  const remaining = Math.max(FREE_BRIEF_LIMIT - profile.usageCount, 0);
  const atLimit = !isPaid && remaining === 0;

  return (
    <div className="p-4 rounded-lg bg-ui-surface border border-ui-border">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ui-muted">
          {isPaid ? (
            <span className="text-ui-accent font-semibold">
              {PLAN_LABELS[profile.plan]} plan • Unlimited briefs
            </span>
          ) : (
            <>
              <span className="font-semibold text-ui-ink">
                {used} of {FREE_BRIEF_LIMIT}
              </span>{' '}
              free briefs used this month
              {!atLimit && ` • ${remaining} left`}
            </>
          )}
        </p>
        {atLimit && (
          <a
            href={GUMROAD_PRO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-4 py-2 bg-ui-accent text-white rounded font-semibold hover:opacity-90 transition-opacity"
          >
            Upgrade to Pro
          </a>
        )}
      </div>
      {!isPaid && (
        <div className="mt-3 h-1 bg-ui-shell rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-ui-accent to-ui-ring transition-all"
            style={{ width: `${(used / FREE_BRIEF_LIMIT) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
