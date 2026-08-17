import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

/**
 * AI assistant crawlers are intentionally allowed: this product's whole thesis
 * is that being retrievable by answer engines is worth more than blocking them.
 * Only the authenticated app and API surfaces are disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/auth/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
