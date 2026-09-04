import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  theme?: 'light' | 'dark';
  compact?: boolean;
  className?: string;
};

/** Official GeoBrief lockup. Keep this geometry synchronized with app/icon.svg. */
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
      <svg viewBox="0 0 430 425" className="h-9 w-[37px] shrink-0" aria-hidden="true">
        <path fill={ink} d="M118 0H428V106L306 104V141H118Z" />
        <path fill="#059669" d="M0 155H430V274H0Z" />
        <path fill={ink} d="M118 284H306V322L428 318V425H118Z" />
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
