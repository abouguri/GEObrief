import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import MarketingNav from '@/components/MarketingNav';
import MarketingFooter from '@/components/MarketingFooter';
import { posts } from '@/content/posts';
import { SITE_URL } from '@/lib/config';

const TITLE = 'GEO & AI Search Guides';
const DESCRIPTION =
  'Practical guides to generative engine optimization: how AI engines choose sources, how to get cited, and how to adapt content strategy for AI search.';

export const metadata: Metadata = {
  title: `${TITLE} | GEObrief.ai`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}/blog`,
  },
};

function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogIndex() {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog`,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: { '@type': 'Organization', name: post.author.name },
    })),
  };

  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <MarketingNav />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{TITLE}</h1>
        <p className="text-white/60 text-lg">{DESCRIPTION}</p>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block p-6 rounded-lg bg-white/5 border border-white/10 hover:border-brand-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span>•</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-brand-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-white/60 mb-4">{post.description}</p>
                <span className="text-brand-accent text-sm font-semibold inline-flex items-center gap-1">
                  Read guide <ArrowRight size={14} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-8 rounded-lg bg-brand-accent/10 border border-brand-accent/30 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Stop researching. Start with a brief.
          </h2>
          <p className="text-white/60 mb-6">
            GEObrief.ai analyses how AI engines answer your keyword right now, then hands
            you the brief. Three free every month.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-brand-accent text-brand-dark px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            Generate a free brief <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <MarketingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </main>
  );
}
