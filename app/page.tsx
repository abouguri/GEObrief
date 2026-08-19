import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code,
  Copy,
  Download,
  Gauge,
  ListTree,
  CircleHelp,
  Link as LinkIcon,
  Quote,
  Search,
  ShieldCheck,
  Type,
  X,
} from "lucide-react";
import { posts } from "@/content/posts";
import {
  GUMROAD_LIFETIME_URL,
  SITE_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
} from "@/lib/config";

export const metadata: Metadata = {
  title: "GEObrief.ai - Get Cited, Not Just Ranked",
  description:
    "Type a keyword. GEObrief searches the live web for how ChatGPT, Perplexity and AI Overviews answer it right now, then hands back a brief built to be the source they quote. 3 free briefs/month.",
  alternates: { canonical: SITE_URL },
};

// Colour rotates emerald / purple / amber across the anatomy grid and the
// "how it works" steps. This is a Tailwind-safe lookup, since class names
// built by string interpolation are invisible to the content scanner.
const ACCENT = {
  accent: { text: "text-mk-accent", border: "border-mk-accent/30", bg: "bg-mk-accent/10" },
  purple: { text: "text-mk-purple", border: "border-mk-purple/30", bg: "bg-mk-purple/10" },
  amber: { text: "text-mk-amber", border: "border-mk-amber/30", bg: "bg-mk-amber/10" },
} as const;

type AccentKey = keyof typeof ACCENT;

const ANATOMY_ITEMS: Array<{
  n: string;
  color: AccentKey;
  icon: typeof Type;
  title: string;
  body: string;
  highlighted?: boolean;
}> = [
  {
    n: "01",
    color: "accent",
    icon: Type,
    title: "Citation-shaped title",
    body: "Specific and direct, not a curiosity gap. Engines quote what states the answer.",
  },
  {
    n: "02",
    color: "purple",
    icon: Quote,
    title: "The answer block",
    body: "40–80 self-contained words written to be lifted verbatim into an AI answer.",
  },
  {
    n: "03",
    color: "amber",
    icon: ListTree,
    title: "Heading structure",
    body: "Question-shaped H2s, in the order the topic is actually asked about.",
  },
  {
    n: "04",
    color: "accent",
    icon: CircleHelp,
    title: "Key questions",
    body: "The real questions behind the keyword, each one answerable in a paragraph.",
  },
  {
    n: "05",
    color: "purple",
    icon: Code,
    title: "Schema markup",
    body: "FAQPage, HowTo or Article: whichever the current answers are built from.",
  },
  {
    n: "06",
    color: "amber",
    icon: ShieldCheck,
    title: "E-E-A-T signals",
    body: "The named author, sourcing and proof elements the topic is held to.",
  },
  {
    n: "07",
    color: "accent",
    icon: LinkIcon,
    title: "Cited sources, retrieved not recalled",
    body: "Pulled from a live search performed while your brief is written. If nothing was retrieved, the brief says so instead of inventing URLs.",
    highlighted: true,
  },
  {
    n: "08",
    color: "purple",
    icon: Gauge,
    title: "GEO score",
    body: "Low, Medium or High: an honest read on whether this brief can win the citation.",
  },
];

const COMPARISON = {
  seo: [
    "Keyword density and length targets",
    "Headlines built to earn the click",
    "Answers held back until halfway down",
    "Success measured in position",
  ],
  geo: [
    "Self-contained passages an engine can lift",
    "The claim stated in the first sentence",
    "Sourcing and authorship an engine can verify",
    "Success measured in citations",
  ],
};

const FAQS = [
  {
    q: "What is GEO, and how is it different from SEO?",
    a: "GEO, or generative engine optimization, is writing so that AI answer engines cite you. SEO competes for a position on a results page; GEO competes to be the source an engine quotes when it writes the answer instead.",
  },
  {
    q: "How do you know what AI engines are citing?",
    a: "We search the live web while your brief is being written, and the brief is built from what came back: the sources, the formats they use, the E-E-A-T signals they carry. If a search returns nothing, the brief says so rather than presenting URLs a model recalled.",
  },
  {
    q: "What setup do I need before my first brief?",
    a: "None. No site connection, no Search Console, no project configuration. Sign up, type a keyword, read the brief. A website URL and niche are optional context, nothing more.",
  },
  {
    q: "How long does a brief take?",
    a: "Usually 20–45 seconds. A search step retrieves real sources first, then a separate step writes the brief from them. That two-step handoff is what the wait buys you.",
  },
  {
    q: "Do you store or sell my keywords?",
    a: "No. We don't sell data. Briefs are private to your account, and your keywords go to our AI provider to generate the brief, never to advertising.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no lock-in, upgrade or downgrade whenever. Lifetime purchases are final and non-refundable, but they never expire.",
  },
];

