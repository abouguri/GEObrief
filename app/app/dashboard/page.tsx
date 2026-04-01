'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Download, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Dashboard() {
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [niche, setNiche] = useState('');
  const [brief, setBrief] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(2);
  const [usageLimit] = useState(3);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');
  const [copied, setCopied] = useState(false);

  const canGenerate = userPlan === 'pro' || usageCount < usageLimit;
  const isAtLimit = usageCount >= usageLimit;

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

    if (!canGenerate) {
      setError('You have reached your free brief limit. Upgrade to Pro to continue.');
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
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          url: url.trim() || undefined,
          niche: niche.trim() || undefined,
        }),
      });

      if (response.status === 429) {
        setError('You have reached your free brief limit. Upgrade to Pro to continue.');
        setUserPlan('free');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate brief. Please try again.');
        return;
      }

      const data = await response.json();
      setBrief(data.brief);
      setUsageCount((prev) => prev + 1);
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

  const handleDownloadPDF = () => {
    if (!brief) return;

    // Basic PDF download using data URL
    const element = document.createElement('a');
    const file = new Blob([brief], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `geo-brief-${keyword.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-brand-accent">
            GEObrief.ai
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/app/history" className="text-white/70 hover:text-white transition-colors">
              History
            </Link>
            <Link href="/app/settings" className="text-white/70 hover:text-white transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Usage Banner */}
        <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">
                {userPlan === 'pro' ? (
                  <span className="text-brand-accent font-semibold">Pro Plan • Unlimited Briefs</span>
                ) : (
                  <>
                    <span className="font-semibold">{usageCount} of {usageLimit}</span> free briefs used this month
                  </>
                )}
              </p>
            </div>
            {isAtLimit && userPlan === 'free' && (
              <Link
                href="https://gumroad.com/geobrief"
                className="text-xs px-4 py-2 bg-brand-accent text-brand-dark rounded font-semibold hover:opacity-90 transition-opacity"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
          {userPlan === 'free' && !isAtLimit && (
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-accent to-brand-accent/60 transition-all"
                style={{ width: `${(usageCount / usageLimit) * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleGenerateBrief} className="space-y-6 sticky top-24">
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
                <label htmlFor="url" className="block text-sm font-semibold mb-3">
                  Website URL <span className="text-white/40">(optional)</span>
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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
                disabled={loading || !canGenerate}
                className="w-full px-6 py-3 bg-brand-accent text-brand-dark rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate GEO Brief'
                )}
              </button>

              {isAtLimit && userPlan === 'free' && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-300 mb-3">
                    You've used all your free briefs this month.
                  </p>
                  <a
                    href="https://gumroad.com/geobrief"
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
                {/* Output Controls */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
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
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                {/* Brief Content */}
                <div className="prose prose-invert max-w-none p-6 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                  <ReactMarkdown
                    components={{
                      h1: (props) => (
                        <h1 className="text-3xl font-bold text-white mt-6 mb-4 first:mt-0" {...props} />
                      ),
                      h2: (props) => (
                        <h2 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />
                      ),
                      h3: (props) => (
                        <h3 className="text-xl font-semibold text-white/90 mt-4 mb-2" {...props} />
                      ),
                      p: (props) => <p className="text-white/80 mb-4 leading-relaxed" {...props} />,
                      ul: (props) => (
                        <ul className="list-disc list-inside space-y-2 mb-4 text-white/80" {...props} />
                      ),
                      ol: (props) => (
                        <ol className="list-decimal list-inside space-y-2 mb-4 text-white/80" {...props} />
                      ),
                      li: (props) => <li className="ml-2" {...props} />,
                      code: (props) => (
                        <code
                          className="px-2 py-1 rounded bg-white/10 text-brand-accent text-sm font-mono"
                          {...props}
                        />
                      ),
                      pre: (props) => (
                        <pre
                          className="p-4 rounded-lg bg-black/30 overflow-x-auto mb-4 border border-white/10"
                          {...props}
                        />
                      ),
                      blockquote: (props) => (
                        <blockquote
                          className="pl-4 border-l-2 border-brand-accent italic text-white/70 my-4"
                          {...props}
                        />
                      ),
                      a: (props) => (
                        <a className="text-brand-accent hover:underline" {...props} />
                      ),
                    }}
                  >
                    {brief}
                  </ReactMarkdown>
                </div>

                {/* Generate Another CTA */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                  <p className="text-sm text-white/60 mb-3">
                    Ready to optimize another topic?
                  </p>
                  <button
                    onClick={() => {
                      setKeyword('');
                      setUrl('');
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
                <div className="text-center">
                  <p className="text-white/50 mb-2">Your GEO brief will appear here</p>
                  <p className="text-xs text-white/30">
                    Enter a keyword and click "Generate GEO Brief" to get started
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
