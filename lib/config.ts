/** Shared site + plan constants. Keep marketing copy and links in one place. */

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://geobrief.ai";

export const SITE_NAME = "GEObrief.ai";
export const SITE_TAGLINE = "Stop writing for Google. Start writing for AI.";
export const SITE_DESCRIPTION =
  "Generate GEO-optimized content briefs designed to get cited by ChatGPT, Perplexity, and Google AI Overviews.";

/** Gumroad checkout for the Pro subscription ($15/mo). */
export const GUMROAD_PRO_URL =
  process.env.NEXT_PUBLIC_GUMROAD_PRO_URL || "https://gumroad.com/l/geobrief-pro";

/** Gumroad checkout for the one-time lifetime deal ($59). */
export const GUMROAD_LIFETIME_URL =
  process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL ||
  "https://gumroad.com/l/geobrief-lifetime";

/** Where Gumroad customers manage or cancel their purchase. */
export const GUMROAD_BILLING_URL = "https://app.gumroad.com/library";

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@geobrief.ai";

export const FREE_BRIEF_LIMIT = 3;

export const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  annual: "Lifetime",
};
