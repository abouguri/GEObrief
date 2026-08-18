import Link from 'next/link';

/**
 * Header for the public pages. Section anchors are absolute (`/#pricing`) so
 * the same nav works from the landing page and from any blog post.
 */
export default function MarketingNav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-ui-border bg-ui-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-ui-ink">
          GEObrief<span className="text-ui-accent">.ai</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/#anatomy"
            className="hidden text-[14px] text-ui-muted transition-colors hover:text-ui-ink sm:inline"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="hidden text-[14px] text-ui-muted transition-colors hover:text-ui-ink sm:inline"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="text-[14px] text-ui-muted transition-colors hover:text-ui-ink"
          >
            Blog
          </Link>
          <Link
            href="/auth/login"
            className="text-[14px] text-ui-muted transition-colors hover:text-ui-ink"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="whitespace-nowrap rounded-lg bg-ui-accent px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
