'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  FileSearch,
  Loader,
} from 'lucide-react';
import AppNav from '@/components/AppNav';
import AuthGuard from '@/components/AuthGuard';
import BriefMarkdown from '@/components/BriefMarkdown';
import BriefSkeleton from '@/components/BriefSkeleton';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/lib/auth-context';
import { downloadBriefAsPdf } from '@/lib/pdf';
import { FREE_BRIEF_LIMIT, GUMROAD_PRO_URL } from '@/lib/config';

/**
 * Clay elevation scale (shared with EmptyState / BriefSkeleton):
 *   L0 page      bg-clay-paper
 *   L1 recessed  bg-clay-shell   + border-clay-border   inputs, chips
 *   L2 secondary bg-clay-surface + border-clay-border   form panel, toolbars
 *   L3 primary   bg-clay-surface + border + shadow      brief output
 */

const EXAMPLE_KEYWORDS = [
  'best crm for small business',
  'what is generative engine optimization',
  'notion vs asana',
  'how to reduce churn',
];

const FIELD =
  'w-full rounded-[10px] border border-clay-border bg-clay-shell px-3.5 py-2.5 text-sm text-clay-ink placeholder-clay-placeholder transition-colors focus:border-clay-ring focus:outline-none disabled:opacity-60';

const SECONDARY_BUTTON =
  'flex items-center gap-1.5 rounded-[9px] border border-clay-border bg-clay-shell px-3.5 py-2 text-[12.5px] font-semibold text-clay-ink transition-colors hover:border-clay-ring';

