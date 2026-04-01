import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, FileText, BarChart3, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "GEObrief.ai - AI-Optimized Content Briefs for ChatGPT & Perplexity",
  description:
    "Stop writing for Google. Start writing for AI. Generate GEO-optimized content briefs designed to get cited by AI answer engines. 3 free briefs/month, then $15/mo.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-dark text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-brand-dark/80 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-brand-accent">GEObrief.ai</div>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="text-white/70 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-white/70 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-white/70 hover:text-white transition-colors"
            >
              FAQ
            </a>
            <Link
              href="/auth/login"
              className="text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-brand-accent text-brand-dark px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="inline-block bg-white/5 border border-brand-accent/20 rounded-full px-4 py-1 mb-6">
            <span className="text-brand-accent text-sm font-semibold">
              🚀 AI Search Is Reshaping SEO
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Stop writing for Google.
            <br />
            <span className="text-brand-accent">Start writing for AI.</span>
          </h1>

          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Enter a keyword. Grok analyzes how ChatGPT, Perplexity, and Google AI
            Overviews answer it. Get a GEO-optimized brief designed to get
            <span className="text-white font-semibold"> cited</span> by AI
            engines.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/auth/signup"
              className="bg-brand-accent text-brand-dark px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Generate Your First Brief <ArrowRight size={20} />
            </Link>
            <a
              href="#features"
              className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:border-brand-accent hover:bg-white/5 transition-all"
            >
              Learn More
            </a>
          </div>

          <p className="text-white/50 text-sm">
            ✓ 3 free briefs/month &nbsp; ✓ No credit card required &nbsp; ✓ Lifetime deal: $59 early access
          </p>
        </div>
      </section>

      {/* Demo / Social Proof */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
          <div className="text-center mb-8">
            <h3 className="text-white/50 text-sm uppercase tracking-wider font-semibold">
              What a GEO Brief Includes
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black/40 rounded-lg p-6 border border-white/5 hover:border-brand-accent/30 transition-colors">
              <FileText className="text-brand-accent mb-4" size={24} />
              <h4 className="font-bold mb-2">AI-Optimized Title</h4>
              <p className="text-white/60 text-sm">
                Title crafted specifically for AI engines to cite and surface
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-6 border border-white/5 hover:border-brand-accent/30 transition-colors">
              <TrendingUp className="text-brand-accent mb-4" size={24} />
              <h4 className="font-bold mb-2">Content Structure</h4>
              <p className="text-white/60 text-sm">
                Ideal format and heading structure AI engines favor most
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-6 border border-white/5 hover:border-brand-accent/30 transition-colors">
              <Zap className="text-brand-accent mb-4" size={24} />
              <h4 className="font-bold mb-2">GEO Score</h4>
              <p className="text-white/60 text-sm">
                Likelihood your content will be cited (Low/Med/High estimate)
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-6 border border-white/5 hover:border-brand-accent/30 transition-colors">
              <BarChart3 className="text-brand-accent mb-4" size={24} />
              <h4 className="font-bold mb-2">Competing Sources</h4>
              <p className="text-white/60 text-sm">
                3 sources AI currently cites—study and outperform them
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-6 border border-white/5 hover:border-brand-accent/30 transition-colors">
              <Shield className="text-brand-accent mb-4" size={24} />
              <h4 className="font-bold mb-2">E-E-A-T Signals</h4>
              <p className="text-white/60 text-sm">
                Author bio, sources, and proof elements AI looks for
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-6 border border-white/5 hover:border-brand-accent/30 transition-colors">
              <FileText className="text-brand-accent mb-4" size={24} />
              <h4 className="font-bold mb-2">Schema Recommendations</h4>
              <p className="text-white/60 text-sm">
                FAQ, HowTo, or Article schema for maximum AI visibility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why GEO Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Why GEO? The AI Search Shift Is Real.
            </h2>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3">
                <span className="text-brand-accent font-bold">→</span>
                <span>
                  <strong>2025 data:</strong> 64% of Gen Z never uses Google Search
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-accent font-bold">→</span>
                <span>
                  <strong>AI Overviews:</strong> Google's AI answers are stealing
                  clicks from organic results
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-accent font-bold">→</span>
                <span>
                  <strong>Content agencies:</strong> Traditional SEO briefs don't
                  get cited by AI
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-accent font-bold">→</span>
                <span>
                  <strong>The shift:</strong> Content that gets cited = traffic,
                  authority, backlinks
                </span>
              </li>
            </ul>
            <p className="text-white/60 text-sm">
              GEObrief.ai bridges the gap. Instead of guessing what AI engines
              want, we analyze what they're currently citing—then show you how
              to outcompete.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
            <div className="space-y-4">
              <div className="bg-black/40 rounded-lg p-4">
                <h4 className="text-brand-accent font-bold mb-2">Traditional SEO Brief</h4>
                <p className="text-white/60 text-sm">
                  ✗ Optimized for keyword rankings &nbsp; ✗ SERP-focused &nbsp; ✗ Ignores AI
                </p>
              </div>
              <div className="bg-brand-accent/10 border border-brand-accent rounded-lg p-4">
                <h4 className="text-brand-accent font-bold mb-2">GEO Brief</h4>
                <p className="text-white text-sm">
                  ✓ Optimized for AI citation &nbsp; ✓ Citation-first &nbsp; ✓ Works for ChatGPT, Perplexity, Google AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-white/60 text-lg">
            Start free. Upgrade when you're ready.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-brand-accent/30 transition-colors">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-white/60 mb-6">Get started instantly</p>
            <div className="mb-8">
              <div className="text-4xl font-bold text-brand-accent">$0</div>
              <p className="text-white/60 text-sm mt-1">/month</p>
            </div>
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> 3 briefs/month
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Full brief output
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Copy to clipboard
              </li>
              <li className="flex items-center gap-2 text-white/40">
                <span>✗</span> PDF download
              </li>
              <li className="flex items-center gap-2 text-white/40">
                <span>✗</span> Brief history
              </li>
            </ul>
            <Link
              href="/auth/signup"
              className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-lg font-semibold hover:border-brand-accent hover:bg-white/5 transition-all text-center block"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-brand-accent/10 border-2 border-brand-accent rounded-2xl p-8 relative">
            <div className="absolute top-4 right-4 bg-brand-accent text-brand-dark px-3 py-1 rounded-full text-xs font-bold">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-white/60 mb-6">For serious content creators</p>
            <div className="mb-8">
              <div className="text-4xl font-bold">$15</div>
              <p className="text-white/60 text-sm mt-1">/month</p>
            </div>
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Unlimited briefs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Full brief output
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Copy to clipboard
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> PDF download
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Brief history
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Priority support
              </li>
            </ul>
            <Link
              href="/auth/signup?plan=pro"
              className="w-full bg-brand-accent text-brand-dark py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center block"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Lifetime Deal */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-brand-accent/30 transition-colors">
            <h3 className="text-2xl font-bold mb-2">Lifetime Deal</h3>
            <p className="text-white/60 mb-6">One-time payment, forever access</p>
            <div className="mb-8">
              <div className="text-4xl font-bold text-brand-accent">$59</div>
              <p className="text-white/60 text-sm mt-1">one-time</p>
            </div>
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Unlimited briefs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Full brief output
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Copy to clipboard
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> PDF download
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Brief history
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-accent">✓</span> Priority support
              </li>
            </ul>
            <a
              href="https://gumroad.com/geobrief"
              className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-lg font-semibold hover:border-brand-accent hover:bg-white/5 transition-all text-center block"
            >
              Get Lifetime Deal
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <details className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-brand-accent/30 transition-colors group cursor-pointer">
            <summary className="font-bold flex items-center justify-between">
              What is GEO (Generative Engine Optimization)?
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="text-white/60 mt-4">
              GEO is the practice of optimizing content to be cited and surfaced by
              AI answer engines like ChatGPT, Perplexity, and Google AI Overviews.
              It's different from traditional SEO, which focuses on ranking in search
              results.
            </p>
          </details>

          <details className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-brand-accent/30 transition-colors group cursor-pointer">
            <summary className="font-bold flex items-center justify-between">
              How does Grok analyze what AI engines are citing?
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="text-white/60 mt-4">
              Grok uses web search to find how ChatGPT, Perplexity, and Google AI
              Overviews currently answer your target keyword. We analyze their
              citations, recommended formats, and E-E-A-T signals, then generate a
              brief optimized to outcompete.
            </p>
          </details>

          <details className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-brand-accent/30 transition-colors group cursor-pointer">
            <summary className="font-bold flex items-center justify-between">
              Can I use GEO for my blog? My agency?
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="text-white/60 mt-4">
              Yes. GEObrief.ai works for indie bloggers, agencies, and content teams.
              Each brief is a standalone document you can use immediately or refine
              further. Copy it to a doc, export as PDF, or integrate into your
              workflow.
            </p>
          </details>

          <details className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-brand-accent/30 transition-colors group cursor-pointer">
            <summary className="font-bold flex items-center justify-between">
              Do you store my briefs?
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="text-white/60 mt-4">
              Yes. All your briefs are saved in your account history. You can
              revisit, edit, and re-export them anytime. We use Supabase for secure
              storage.
            </p>
          </details>

          <details className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-brand-accent/30 transition-colors group cursor-pointer">
            <summary className="font-bold flex items-center justify-between">
              What about privacy? Do you sell my data?
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="text-white/60 mt-4">
              No. We don't sell data. Briefs are private to your account. We use
              Grok API for analysis, but no keywords or briefs are logged by X.AI
              beyond normal API usage patterns.
            </p>
          </details>

          <details className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-brand-accent/30 transition-colors group cursor-pointer">
            <summary className="font-bold flex items-center justify-between">
              Can I cancel anytime?
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="text-white/60 mt-4">
              Yes. No contracts, no lock-in. Upgrade or downgrade anytime. Lifetime
              deal purchases are final (non-refundable) but never expire.
            </p>
          </details>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to adapt your content for AI?
        </h2>
        <p className="text-white/60 mb-8 text-lg">
          Generate your first GEO brief free. No credit card required.
        </p>
        <Link
          href="/auth/signup"
          className="bg-brand-accent text-brand-dark px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          Generate Your First Brief <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GEO Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Reddit
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
            <p>
              © 2026 GEObrief.ai. Built by content strategists for content
              strategists.
            </p>
          </div>
        </div>
      </footer>

      {/* Structured Data - FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is GEO (Generative Engine Optimization)?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "GEO is the practice of optimizing content to be cited and surfaced by AI answer engines like ChatGPT, Perplexity, and Google AI Overviews. It's different from traditional SEO, which focuses on ranking in search results.",
                },
              },
              {
                "@type": "Question",
                name: "How does Grok analyze what AI engines are citing?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Grok uses web search to find how ChatGPT, Perplexity, and Google AI Overviews currently answer your target keyword. We analyze their citations, recommended formats, and E-E-A-T signals, then generate a brief optimized to outcompete.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use GEO for my blog? My agency?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. GEObrief.ai works for indie bloggers, agencies, and content teams. Each brief is a standalone document you can use immediately or refine further.",
                },
              },
            ],
          }),
        }}
      />

      {/* WebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "GEObrief.ai",
            description:
              "AI-optimized content brief generator designed to get cited by ChatGPT, Perplexity, and AI Overviews",
            url: process.env.NEXT_PUBLIC_APP_URL || "https://geobrief.ai",
            applicationCategory: "ProductivityApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free plan: 3 briefs/month",
            },
          }),
        }}
      />
    </main>
  );
}
