'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  Copy,
  Download,
  Loader,
  Search,
  CheckCircle2,
} from 'lucide-react';
import AppNav from '@/components/AppNav';
import AuthGuard from '@/components/AuthGuard';
import BriefMarkdown from '@/components/BriefMarkdown';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { downloadBriefAsPdf } from '@/lib/pdf';
import type { BriefSummary } from '@/lib/briefs';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface OpenBrief {
  keyword: string;
  markdown: string;
}

function HistoryContent() {
  const { user } = useAuth();

  const [briefs, setBriefs] = useState<BriefSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<OpenBrief | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadBriefs = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const client = supabase();
      // RLS limits this to the caller's own rows; the filter is belt-and-braces.
      const { data, error: queryError } = await client
        .from('briefs')
        .select('id, keyword, website_url, niche, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) throw new Error(queryError.message);

      setBriefs((data ?? []) as unknown as BriefSummary[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your briefs.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBriefs();
  }, [loadBriefs]);

  // Fetch the markdown only when a brief is actually opened. The list view
  // does not need to carry every full brief body.
  const handleOpen = async (id: string, keyword: string) => {
    setOpeningId(id);
    setError(null);

    try {
      const client = supabase();
      const { data, error: queryError } = await client
        .from('briefs')
        .select('brief_markdown')
        .eq('id', id)
        .single();

      if (queryError) throw new Error(queryError.message);

      const row = data as unknown as { brief_markdown: string };
      setOpen({ keyword, markdown: row.brief_markdown });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open that brief.');
    } finally {
      setOpeningId(null);
    }
  };

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return briefs;

    return briefs.filter(
      (brief) =>
        brief.keyword.toLowerCase().includes(term) ||
        (brief.niche ?? '').toLowerCase().includes(term)
    );
  }, [briefs, query]);

  const handleCopy = async () => {
    if (!open) return;

    try {
      await navigator.clipboard.writeText(open.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy brief');
    }
  };

  const handleDownload = async () => {
    if (!open) return;

    try {
      await downloadBriefAsPdf(open.markdown, open.keyword);
    } catch {
      setError('Failed to build the PDF. Try copying the brief instead.');
    }
  };

  if (open) {
    return (
      <div className="brand-pattern pattern-reference-rail min-h-screen bg-ui-paper text-ui-ink">
        <AppNav />
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-4">
          <button
            onClick={() => setOpen(null)}
            className="flex items-center gap-2 text-sm text-ui-muted hover:text-ui-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to history
          </button>

          <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-ui-surface border border-ui-border">
            <span className="text-sm font-semibold mr-auto">{open.keyword}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ui-shell hover:border-ui-ring transition-colors text-sm font-semibold"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
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
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ui-shell hover:border-ui-ring transition-colors text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <BriefMarkdown markdown={open.markdown} />
        </div>
      </div>
    );
  }

  return (
    <div className="brand-pattern pattern-reference-rail min-h-screen bg-ui-paper text-ui-ink">
      <AppNav />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Brief History</h1>
          <p className="text-ui-muted">
            Every brief you&apos;ve generated, newest first.
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="w-4 h-4 text-ui-faint absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by keyword or niche"
            aria-label="Filter briefs by keyword or niche"
            className="w-full pl-11 pr-4 py-3 rounded-lg bg-ui-surface border border-ui-border focus:border-ui-ring focus:outline-none transition-colors text-ui-ink placeholder-ui-placeholder"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader className="w-6 h-6 animate-spin text-ui-accent" />
          </div>
        ) : briefs.length === 0 ? (
          <div className="p-10 rounded-lg bg-ui-surface border border-ui-border border-dashed text-center">
            <p className="text-ui-muted mb-4">You haven&apos;t generated any briefs yet.</p>
            <Link
              href="/app/dashboard"
              className="inline-block px-6 py-2 bg-ui-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              Generate your first brief
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-ui-muted text-center py-12">
            No briefs match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((brief) => (
              <li
                key={brief.id}
                className="p-5 rounded-lg bg-ui-surface border border-ui-border hover:border-ui-ring transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{brief.keyword}</p>
                    <p className="text-xs text-ui-muted mt-1">
                      {formatDate(brief.created_at)}
                      {brief.niche && ` • ${brief.niche}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpen(brief.id, brief.keyword)}
                    disabled={openingId === brief.id}
                    className="px-4 py-2 rounded-lg bg-ui-shell hover:border-ui-ring transition-colors text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    {openingId === brief.id ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Opening…
                      </>
                    ) : (
                      'Reopen'
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function History() {
  return (
    <AuthGuard>
      <HistoryContent />
    </AuthGuard>
  );
}