function DashboardContent() {
  const { session, profile, refreshProfile } = useAuth();

  const [keyword, setKeyword] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [niche, setNiche] = useState('');
  const [brief, setBrief] = useState<string | null>(null);
  const [briefKeyword, setBriefKeyword] = useState('');
  const [geoScore, setGeoScore] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // The server is the authority on the quota; this only shapes the UI.
  const isPaid = profile ? profile.plan !== 'free' : false;
  const usageCount = profile?.usageCount ?? 0;
  const isAtLimit = !isPaid && usageCount >= FREE_BRIEF_LIMIT;
  const remaining = Math.max(FREE_BRIEF_LIMIT - usageCount, 0);

  const focusKeyword = () => document.getElementById('keyword')?.focus();

  const handleGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      setError('Keyword is required');
      return;
    }

    if (keyword.trim().length < 2) {
      setError('Keyword must be at least 2 characters');
      return;
    }

    if (!session?.access_token) {
      setError('Your session expired. Please sign in again.');
      return;
    }

    setLoading(true);
    setError(null);
    setBrief(null);
    setGeoScore(null);

    try {
      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          websiteUrl: websiteUrl.trim() || undefined,
          niche: niche.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.details || data.error || 'Failed to generate brief. Please try again.');
        // A 429 means the server-side counter moved past what the UI believed
        await refreshProfile();
        return;
      }

      setBrief(data.briefMarkdown);
      setBriefKeyword(data.keyword);
      setGeoScore(data.brief?.geoScore ?? null);
      await refreshProfile();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBrief = async () => {
    if (!brief) return;

    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy brief');
      console.error(err);
    }
  };

  const handleDownloadPdf = async () => {
    if (!brief) return;

    try {
      await downloadBriefAsPdf(brief, briefKeyword || 'brief');
    } catch (err) {
      setError('Failed to build the PDF. Try copying the brief instead.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-clay-paper text-clay-ink">
      <AppNav />

      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(300px,1fr)_1.9fr]">
          {/* Input form — L2 */}
          <form
            onSubmit={handleGenerateBrief}
            className="flex flex-col gap-[18px] rounded-2xl border border-clay-border bg-clay-surface p-5 lg:sticky lg:top-24"
          >
            <div>
              <p className="font-serif text-[19px] font-semibold tracking-tight">New brief</p>
              <p className="mt-1 text-[12.5px] text-clay-muted">One keyword is all we need.</p>
            </div>

            <div>
              <label htmlFor="keyword" className="mb-2 block text-[13px] font-semibold">
                Target keyword <span className="text-clay-accent">*</span>
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. best crm for small business"
                className={FIELD}
                disabled={loading}
              />
              <p className="mt-[7px] text-[11.5px] text-clay-faint">
                The topic you want AI engines to cite you for.
              </p>
            </div>

            <div>
              <label htmlFor="websiteUrl" className="mb-2 block text-[13px] font-semibold">
                Website URL <span className="font-normal text-clay-faint">optional</span>
              </label>
              <input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className={FIELD}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="niche" className="mb-2 block text-[13px] font-semibold">
                Industry / niche <span className="font-normal text-clay-faint">optional</span>
              </label>
              <input
                id="niche"
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. SaaS, e-commerce"
                className={FIELD}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-[10px] border border-red-200 bg-red-50 p-3.5">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isAtLimit}
              className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-clay-accent px-5 py-3 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                'Generate brief'
              )}
            </button>

            {!isPaid && !isAtLimit && (
              <p className="-mt-1 text-center text-[11.5px] text-clay-faint">
                Uses 1 of your {remaining} remaining free brief{remaining === 1 ? '' : 's'} this
                month.
              </p>
            )}

            {isAtLimit && (
              <div className="rounded-[10px] border border-clay-ring bg-clay-soft p-4">
                <p className="mb-3 text-sm text-clay-body">
                  You&apos;ve used all {FREE_BRIEF_LIMIT} free briefs this month. Pro is
                  unlimited.
                </p>
                <a
                  href={GUMROAD_PRO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-clay-accent px-4 py-2 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Upgrade to Pro
                </a>
              </div>
            )}
          </form>

          {/* Brief output — L3 */}
          <div>
            {loading ? (
              <BriefSkeleton keyword={keyword.trim()} />
            ) : brief ? (
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-clay-border bg-clay-surface px-3.5 py-3">
                  <span className="mr-1 text-[13px] font-semibold">{briefKeyword}</span>
                  {geoScore && (
                    <span className="rounded-full bg-clay-soft px-[9px] py-[3px] text-[11px] font-semibold text-clay-accent">
                      GEO score: {geoScore}
                    </span>
                  )}
                  <div className="ml-auto flex gap-2">
                    <button onClick={handleCopyBrief} className={SECONDARY_BUTTON}>
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Markdown
                        </>
                      )}
                    </button>
                    <button onClick={handleDownloadPdf} className={SECONDARY_BUTTON}>
                      <Download className="h-3.5 w-3.5" />
                      Download PDF
                    </button>
                  </div>
                </div>

                <BriefMarkdown markdown={brief} />

                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-clay-border bg-clay-surface p-4">
                  <p className="text-[13px] text-clay-muted">
                    <Link
                      href="/app/history"
                      className="transition-colors hover:text-clay-ink"
                    >
                      Saved to your history
                    </Link>
                    {!isPaid &&
                      ` · ${remaining} brief${remaining === 1 ? '' : 's'} left this month`}
                  </p>
                  <button
                    onClick={() => {
                      setKeyword('');
                      setWebsiteUrl('');
                      setNiche('');
                      setBrief(null);
                      setGeoScore(null);
                      setError(null);
                    }}
                    className={`ml-auto ${SECONDARY_BUTTON}`}
                  >
                    Generate another brief
                  </button>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={FileSearch}
                title="Type a keyword, get a brief built to be cited"
                body="We read how ChatGPT, Perplexity and AI Overviews answer it right now — no site connection, no setup."
                action={
                  <button
                    type="button"
                    onClick={focusKeyword}
                    className="rounded-[10px] bg-clay-accent px-[22px] py-[11px] text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Generate your first brief
                  </button>
                }
              >
                <div className="mt-[34px] border-t border-clay-border pt-[26px]">
                  <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-clay-faint">
                    Or start from an example
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {EXAMPLE_KEYWORDS.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => {
                          setKeyword(example);
                          focusKeyword();
                        }}
                        className="rounded-full border border-clay-border bg-clay-shell px-[13px] py-2 text-[12.5px] font-medium text-clay-ink transition-colors hover:border-clay-ring"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </EmptyState>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
