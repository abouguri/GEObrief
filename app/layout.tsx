import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEObrief.ai - AI-Optimized Content Briefs",
  description:
    "Stop writing for Google. Start writing for AI. Generate GEO-optimized content briefs designed to get cited by ChatGPT, Perplexity, and AI Overviews.",
  keywords: [
    "GEO",
    "SEO",
    "AI search optimization",
    "content brief",
    "ChatGPT",
    "Perplexity",
    "generative engine optimization",
  ],
  openGraph: {
    title: "GEObrief.ai - AI-Optimized Content Briefs",
    description:
      "Stop writing for Google. Start writing for AI. Generate GEO-optimized content briefs designed to get cited by ChatGPT, Perplexity, and AI Overviews.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://geobrief.ai",
    siteName: "GEObrief.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "GEObrief.ai - AI-Optimized Content Briefs",
    description:
      "Stop writing for Google. Start writing for AI. Generate GEO-optimized content briefs.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
