import Link from 'next/link';
import { posts } from '@/content/posts';
import { SUPPORT_EMAIL } from '@/lib/config';

/** Footer for the public pages. Every link here points at a page that exists. */
export default function MarketingFooter() {
  const featured = posts.slice(0, 3);

  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-white transition-colors">
                  Get Started Free
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold mb-4">GEO Guides</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              {featured.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  All articles →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
          <p>
            © {new Date().getFullYear()} GEObrief.ai. Built by content strategists for
            content strategists.
          </p>
        </div>
      </div>
    </footer>
  );
}
