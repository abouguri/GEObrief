import Link from 'next/link';

/**
 * Header for the public pages. Section anchors are absolute (`/#pricing`) so
 * the same nav works from the landing page and from any blog post.
 */
export default function MarketingNav() {
  return (
    <nav className="fixed top-0 w-full bg-brand-dark/80 backdrop-blur-sm border-b border-white/10 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold text-brand-accent">
          GEObrief.ai
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/#features"
            className="hidden sm:inline text-white/70 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="hidden sm:inline text-white/70 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link href="/blog" className="text-white/70 hover:text-white transition-colors">
            Blog
          </Link>
          <Link
            href="/auth/login"
            className="text-white/70 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-brand-accent text-brand-dark px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
