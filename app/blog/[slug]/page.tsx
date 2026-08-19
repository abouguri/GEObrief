import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import MarketingNav from '@/components/MarketingNav';
import MarketingFooter from '@/components/MarketingFooter';
import { getPostBySlug, getRelatedPosts, posts } from '@/content/posts';
import { SITE_NAME, SITE_URL } from '@/lib/config';

interface PageProps {
  params: { slug: string };
}

/** Every post is known at build time, so the whole blog prerenders. */
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return { title: 'Post not found | GEObrief.ai' };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | GEObrief.ai`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPost({ params }: PageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const related = getRelatedPosts(post.slug);

  // Article + FAQPage + breadcrumbs. The FAQ entries below are also rendered
  // in the visible page body, which is a requirement for FAQPage markup.
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: {
        '@type': 'Organization',
        name: post.author.name,
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      keywords: post.keywords.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-ui-paper text-ui-ink">
      <MarketingNav />

      <article className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-ui-muted hover:text-ui-ink transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          All guides
        </Link>

        <header className="mb-10">
          <h1 className="font-serif text-3xl sm:text-[42px] font-bold leading-[1.15] tracking-tight mb-5">
            {post.title}
          </h1>
          <p className="text-lg text-ui-muted mb-6">{post.description}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ui-faint pb-6 border-b border-ui-border">
            <span className="text-ui-muted">{post.author.name}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              Published {formatDate(post.publishedAt)}
            </time>
            {post.updatedAt && (
              <>
                <span>•</span>
                <time dateTime={post.updatedAt}>Updated {formatDate(post.updatedAt)}</time>
              </>
            )}
            <span>•</span>
            <span>{post.readingMinutes} min read</span>
          </div>
        </header>

        <div className="prose max-w-none">
          <ReactMarkdown
            components={{
              h2: (props) => (
                <h2
                  className="font-serif text-2xl font-bold text-ui-ink mt-12 mb-4 scroll-mt-24"
                  {...props}
                />
              ),
              h3: (props) => (
                <h3 className="font-serif text-xl font-semibold text-ui-ink mt-8 mb-3" {...props} />
              ),
              p: (props) => <p className="text-ui-body mb-5 leading-relaxed" {...props} />,
              ul: (props) => (
                <ul className="list-disc pl-6 space-y-2 mb-5 text-ui-body" {...props} />
              ),
              ol: (props) => (
                <ol className="list-decimal pl-6 space-y-2 mb-5 text-ui-body" {...props} />
              ),
              li: (props) => <li className="leading-relaxed" {...props} />,
              strong: (props) => <strong className="text-ui-ink font-semibold" {...props} />,
              blockquote: (props) => (
                <blockquote
                  className="pl-5 border-l-2 border-ui-ring text-ui-body my-6 [&>p]:mb-2"
                  {...props}
                />
              ),
              code: (props) => (
                <code
                  className="px-1.5 py-0.5 rounded bg-ui-shell text-ui-accent text-[0.9em] font-mono"
                  {...props}
                />
              ),
              pre: (props) => (
                <pre
                  className="p-5 rounded-lg bg-ui-shell border border-ui-border overflow-x-auto mb-6 text-sm [&>code]:bg-transparent [&>code]:text-ui-body [&>code]:p-0"
                  {...props}
                />
              ),
              a: (props) => <a className="text-ui-accent hover:underline" {...props} />,
              hr: () => <hr className="border-ui-border my-10" />,
              table: (props) => (
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm text-left border-collapse" {...props} />
                </div>
              ),
              th: (props) => (
                <th
                  className="border border-ui-border bg-ui-surface px-4 py-2 font-semibold"
                  {...props}
                />
              ),
              td: (props) => (
                <td className="border border-ui-border px-4 py-2 text-ui-body" {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Visible FAQ: must exist in the body for the FAQPage markup above */}
        <section className="mt-16 pt-10 border-t border-ui-border">
          <h2 className="font-serif text-2xl font-semibold mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {post.faqs.map((faq) => (
              <details
                key={faq.question}
                className="p-5 rounded-lg bg-ui-surface border border-ui-border"
              >
                <summary className="font-semibold cursor-pointer">{faq.question}</summary>
                <p className="text-ui-body mt-3 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 p-8 rounded-lg bg-ui-soft border border-ui-ring text-center">
          <h2 className="text-2xl font-bold mb-3">
            Get this analysis for your own keyword
          </h2>
          <p className="text-ui-muted mb-6">
            GEObrief.ai searches how AI engines answer your topic today and returns a
            complete GEO brief: answer block, headings, questions, schema, and the sources
            to beat.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-ui-accent text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            Generate 3 free briefs <ArrowRight size={18} />
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-ui-border">
            <h2 className="text-xl font-bold mb-5">Keep reading</h2>
            <ul className="space-y-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="block p-4 rounded-lg bg-ui-surface border border-ui-border hover:border-ui-ring transition-colors"
                  >
                    <p className="font-semibold mb-1">{item.title}</p>
                    <p className="text-sm text-ui-muted">{item.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <MarketingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
