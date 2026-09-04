import Link from 'next/link';
import { posts } from '@/content/posts';
import { SUPPORT_EMAIL } from '@/lib/config';
import BrandLogo from '@/components/BrandLogo';

/** Footer for the public pages. Every link here points at a page that exists. */
export default function MarketingFooter() {
  const featured = posts.slice(0, 3);

  return (
    <footer className="border-t border-ui-border bg-ui-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <BrandLogo className="mb-5" />
            <h4 className="mb-4 font-semibold text-ui-ink">Product</h4>
            <ul className="space-y-2 text-ui-muted text-sm">
              <li>
                <Link href="/#anatomy" className="hover:text-ui-ink transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-ui-ink transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-ui-ink transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-ui-ink transition-colors">
                  Get Started Free
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="mb-4 font-semibold text-ui-ink">GEO Guides</h4>
            <ul className="space-y-2 text-ui-muted text-sm">
              {featured.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-ui-ink transition-colors"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="hover:text-ui-ink transition-colors">
                  All articles →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-ui-ink">Company</h4>
            <ul className="space-y-2 text-ui-muted text-sm">
              <li>
                <Link href="/privacy" className="hover:text-ui-ink transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-ui-ink transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="hover:text-ui-ink transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ui-border pt-8 text-center text-ui-faint text-sm">
          <p>
            © {new Date().getFullYear()} GEObrief.ai. Built by content strategists for
            content strategists.
          </p>
        </div>
      </div>
    </footer>
  );
}
