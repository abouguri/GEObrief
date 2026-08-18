'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Download, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import AppNav from '@/components/AppNav';
import AuthGuard from '@/components/AuthGuard';
import BriefMarkdown from '@/components/BriefMarkdown';
import UsageBanner from '@/components/UsageBanner';
import { useAuth } from '@/lib/auth-context';
import { downloadBriefAsPdf } from '@/lib/pdf';
import { FREE_BRIEF_LIMIT, GUMROAD_PRO_URL } from '@/lib/config';

function DashboardContent() {
  const { session, profile, refreshProfile } = useAuth();

  const [keyword, setKeyword] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [niche, setNiche] = useState('');
  const [brief, setBrief] = useState<string | null>(null);
  const [briefKeyword, setBriefKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // The server is the authority on the quota; this only shapes the UI.
  const isPaid = profile ? profile.plan !== 'free' : false;
  const isAtLimit = !isPaid && (profile?.usageCount ?? 0) >= FREE_BRIEF_LIMIT;

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
    <div className="min-h-screen bg-brand-dark text-white">
      <AppNav />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <UsageBanner profile={profile} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleGenerateBrief} className="space-y-6 lg:sticky lg:top-24">
              <div>
                <label htmlFor="keyword" className="block text-sm font-semibold mb-3">
                  Target Keyword <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="keyword"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., AI content optimization"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand-accent focus:outline-none transition-colors text-white placeholder-white/40"
                  disabled={loading}
                />
                <p className="text-xs text-white/50 mt-2">
                  The main topic or keyword you want to optimize for AI search engines
                </p>
              </div>

              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-semibold mb-3">
                  Website URL <span className="text-white/40">(optional)</span>
                </label>
                <input
                  id="websiteUrl"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand-accent focus:outline-none transition-colors text-white placeholder-white/40"
                  disabled={loading}
                />
                <p className="text-xs text-white/50 mt-2">
                  Your website URL for context-aware recommendations
                </p>
              </div>

              <div>
                <label htmlFor="niche" className="block text-sm font-semibold mb-3">
                  Industry / Niche <span className="text-white/40">(optional)</span>
                </label>
                <input
                  id="niche"
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g., SaaS, E-commerce"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand-accent focus:outline-none transition-colors text-white placeholder-white/40"
                  disabled={loading}
                />
                <p className="text-xs text-white/50 mt-2">
                  Your industry to tailor recommendations
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isAtLimit}
                className="w-full px-6 py-3 bg-brand-accent text-brand-dark rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating…
                  </>
                ) : (
                  'Generate GEO Brief'
                )}
              </button>

              {loading && (
                <p className="text-xs text-white/40 text-center">
                  Grok is searching the live web for how AI engines answer this topic. This
                  usually takes 20–40 seconds.
                </p>
              )}

              {isAtLimit && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-300 mb-3">
                    You&apos;ve used all {FREE_BRIEF_LIMIT} free briefs this month.
                  </p>
                  <a
                    href={GUMROAD_PRO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block px-4 py-2 bg-brand-accent text-brand-dark rounded font-semibold text-center hover:opacity-90 transition-opacity"
                  >
                    Upgrade to Pro
                  </a>
                </div>
              )}
            </form>
          </div>

          {/* Brief Output */}
          <div className="lg:col-span-2">
            {brief ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                  <button
                    onClick={handleCopyBrief}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Markdown
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <Link
                    href="/app/history"
                    className="ml-auto text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Saved to your history →
                  </Link>
                </div>

                <BriefMarkdown markdown={brief} />

                <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                  <p className="text-sm text-white/60 mb-3">Ready to optimize another topic?</p>
                  <button
                    onClick={() => {
                      setKeyword('');
                      setWebsiteUrl('');
                      setNiche('');
                      setBrief(null);
                      setError(null);
                    }}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Generate Another Brief
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-96 rounded-lg bg-white/5 border border-white/10 border-dashed flex items-center justify-center">
                <div className="text-center px-6">
                  <p className="text-white/50 mb-2">Your GEO brief will appear here</p>
                  <p className="text-xs text-white/30">
                    Enter a keyword and click &ldquo;Generate GEO Brief&rdquo; to get started
                  </p>
                </div>
              </div>
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
