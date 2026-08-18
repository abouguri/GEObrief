import type { LucideIcon } from 'lucide-react';

/**
 * The one empty-state pattern used across the app: icon, one sentence,
 * one primary action, optional extras underneath.
 *
 * Clay elevation scale, shared with BriefSkeleton and the dashboard:
 *   L0 page      bg-clay-paper
 *   L1 recessed  bg-clay-shell   + border-clay-border   inputs, chips
 *   L2 secondary bg-clay-surface + border-clay-border   form panel, toolbars
 *   L3 primary   bg-clay-surface + border-clay-border + shadow   brief output
 */
export default function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  children,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-clay-border bg-clay-surface px-6 py-14 text-center shadow-[0_1px_2px_rgba(26,22,19,0.04),0_18px_44px_-26px_rgba(26,22,19,0.2)] sm:px-10">
      <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-clay-soft">
        <Icon className="h-6 w-6 text-clay-accent" strokeWidth={1.8} />
      </div>
      <h2 className="mb-2.5 font-serif text-[26px] font-semibold leading-tight tracking-tight text-clay-ink sm:text-[28px]">
        {title}
      </h2>
      <p className="mx-auto mb-7 max-w-md text-[14.5px] leading-relaxed text-clay-muted [text-wrap:pretty]">
        {body}
      </p>
      {action}
      {children}
    </div>
  );
}