const PLAN_FEATURES = {
  free: [
    ["3 briefs per month", true],
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
    <li className="flex items-center gap-2.5 text-[14.5px] text-ui-body">
      {included ? (
        <Check size={15} className="flex-none text-ui-accent" />
      ) : (
        <X size={15} className="flex-none text-ui-ghost" />
      )}
      <span className={included ? "" : "text-ui-ghost"}>{label}</span>
    </li>
  );
}

const NAV_LINKS = [
  { href: "#anatomy", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-mk-border bg-mk-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-[19px] font-bold tracking-tight text-mk-ink">
          GEObrief<span className="text-mk-accent">.ai</span>
        </Link>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden text-sm text-mk-muted transition-colors hover:text-mk-ink sm:inline"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/blog"
            className="hidden text-sm text-mk-muted transition-colors hover:text-mk-ink sm:inline"
          >
            Blog
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-mk-muted transition-colors hover:text-mk-ink"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="whitespace-nowrap rounded-[9px] bg-mk-accent px-[18px] py-[9px] text-sm font-semibold text-mk-accent-ink transition-colors hover:bg-mk-accent-hover"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function LandingFooter() {
  const featured = posts.slice(0, 3);

  return (
    <footer className="border-t border-mk-border bg-mk-paper px-6 pb-10 pt-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="mb-3.5 text-lg font-bold tracking-tight text-mk-ink">
              GEObrief<span className="text-mk-accent">.ai</span>
            </p>
            <p className="max-w-[240px] text-sm leading-relaxed text-mk-faint">
              Content briefs built to be cited by AI answer engines.
            </p>
          </div>

          <div>
            <h4 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-mk-muted">
              Product
            </h4>
            <ul className="flex flex-col gap-2 text-[14.5px]">
              <li>
                <a href="#anatomy" className="text-mk-body transition-colors hover:text-mk-accent">
                  How it works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-mk-body transition-colors hover:text-mk-accent">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="text-mk-body transition-colors hover:text-mk-accent">
                  FAQ
                </a>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className="text-mk-body transition-colors hover:text-mk-accent"
                >
                  Get started free
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-mk-muted">
              GEO guides
            </h4>
            <ul className="flex flex-col gap-2 text-[14.5px]">
              {featured.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-mk-body transition-colors hover:text-mk-accent"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="text-mk-faint transition-colors hover:text-mk-ink">
                  All articles →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-mk-muted">
              Company
            </h4>
            <ul className="flex flex-col gap-2 text-[14.5px]">
              <li>
                <Link
                  href="/privacy"
                  className="text-mk-body transition-colors hover:text-mk-accent"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-mk-body transition-colors hover:text-mk-accent">
                  Terms of service
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-mk-body transition-colors hover:text-mk-accent"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-mk-border pt-6 text-[13.5px] text-mk-faint">
          <p>© {new Date().getFullYear()} GEObrief.ai</p>
        </div>
      </div>
    </footer>
  );
}

/** Framed, non-interactive reproduction of the dashboard, built in the real
 * app's `ui-*` tokens so the marketing page and the product visually agree. */
function BriefMockup() {
  return (
    <div className="overflow-hidden rounded-t-2xl border border-b-0 border-mk-border-strong bg-ui-paper shadow-[0_-40px_90px_-30px_rgba(16,185,129,0.22)]">
      <div className="flex items-center gap-2 rounded-t-2xl border-b border-ui-border bg-ui-shell px-3.5 py-[11px]">
        <span className="h-2.5 w-2.5 rounded-full bg-ui-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-ui-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-ui-border" />
        <span className="ml-2.5 text-xs text-ui-faint">geobrief.ai/app/dashboard</span>
      </div>
      <div className="grid grid-cols-1 gap-6 px-6 pt-6 md:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-4 rounded-2xl border border-ui-border bg-ui-surface p-[18px]">
          <div>
            <p className="font-serif text-[19px] font-semibold tracking-tight text-ui-ink">
              New brief
            </p>
            <p className="mt-1 text-[12.5px] text-ui-muted">One keyword is all we need.</p>
          </div>
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ui-ink">
              Target keyword <span className="text-ui-accent">*</span>
            </p>
            <div className="rounded-[10px] border border-ui-ring bg-ui-shell px-3.5 py-2.5 text-sm text-ui-ink">
              best crm for small business
            </div>
            <p className="mt-[7px] text-[11.5px] text-ui-faint">
              The topic you want AI engines to cite you for.
            </p>
          </div>
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ui-ink">
              Website URL <span className="font-normal text-ui-faint">optional</span>
            </p>
            <div className="rounded-[10px] border border-ui-border bg-ui-shell px-3.5 py-2.5 text-sm text-ui-faint">
              https://example.com
            </div>
          </div>
          <div className="rounded-[10px] bg-ui-accent py-3 text-center text-[14.5px] font-semibold text-white">
            Generate brief
          </div>
        </div>

        <div className="flex flex-col gap-3.5 pb-6 md:pb-0">
          <div className="flex items-center gap-2.5 rounded-xl border border-ui-border bg-ui-surface px-3.5 py-3">
            <span className="text-[13px] font-semibold text-ui-ink">
              best crm for small business
            </span>
            <span className="rounded-full bg-ui-soft px-[9px] py-[3px] text-[11px] font-semibold text-ui-accent">
              GEO score: High
            </span>
            <span className="ml-auto rounded-[9px] border border-ui-border bg-ui-shell px-3.5 py-[7px] text-[12.5px] font-semibold text-ui-ink">
              Copy Markdown
            </span>
          </div>
          <div className="rounded-2xl border border-ui-border bg-ui-surface px-6 pt-6">
            <h3 className="mb-3.5 font-serif text-[28px] font-bold leading-[1.15] tracking-tight text-ui-ink">
              Best CRM for Small Business: What to Choose and Why
            </h3>
            <h4 className="mb-2.5 font-serif text-lg font-semibold text-ui-ink">
              Primary Answer (AI Snapshot)
            </h4>
            <blockquote className="mb-4 border-l-2 border-ui-accent pl-[18px] font-serif text-[16px] italic leading-relaxed text-ui-quote">
              For most small businesses, the best CRM is the one that matches team size and
              sales motion: a lightweight pipeline tool for solo founders, a shared-inbox CRM
              for small sales teams, and a full platform once you run multi-step outbound.
            </blockquote>
            <h4 className="mb-2.5 font-serif text-lg font-semibold text-ui-ink">
              Recommended Structure
            </h4>
            <ul className="list-disc space-y-1.5 pl-[22px] text-[14.5px] leading-relaxed text-ui-body">
              <li>What makes a CRM right for a small business?</li>
              <li>How much should a small business pay for a CRM?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
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
  };

  return (
    <main className="overflow-x-hidden bg-mk-paper text-mk-ink">
      {/* Scroll-reveal is pure CSS (animation-timeline: view()), with a
          @supports fallback and a prefers-reduced-motion off-switch. No
          client JS involved. */}
      <style>{`
        @keyframes geobrief-reveal-up { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
        @keyframes geobrief-reveal-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes geobrief-reveal-rise { from { opacity: 0; transform: translateY(60px) scale(0.985); } to { opacity: 1; transform: none; } }
        @supports (animation-timeline: view()) {
          [data-reveal] { animation: geobrief-reveal-up linear both; animation-timeline: view(); animation-range: entry 0% entry 65%; }
          [data-reveal="fade"] { animation-name: geobrief-reveal-fade; }
          [data-reveal="rise"] { animation-name: geobrief-reveal-rise; animation-range: entry 0% entry 80%; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
        .geobrief-faq[open] .geobrief-faq-plus { transform: rotate(45deg); }
      `}</style>

      <LandingNav />

      {/* Hero */}
      <section className="relative bg-mk-paper px-6 pt-24 sm:pt-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[length:34px_34px]"
          aria-hidden="true"
        />
        <div data-reveal="fade" className="relative mx-auto max-w-6xl">
          <div className="max-w-[940px]">
            <h1 className="mb-7 text-balance font-serif text-[46px] font-bold leading-[0.94] tracking-[-0.035em] text-mk-ink sm:text-[76px] lg:text-[100px]">
              Get cited,
              <br />
              not just ranked.
            </h1>
            <p className="mb-9 max-w-[620px] text-pretty text-[19px] leading-relaxed text-mk-body">
              Type a keyword. GEObrief searches the live web for how ChatGPT, Perplexity and
              AI Overviews answer it right now, then hands back a brief built to be the
              source they quote.
            </p>
            <div className="mb-4 flex flex-wrap items-center gap-3.5">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2.5 rounded-[11px] bg-mk-accent px-[26px] py-4 text-base font-semibold text-mk-accent-ink transition-all hover:-translate-y-0.5 hover:bg-mk-accent-hover hover:shadow-[0_14px_32px_-14px_rgba(16,185,129,0.55)]"
              >
                Generate your first brief
                <ArrowRight size={18} />
              </Link>
              <a
                href="#anatomy"
                className="inline-flex items-center gap-2.5 rounded-[11px] border border-mk-purple/45 bg-mk-purple/10 px-6 py-[15px] text-base font-semibold text-mk-purple transition-all hover:-translate-y-0.5 hover:border-mk-purple/75 hover:bg-mk-purple/20"
              >
                See what&apos;s in a brief
              </a>
            </div>
            <p className="mb-14 text-[13.5px] text-mk-faint">
              3 free briefs every month · No credit card · Lifetime access $59 one-time
            </p>
          </div>

          {/* Decorative keyword field: illustrative, not a live form */}
          <div className="mx-auto -mb-1.5 max-w-[760px]">
            <div className="flex items-center gap-3 rounded-[14px] border border-mk-border-strong bg-mk-surface px-4 py-3.5">
              <Search size={18} className="flex-none text-mk-faint" />
              <span className="flex-1 text-base text-mk-ink">best crm for small business</span>
              <span className="rounded-[9px] bg-mk-accent px-4 py-[9px] text-[13.5px] font-semibold text-mk-accent-ink">
                Generate brief
              </span>
            </div>
            <p className="mt-3 text-center text-[12.5px] text-mk-faint">
              One field. That is the entire setup.
            </p>
          </div>
        </div>

        <div data-reveal="rise" className="relative mx-auto mt-11 max-w-[1060px] px-2">
          <BriefMockup />
        </div>
      </section>

      {/* Anatomy */}
      <section id="anatomy" className="bg-mk-band px-6 py-24">
        <div data-reveal="fade" className="mx-auto max-w-6xl">
          <p className="mb-4 text-[12.5px] font-medium uppercase tracking-[0.1em] text-mk-faint">
            The brief anatomy
          </p>
          <h2 className="mb-5 max-w-[800px] text-balance font-serif text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-mk-ink sm:text-[52px]">
            Eight parts. Every one of them is a reason to be quoted.
          </h2>
          <p className="mb-12 max-w-[620px] text-pretty text-[17px] leading-relaxed text-mk-muted">
            A GEO brief is not a keyword list. It is the shape of an answer an engine can
            lift whole.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ANATOMY_ITEMS.map((item) => {
              const Icon = item.icon;
              const accent = ACCENT[item.color];
              return (
                <div
                  key={item.n}
                  data-reveal
                  className={`rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
                    item.highlighted
                      ? `${accent.border} ${accent.bg}`
                      : "border-mk-border bg-mk-surface hover:border-mk-border-strong hover:bg-mk-surface-hover"
                  }`}
                >
                  <div className="mb-[22px] flex items-baseline justify-between">
                    <span
                      className={`font-serif text-[44px] font-bold leading-none ${accent.text}`}
                    >
                      {item.n}
                    </span>
                    <Icon
                      size={20}
                      className={item.highlighted ? accent.text : "text-mk-border-strong"}
                    />
                  </div>
                  <h3 className="mb-2 text-[17px] font-semibold text-mk-ink">{item.title}</h3>
                  <p
                    className={`text-[14.5px] leading-relaxed ${
                      item.highlighted ? "text-mk-body" : "text-mk-muted"
                    }`}
                  >
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Example brief: light band, real app tokens */}
      <section className="bg-ui-paper px-6 py-24 text-ui-ink">
        <div data-reveal className="mx-auto max-w-[1080px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3.5 text-[12.5px] font-medium uppercase tracking-[0.1em] text-ui-faint">
                A real brief, start to finish
              </p>
              <h2 className="max-w-[660px] text-balance font-serif text-[32px] font-bold leading-[1.04] tracking-[-0.03em] text-ui-ink sm:text-[48px]">
                This is what one keyword gets you.
              </h2>
            </div>
            <div className="flex items-center gap-2.5 rounded-full border border-ui-border bg-ui-surface px-3.5 py-2">
              <Search size={15} className="text-ui-accent" />
              <span className="text-[13.5px] font-semibold text-ui-ink">
                best crm for small business
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-ui-border bg-ui-surface shadow-[0_1px_2px_rgba(42,41,40,0.04),0_30px_70px_-34px_rgba(42,41,40,0.28)]">
            <div className="flex flex-wrap items-center gap-2.5 border-b border-ui-border bg-ui-shell px-[18px] py-3.5">
              <span className="text-[13px] font-semibold text-ui-ink">
                best crm for small business
              </span>
              <span className="rounded-full bg-ui-soft px-[9px] py-[3px] text-[11px] font-semibold text-ui-accent">
                GEO score: High
              </span>
              <div className="ml-auto flex gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-[9px] border border-ui-border bg-ui-surface px-3.5 py-[7px] text-[12.5px] font-semibold text-ui-ink">
                  <Copy size={14} />
                  Copy Markdown
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[9px] border border-ui-border bg-ui-surface px-3.5 py-[7px] text-[12.5px] font-semibold text-ui-ink">
                  <Download size={14} />
                  Download PDF
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-9">
              <h3 className="mb-[18px] font-serif text-[26px] font-bold leading-[1.15] tracking-tight text-ui-ink sm:text-[34px]">
                Best CRM for Small Business: What to Choose and Why
              </h3>

              <h4 className="mb-3 font-serif text-xl font-semibold text-ui-ink">
                Quick Analysis
              </h4>
              <p className="mb-2 text-[15px] leading-[1.7] text-ui-body">
                <strong className="text-ui-ink">GEO Score:</strong> High
              </p>
              <p className="mb-[26px] text-[15px] leading-[1.7] text-ui-body">
                Current answers to this query are dominated by comparison round-ups that
                hedge. A brief that commits to a recommendation per team shape, with pricing
                stated plainly and a named author, is the shape engines prefer to quote.
              </p>

              <h4 className="mb-3 mt-[26px] font-serif text-xl font-semibold text-ui-ink">
                Primary Answer (AI Snapshot)
              </h4>
              <blockquote className="mb-[26px] border-l-2 border-ui-accent pl-[18px] font-serif text-[17px] italic leading-[1.65] text-ui-quote">
                For most small businesses, the best CRM is the one that matches team size and
                sales motion: a lightweight pipeline tool for solo founders, a shared-inbox
                CRM for two-to-five-person sales teams, and a full platform once outbound runs
                multi-step sequences. Choose on how your team already sells, not on feature
                count.
              </blockquote>

              <h4 className="mb-3 mt-[26px] font-serif text-xl font-semibold text-ui-ink">
                Recommended Structure
              </h4>
              <ul className="mb-[26px] flex list-disc flex-col gap-2 pl-[22px] text-[15px] leading-[1.7] text-ui-body">
                <li>What makes a CRM right for a small business?</li>
                <li>How much should a small business expect to pay for a CRM?</li>
                <li>Which CRM fits a solo founder versus a small sales team?</li>
                <li>When is it worth moving off a spreadsheet?</li>
                <li>What does migration actually involve?</li>
              </ul>

              <div className="mb-[26px] grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-serif text-xl font-semibold text-ui-ink">
                    Key Questions
                  </h4>
                  <ul className="flex list-disc flex-col gap-2 pl-[22px] text-[15px] leading-[1.7] text-ui-body">
                    <li>Is a free CRM enough to start with?</li>
                    <li>How long does setup take?</li>
                    <li>What breaks when the team grows?</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 font-serif text-xl font-semibold text-ui-ink">
                    E-E-A-T Signals
                  </h4>
                  <ul className="flex list-disc flex-col gap-2 pl-[22px] text-[15px] leading-[1.7] text-ui-body">
                    <li>Named author with hands-on CRM implementation experience</li>
                    <li>Pricing quoted with the date it was checked</li>
                    <li>First-hand notes on migration effort</li>
                  </ul>
                </div>
              </div>

              <h4 className="mb-3 mt-[26px] font-serif text-xl font-semibold text-ui-ink">
                Schema Markup Recommendations
              </h4>
              <div className="mb-[26px] flex flex-wrap gap-2">
                {["FAQPage", "Article", "ItemList"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ui-border bg-ui-shell px-[13px] py-1.5 text-[13px] font-medium text-ui-body"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <hr className="my-8 border-ui-border" />

              <h4 className="mb-3 font-serif text-xl font-semibold text-ui-ink">
                Sources Currently Ranking For This Topic
              </h4>
              <p className="mb-4 text-[13.5px] text-ui-faint">
                Retrieved by live search while the brief was generated, with the snippet
                each result was matched on.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    title: "1. Small business CRM comparison (software review directory)",
                    body: "Round-up of CRM options segmented by company size, with user-submitted ratings and pricing tiers.",
                  },
                  {
                    title: "2. CRM buyer's guide (vendor blog)",
                    body: "Explains evaluation criteria and implementation steps; currently the most-quoted framing for this query.",
                  },
                  {
                    title: "3. Community thread (practitioners comparing tools)",
                    body: "First-hand accounts of switching costs; a recurring citation in AI answers on this topic.",
                  },
                ].map((source) => (
                  <div
                    key={source.title}
                    className="rounded-[10px] border border-ui-border bg-ui-shell px-4 py-3.5"
                  >
                    <p className="mb-1 text-[14.5px] font-semibold text-ui-ink">
                      {source.title}
                    </p>
                    <p className="text-[13px] text-ui-muted">{source.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-[18px] text-[12.5px] text-ui-faint">
                Illustrative example. Your brief cites the exact URLs retrieved for your
                keyword at the moment you generate it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO vs SEO */}
      <section className="bg-mk-paper px-6 py-24">
        <div data-reveal="fade" className="mx-auto max-w-6xl">
          <p className="mb-4 text-[12.5px] font-medium uppercase tracking-[0.1em] text-mk-faint">
            GEO vs SEO
          </p>
          <h2 className="mb-5 max-w-[860px] text-balance font-serif text-[34px] font-bold leading-[1.0] tracking-[-0.035em] text-mk-ink sm:text-[58px]">
            Ranking puts you on a list. Being cited puts you in the answer.
          </h2>
          <p className="mb-[54px] max-w-[640px] text-pretty text-[17px] leading-relaxed text-mk-muted">
            The mechanics changed. An engine reads a handful of sources and writes one
            answer, so the job is no longer to be findable. It is to be the passage worth
            quoting.
          </p>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div
              data-reveal
              className="rounded-[18px] border border-mk-border bg-mk-band p-8 transition-colors hover:border-mk-border-strong"
            >
              <p className="mb-6 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-mk-faint">
                Written for a results page
              </p>
              <ul className="flex flex-col gap-[18px]">
                {COMPARISON.seo.map((line) => (
                  <li key={line} className="flex items-start gap-3.5">
                    <X size={17} className="mt-[3px] flex-none text-mk-faint" />
                    <span className="text-base leading-snug text-mk-muted">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[18px] border border-mk-accent/30 bg-gradient-to-b from-mk-accent/10 to-mk-accent/[0.03] p-8">
              <p className="mb-6 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-mk-accent">
                Written to be quoted
              </p>
              <ul className="flex flex-col gap-[18px]">
                {COMPARISON.geo.map((line) => (
                  <li key={line} className="flex items-start gap-3.5">
                    <Check size={17} className="mt-[3px] flex-none text-mk-accent" />
                    <span className="text-base leading-snug text-mk-ink">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-mk-band px-6 py-24">
        <div data-reveal="fade" className="mx-auto max-w-6xl">
          <p className="mb-4 text-[12.5px] font-medium uppercase tracking-[0.1em] text-mk-faint">
            How it works
          </p>
          <h2 className="mb-16 max-w-[720px] text-balance font-serif text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-mk-ink sm:text-[52px]">
            Three steps, and one of them is typing.
          </h2>

          <div className="flex flex-col">
            {/* Step 1 */}
            <div
              data-reveal
              className="grid grid-cols-1 items-center gap-9 border-t border-mk-border pt-10 lg:grid-cols-2"
            >
              <div>
                <span className="font-serif text-[56px] font-bold leading-none text-mk-amber sm:text-[68px]">
                  01
                </span>
                <h3 className="mb-3 mt-3.5 text-2xl font-semibold tracking-tight text-mk-ink sm:text-[26px]">
                  Type a keyword
                </h3>
                <p className="max-w-[420px] text-[16.5px] leading-relaxed text-mk-muted">
                  No site to connect, no Search Console, no project to configure. One
                  field, optionally a URL and a niche for context.
                </p>
              </div>
              <div className="rounded-2xl border border-mk-amber/30 bg-mk-paper p-[22px]">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-mk-amber">
                  Target keyword
                </p>
                <div className="rounded-[10px] border border-mk-border-strong bg-mk-surface px-[15px] py-3.5 text-[15px] text-mk-ink">
                  best crm for small business
                  <span className="text-mk-amber">|</span>
                </div>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-mk-border px-3 py-1.5 text-[12.5px] text-mk-muted">
                    notion vs asana
                  </span>
                  <span className="rounded-full border border-mk-border px-3 py-1.5 text-[12.5px] text-mk-muted">
                    how to reduce churn
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div
              data-reveal
              className="grid grid-cols-1 items-center gap-9 border-t border-mk-border pt-10 lg:grid-cols-2"
            >
              <div>
                <span className="font-serif text-[56px] font-bold leading-none text-mk-purple sm:text-[68px]">
                  02
                </span>
                <h3 className="mb-3 mt-3.5 text-2xl font-semibold tracking-tight text-mk-ink sm:text-[26px]">
                  We search the live web
                </h3>
                <p className="max-w-[420px] text-[16.5px] leading-relaxed text-mk-muted">
                  Search runs first and retrieves real sources, then a second step
                  writes the brief from them, so the sources in it are ones that
                  were actually found, not ones a model remembered. Takes 20–45
                  seconds.
                </p>
              </div>
              <div className="rounded-2xl border border-mk-purple/30 bg-mk-paper p-[22px]">
                <p className="mb-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-mk-purple">
                  Searches executed
                </p>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5 rounded-[10px] bg-mk-surface px-3.5 py-[11px]">
                    <Search size={15} className="flex-none text-mk-purple" />
                    <span className="text-sm text-mk-body">
                      best crm for small business 2026
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-[10px] bg-mk-surface px-3.5 py-[11px]">
                    <Search size={15} className="flex-none text-mk-purple" />
                    <span className="text-sm text-mk-body">
                      small business crm pricing comparison
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-[10px] bg-mk-surface px-3.5 py-[11px]">
                    <LinkIcon size={15} className="flex-none text-mk-accent" />
                    <span className="text-sm text-mk-body">5 sources retrieved and ranked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div
              data-reveal
              className="grid grid-cols-1 items-center gap-9 border-y border-mk-border py-10 lg:grid-cols-2"
            >
              <div>
                <span className="font-serif text-[56px] font-bold leading-none text-mk-accent sm:text-[68px]">
                  03
                </span>
                <h3 className="mb-3 mt-3.5 text-2xl font-semibold tracking-tight text-mk-ink sm:text-[26px]">
                  Write from the brief
                </h3>
                <p className="max-w-[420px] text-[16.5px] leading-relaxed text-mk-muted">
                  Copy it as Markdown, export it as PDF, hand it to a writer. Every brief
                  stays in your history.
                </p>
              </div>
              <div className="rounded-2xl border border-mk-accent/30 bg-ui-paper p-5">
                <p className="mb-3 font-serif text-[19px] font-bold tracking-tight text-ui-ink">
                  Best CRM for Small Business: What to Choose and Why
                </p>
                <div className="mb-3.5 flex flex-col gap-[7px]">
                  <span className="h-2 rounded-full bg-ui-border" />
                  <span className="h-2 rounded-full bg-ui-border" />
                  <span className="h-2 w-[62%] rounded-full bg-ui-border" />
                </div>
                <div className="flex gap-2">
                  <span className="rounded-lg bg-ui-accent px-3.5 py-[7px] text-[12.5px] font-semibold text-white">
                    Copy Markdown
                  </span>
                  <span className="rounded-lg border border-ui-border bg-ui-shell px-3.5 py-[7px] text-[12.5px] font-semibold text-ui-ink">
                    Download PDF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing: light band, real app tokens */}
      <section id="pricing" className="bg-ui-paper px-6 py-24 text-ui-ink">
        <div data-reveal className="mx-auto max-w-[1120px]">
          <div className="mb-12">
            <p className="mb-3.5 text-[12.5px] font-medium uppercase tracking-[0.1em] text-ui-faint">
              Pricing
            </p>
            <h2 className="mb-3.5 text-balance font-serif text-[32px] font-bold leading-[1.04] tracking-[-0.03em] sm:text-[48px]">
              Start free. Pay when it earns it.
            </h2>
            <p className="text-[17px] text-ui-muted">
              Three briefs a month, free, with no card. Everything below that is
              optional.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
            {/* Free */}
            <div className="rounded-[18px] border border-ui-border bg-ui-surface p-[30px] transition-all hover:-translate-y-1.5 hover:border-ui-ring hover:shadow-[0_20px_44px_-28px_rgba(42,41,40,0.30)]">
              <h3 className="mb-1.5 font-serif text-2xl font-semibold">Free</h3>
              <p className="mb-[22px] text-[14.5px] text-ui-muted">Get started instantly</p>
              <div className="mb-[26px]">
                <span className="font-serif text-[46px] font-bold tracking-tight">$0</span>
                <span className="text-sm text-ui-muted"> /month</span>
              </div>
              <ul className="mb-[26px] flex flex-col gap-[11px]">
                {PLAN_FEATURES.free.map(([label, included]) => (
                  <PlanFeature key={label} label={label} included={included} />
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="block rounded-[10px] border border-ui-border bg-ui-shell py-3.5 text-center text-[15px] font-semibold text-ui-ink transition-colors hover:border-ui-ring hover:bg-ui-wash"
              >
                Get started free
              </Link>
            </div>

            {/* Pro: highlighted */}
            <div className="relative rounded-[18px] border-2 border-ui-accent bg-ui-surface p-[30px] shadow-[0_1px_2px_rgba(42,41,40,0.04),0_24px_56px_-28px_rgba(5,150,105,0.34)] transition-all hover:-translate-y-2">
              <span className="absolute right-[18px] top-[18px] rounded-full bg-ui-highlight px-[11px] py-1 text-[11px] font-bold tracking-wide text-white">
                POPULAR
              </span>
              <h3 className="mb-1.5 font-serif text-2xl font-semibold">Pro</h3>
              <p className="mb-[22px] text-[14.5px] text-ui-muted">
                For people publishing weekly
              </p>
              <div className="mb-[26px]">
                <span className="font-serif text-[46px] font-bold tracking-tight text-ui-accent">
                  $15
                </span>
                <span className="text-sm text-ui-muted"> /month</span>
              </div>
              <ul className="mb-[26px] flex flex-col gap-[11px]">
                {PLAN_FEATURES.paid.map(([label, included]) => (
                  <PlanFeature key={label} label={label} included={included} />
                ))}
              </ul>
              <Link
                href="/auth/signup?plan=pro"
                className="block rounded-[10px] bg-ui-accent py-3.5 text-center text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Lifetime */}
            <div className="rounded-[18px] border border-ui-border bg-ui-surface p-[30px] transition-all hover:-translate-y-1.5 hover:border-ui-ring hover:shadow-[0_20px_44px_-28px_rgba(42,41,40,0.30)]">
              <h3 className="mb-1.5 font-serif text-2xl font-semibold">Lifetime</h3>
              <p className="mb-[22px] text-[14.5px] text-ui-muted">
                Early adopter deal, pay once
              </p>
              <div className="mb-[26px]">
                <span className="font-serif text-[46px] font-bold tracking-tight">$59</span>
                <span className="text-sm text-ui-muted"> one-time</span>
              </div>
              <ul className="mb-[26px] flex flex-col gap-[11px]">
                <PlanFeature label="Everything in Pro" included />
                <PlanFeature label="No recurring charge" included />
                <PlanFeature label="Never expires" included />
              </ul>
              <a
                href={GUMROAD_LIFETIME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-[10px] border border-ui-border bg-ui-shell py-3.5 text-center text-[15px] font-semibold text-ui-ink transition-colors hover:border-ui-ring hover:bg-ui-wash"
              >
                Get the lifetime deal
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-mk-paper px-6 py-24">
        <div data-reveal className="mx-auto max-w-[860px]">
          <h2 className="mb-11 text-balance font-serif text-[32px] font-bold leading-[1.04] tracking-[-0.03em] text-mk-ink sm:text-[48px]">
            Questions worth answering.
          </h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="geobrief-faq rounded-[14px] border border-mk-border bg-mk-band p-[22px] px-6 transition-colors hover:border-mk-border-strong open:border-mk-border-strong [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-5 text-[17px] font-semibold text-mk-ink">
                  {faq.q}
                  <span className="geobrief-faq-plus flex-none text-[22px] font-normal text-mk-accent transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3.5 text-[15.5px] leading-relaxed text-mk-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-mk-band px-6 py-28 text-center">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_100%,rgba(16,185,129,0.16),transparent_70%)]"
          aria-hidden="true"
        />
        <div data-reveal className="relative mx-auto max-w-[820px]">
          <h2 className="mb-[22px] text-balance font-serif text-[36px] font-bold leading-[1.0] tracking-[-0.035em] text-mk-ink sm:text-[64px]">
            One keyword away from your first brief.
          </h2>
          <p className="mb-[34px] text-lg leading-relaxed text-mk-muted">
            Three free every month. No card, no setup, no connecting anything.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2.5 rounded-[11px] bg-mk-accent px-[30px] py-[17px] text-[17px] font-semibold text-mk-accent-ink transition-all hover:-translate-y-0.5 hover:bg-mk-accent-hover hover:shadow-[0_16px_38px_-14px_rgba(16,185,129,0.6)]"
          >
            Generate your first brief
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <LandingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
    </main>
  );
}
