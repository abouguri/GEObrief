import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, FileText, BarChart3, Shield } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { GUMROAD_LIFETIME_URL, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "GEObrief.ai - AI-Optimized Content Briefs for ChatGPT & Perplexity",
  description:
    "Stop writing for Google. Start writing for AI. Generate GEO-optimized content briefs designed to get cited by AI answer engines. 3 free briefs/month, then $15/mo.",
  alternates: { canonical: SITE_URL },
};

const BRIEF_CONTENTS = [
  {
    icon: FileText,
    title: "AI-Optimized Title",
    body: "Title crafted specifically for AI engines to cite and surface",
  },
  {
    icon: TrendingUp,
    title: "Content Structure",
    body: "Ideal format and heading structure AI engines favor most",
  },
  {
    icon: Zap,
    title: "GEO Score",
    body: "Likelihood your content will be cited (Low/Med/High estimate)",
  },
  {
    icon: BarChart3,
    title: "Competing Sources",
    body: "The sources AI currently cites — study and outperform them",
  },
  {
    icon: Shield,
    title: "E-E-A-T Signals",
    body: "Author bio, sources, and proof elements AI looks for",
  },
  {
    icon: FileText,
    title: "Schema Recommendations",
    body: "FAQ, HowTo, or Article schema for maximum AI visibility",
  },
];

const FAQS = [
  {
    q: "What is GEO (Generative Engine Optimization)?",
    a: "GEO is the practice of optimizing content to be cited and surfaced by AI answer engines like ChatGPT, Perplexity, and Google AI Overviews. It's different from traditional SEO, which focuses on ranking in search results.",
  },
  {
    q: "How do you analyze what AI engines are citing?",
    a: "We search the live web to find how ChatGPT, Perplexity, and Google AI Overviews currently answer your target keyword. We analyze their citations, recommended formats, and E-E-A-T signals, then generate a brief optimized to outcompete.",
  },
  {
    q: "Can I use GEO for my blog? My agency?",
    a: "Yes. GEObrief.ai works for indie bloggers, agencies, and content teams. Each brief is a standalone document you can use immediately or refine further.",
  },
  {
    q: "Do you store or sell my keywords?",
    a: "No. We don't sell data. Briefs are private to your account. Your keywords are sent to our AI provider to generate the brief and are not used for advertising.",
  },
  {
    q: "How long does a brief take to generate?",
    a: "Usually 20–40 seconds. The model searches the live web before writing, which is what makes the cited-sources section real rather than recalled.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no lock-in. Upgrade or downgrade anytime. Lifetime deal purchases are final (non-refundable) but never expire.",
  },
];

const PLAN_FEATURES = {
  free: [
    ["3 briefs/month", true],
    ["Full brief output", true],
    ["Copy to clipboard", true],
    ["PDF download", false],
    ["Brief history", false],
  ],
  paid: [
    ["Unlimited briefs", true],
    ["Full brief output", true],
    ["Copy to clipboard", true],
    ["PDF download", true],
    ["Brief history", true],
    ["Priority support", true],
  ],
} as const;

