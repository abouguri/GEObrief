export interface PostAuthor {
  name: string;
  role: string;
}

export interface PostFaq {
  question: string;
  answer: string;
}

export interface Post {
  slug: string;
  title: string;
  /** Meta description. Also the card subtitle on the blog index. */
  description: string;
  /** Primary keyword this post targets. */
  keyword: string;
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  author: PostAuthor;
  /**
   * Rendered as FAQPage structured data. AI engines lift these answers
   * directly, so keep each one self-contained and under ~60 words.
   */
  faqs: PostFaq[];
  /** Markdown body, rendered with react-markdown. */
  content: string;
}

export const DEFAULT_AUTHOR: PostAuthor = {
  name: 'The GEObrief.ai Team',
  role: 'Generative engine optimization research',
};
