import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  theme?: 'light' | 'dark';
  compact?: boolean;
  className?: string;
};

/** The primary GEObrief lockup, rebuilt as crisp, scalable brand geometry. */
export default function BrandLogo({
  href = '/',
  theme = 'light',
  compact = false,
  className = '',
}: BrandLogoProps) {
  const ink = theme === 'dark' ? '#F4F6F4' : '#171817';
  const content = (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="GEObrief"
    >
      <svg viewBox="0 0 48 48" className="h-9 w-9 shrink-0" aria-hidden="true">
        <path fill={ink} d="M9 5h30v12H27v4H9z" />
        <path fill="#059669" d="M3 19h42v11H3z" />
        <path fill={ink} d="M9 32h18v4h12v8H9z" />
      </svg>
      {!compact && (
        <span className="whitespace-nowrap text-[21px] leading-none tracking-[-0.055em]" style={{ color: ink }}>
          <strong className="font-extrabold">GEO</strong><span className="font-normal">brief</span>
        </span>
      )}
    </span>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