function PlanFeature({ label, included }: { label: string; included: boolean }) {
  return (
    <li
      className={`flex items-center gap-2 ${included ? "text-clay-body" : "text-clay-ghost"}`}
    >
      <span className={included ? "text-clay-accent" : "text-clay-ghost"}>
        {included ? "✓" : "✗"}
      </span>
      {label}
    </li>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-clay-paper text-clay-ink">
      <MarketingNav />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-block rounded-full border border-clay-ring bg-clay-soft px-4 py-1">
            <span className="text-sm font-semibold text-clay-accent">
              AI Search Is Reshaping SEO
            </span>
          </div>

          <h1 className="mb-6 font-serif text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Stop writing for Google.
            <br />
            <span className="text-clay-accent">Start writing for AI.</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-clay-muted [text-wrap:pretty]">
            Enter a keyword. We analyze how ChatGPT, Perplexity, and Google AI Overviews
            answer it. Get a GEO-optimized brief designed to get
            <span className="font-semibold text-clay-ink"> cited</span> by AI engines.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 rounded-lg bg-clay-accent px-8 py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
            >
              Generate Your First Brief <ArrowRight size={20} />
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-clay-border bg-clay-surface px-8 py-4 font-semibold text-clay-ink transition-colors hover:border-clay-ring"
            >
              Learn More
            </a>
          </div>

          <p className="text-sm text-clay-faint">
            ✓ 3 free briefs/month &nbsp; ✓ No credit card required &nbsp; ✓ Lifetime deal:
            $59 one-time
          </p>
        </div>
      </section>

      {/* What a brief includes */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-clay-border bg-clay-surface p-8 shadow-[0_1px_2px_rgba(26,22,19,0.04),0_18px_44px_-26px_rgba(26,22,19,0.16)]">
          <div className="mb-8 text-center">
            <h3 className="text-sm font-semibold uppercase tracking-[0.09em] text-clay-faint">
              What a GEO Brief Includes
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {BRIEF_CONTENTS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-lg border border-clay-border bg-clay-shell p-6 transition-colors hover:border-clay-ring"
              >
                <Icon className="mb-4 text-clay-accent" size={24} />
                <h4 className="mb-2 font-semibold">{title}</h4>
                <p className="text-sm text-clay-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why GEO */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight">
              Why GEO? The AI Search Shift Is Real.
            </h2>
            <ul className="mb-8 space-y-4">
              {[
                ["2025 data:", "64% of Gen Z never uses Google Search"],
                ["AI Overviews:", "Google's AI answers are stealing clicks from organic results"],
                ["Content agencies:", "Traditional SEO briefs don't get cited by AI"],
                ["The shift:", "Content that gets cited = traffic, authority, backlinks"],
              ].map(([label, text]) => (
                <li key={label} className="flex gap-3">
                  <span className="font-bold text-clay-accent">→</span>
                  <span className="text-clay-body">
                    <strong className="text-clay-ink">{label}</strong> {text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-clay-muted">
              GEObrief.ai bridges the gap. Instead of guessing what AI engines want, we
              analyze what they&apos;re currently citing—then show you how to outcompete.
            </p>
          </div>

          <div className="rounded-2xl border border-clay-border bg-clay-surface p-8">
            <div className="space-y-4">
              <div className="rounded-lg border border-clay-border bg-clay-shell p-4">
                <h4 className="mb-2 font-semibold text-clay-muted">
                  Traditional SEO Brief
                </h4>
                <p className="text-sm text-clay-muted">
                  ✗ Optimized for keyword rankings &nbsp; ✗ SERP-focused &nbsp; ✗ Ignores
                  AI
                </p>
              </div>
              <div className="rounded-lg border border-clay-ring bg-clay-soft p-4">
                <h4 className="mb-2 font-semibold text-clay-accent">GEO Brief</h4>
                <p className="text-sm text-clay-body">
                  ✓ Optimized for AI citation &nbsp; ✓ Citation-first &nbsp; ✓ Works for
                  ChatGPT, Perplexity, Google AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-serif text-4xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-clay-muted">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Free */}
          <div className="rounded-2xl border border-clay-border bg-clay-surface p-8 transition-colors hover:border-clay-ring">
            <h3 className="mb-2 font-serif text-2xl font-semibold">Free</h3>
            <p className="mb-6 text-clay-muted">Get started instantly</p>
            <div className="mb-8">
              <div className="font-serif text-4xl font-bold">$0</div>
              <p className="mt-1 text-sm text-clay-muted">/month</p>
            </div>
            <ul className="mb-8 space-y-3 text-sm">
              {PLAN_FEATURES.free.map(([label, included]) => (
                <PlanFeature key={label} label={label} included={included} />
              ))}
            </ul>
            <Link
              href="/auth/signup"
              className="block w-full rounded-lg border border-clay-border bg-clay-shell py-3 text-center font-semibold text-clay-ink transition-colors hover:border-clay-ring"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro — highlighted */}
          <div className="relative rounded-2xl border-2 border-clay-accent bg-clay-surface p-8 shadow-[0_1px_2px_rgba(26,22,19,0.04),0_20px_48px_-26px_rgba(194,84,47,0.35)]">
            <div className="absolute right-4 top-4 rounded-full bg-clay-accent px-3 py-1 text-xs font-bold text-white">
              POPULAR
            </div>
            <h3 className="mb-2 font-serif text-2xl font-semibold">Pro</h3>
            <p className="mb-6 text-clay-muted">For serious content creators</p>
            <div className="mb-8">
              <div className="font-serif text-4xl font-bold text-clay-accent">$15</div>
              <p className="mt-1 text-sm text-clay-muted">/month</p>
            </div>
            <ul className="mb-8 space-y-3 text-sm">
              {PLAN_FEATURES.paid.map(([label, included]) => (
                <PlanFeature key={label} label={label} included={included} />
              ))}
            </ul>
            <Link
              href="/auth/signup?plan=pro"
              className="block w-full rounded-lg bg-clay-accent py-3 text-center font-semibold text-white transition-opacity hover:opacity-90"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Lifetime */}
          <div className="rounded-2xl border border-clay-border bg-clay-surface p-8 transition-colors hover:border-clay-ring">
            <h3 className="mb-2 font-serif text-2xl font-semibold">Lifetime</h3>
            <p className="mb-6 text-clay-muted">Early adopter deal — pay once</p>
            <div className="mb-8">
              <div className="font-serif text-4xl font-bold">$59</div>
              <p className="mt-1 text-sm text-clay-muted">one-time</p>
            </div>
            <ul className="mb-8 space-y-3 text-sm">
              {PLAN_FEATURES.paid.map(([label, included]) => (
                <PlanFeature key={label} label={label} included={included} />
              ))}
            </ul>
            <a
              href={GUMROAD_LIFETIME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg border border-clay-border bg-clay-shell py-3 text-center font-semibold text-clay-ink transition-colors hover:border-clay-ring"
            >
              Get Lifetime Deal
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center font-serif text-4xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group cursor-pointer rounded-lg border border-clay-border bg-clay-surface p-6 transition-colors hover:border-clay-ring"
            >
              <summary className="flex items-center justify-between font-semibold">
                {faq.q}
                <span className="text-clay-accent transition-transform group-open:rotate-180">
                  ↓
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-clay-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight">
          Ready to adapt your content for AI?
        </h2>
        <p className="mb-8 text-lg text-clay-muted">
          Generate your first GEO brief free. No credit card required.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 rounded-lg bg-clay-accent px-8 py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
        >
          Generate Your First Brief <ArrowRight size={20} />
        </Link>
      </section>

      <MarketingFooter />

      {/* Structured Data — FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
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
            url: SITE_URL,
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
