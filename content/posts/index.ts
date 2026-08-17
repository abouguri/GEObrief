import type { Post } from '../types';
import { post as geoVsSeo } from './geo-vs-seo-2026';
import { post as getCited } from './get-cited-by-chatgpt-and-perplexity';
import { post as briefTemplate } from './geo-content-brief-template';
import { post as trafficDropping } from './why-blog-traffic-is-dropping';
import { post as eeat } from './eeat-2026-what-ai-engines-look-for';

/** All posts, newest first. Add new posts here to publish them. */
export const posts: Post[] = [
  eeat,
  trafficDropping,
  briefTemplate,
  getCited,
  geoVsSeo,
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Up to `limit` other posts, for the "keep reading" block. */
export function getRelatedPosts(slug: string, limit = 2): Post[] {
  return posts.filter((post) => post.slug !== slug).slice(0, limit);
}

export type { Post };
