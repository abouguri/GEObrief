'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  'Searching the live web for current answers',
  'Reading how ChatGPT and Perplexity answer today',
  'Extracting the sources they cite',
  'Scoring the citation gap',
  'Assembling your brief',
];

/** Mirrors the sections formatBriefAsMarkdown emits, in the same order. */
const SECTIONS: Array<{ label: string; bars: Array<{ h: string; w: string }> }> = [
  {
    label: 'Quick Analysis',
    bars: [
      { h: 'h-2.5', w: 'w-full' },
      { h: 'h-2.5', w: 'w-[92%]' },
      { h: 'h-2.5', w: 'w-[64%]' },
    ],
  },
  {
    label: 'Primary Answer (AI Snapshot)',
    bars: [
      { h: 'h-3.5', w: 'w-[84%]' },
      { h: 'h-3.5', w: 'w-[70%]' },
    ],
  },
  {
    label: 'Recommended Structure',
    bars: [
      { h: 'h-2.5', w: 'w-[58%]' },
      { h: 'h-2.5', w: 'w-[66%]' },
      { h: 'h-2.5', w: 'w-[52%]' },
      { h: 'h-2.5', w: 'w-[61%]' },
    ],
  },
  {
    label: 'Key Questions to Answer',
    bars: [
      { h: 'h-2.5', w: 'w-[72%]' },
      { h: 'h-2.5', w: 'w-[64%]' },
      { h: 'h-2.5', w: 'w-[55%]' },
    ],
  },
  {
    label: 'Sources Currently Ranking',
    bars: [
      { h: 'h-2.5', w: 'w-[80%]' },
      { h: 'h-2.5', w: 'w-[74%]' },
    ],
  },
];

/**
 * Wait state for a 20–45s generation. Two jobs: prove work is happening
 * (named search steps that advance) and show the shape of what is coming
 * (labelled placeholders in the real brief order).
 *
 * The steps advance on a timer and deliberately stop at the last one — the
 * real result replaces this component, so it must never claim to be finished.
 */
export default function BriefSkeleton({ keyword }: { keyword: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, STEPS.length - 1)),
      6000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="overflow-hidden rounded-2xl border border-ui-border bg-ui-surface shadow-[0_1px_2px_rgba(42,41,40,0.04),0_18px_44px_-26px_rgba(42,41,40,0.16)]"
    >
      <div className="border-b border-ui-border bg-ui-wash px-6 py-6">
        <div className="mb-1.5 flex items-center gap-2.5">
          <span className="h-[7px] w-[7px] animate-pulse-dot rounded-full bg-ui-accent" />
          <h2 className="font-serif text-[21px] font-semibold tracking-tight text-ui-ink">
            Your brief is being written…
          </h2>
        </div>
        <p className="text-[13.5px] text-ui-muted">
          Reading the live web for &ldquo;{keyword}&rdquo; — how ChatGPT, Perplexity and AI
          Overviews answer it right now. Usually 20–45 seconds — two searches, then the write-up.
        </p>

        <ol className="mt-[18px] space-y-2.5">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;

            return (
              <li
                key={label}
                className={`flex items-center gap-2.5 text-[13px] ${
                  done ? 'text-ui-faint' : active ? 'text-ui-ink' : 'text-ui-ghost'
                }`}
              >
                <span
                  className={`flex h-4 w-4 flex-none items-center justify-center rounded-full border ${
                    done
                      ? 'border-ui-accent bg-ui-accent'
                      : active
                        ? 'border-ui-ring bg-ui-soft'
                        : 'border-ui-border'
                  }`}
                >
                  {done && (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-2.5 w-2.5"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                {label}
              </li>
            );
          })}
        </ol>

        <div className="mt-[18px] h-[3px] overflow-hidden rounded-full bg-ui-track">
          <div
            className="h-full rounded-full bg-ui-accent transition-[width] duration-700 ease-out"
            style={{ width: `${18 + step * 18}%` }}
          />
        </div>
      </div>

      <div className="space-y-[22px] p-6">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-2.5 text-[12.5px] font-semibold text-ui-faint">
              {section.label}
            </p>
            <div className="space-y-2">
              {section.bars.map((bar, i) => (
                <div
                  key={i}
                  className={`${bar.h} ${bar.w} animate-shimmer rounded-md bg-gradient-to-r from-ui-skeleton via-ui-shimmer to-ui-skeleton bg-[length:420px_100%]`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
