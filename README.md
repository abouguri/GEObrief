# GEObrief.ai

## About
Stop writing for Google. Start writing for AI.

GEObrief.ai helps SEO freelancers, agencies, and content creators generate AI-optimized content briefs designed to get cited by ChatGPT, Perplexity, and Google AI Overviews.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Grok API key from x.ai

### Installation

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Edit .env.local with your credentials
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
# GROK_API_KEY=your_grok_api_key
# GUMROAD_SECRET_KEY=your_gumroad_secret

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- **Frontend:** Next.js 14 + React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth + Google OAuth
- **AI:** Grok 3 API (web_search enabled)
- **Payments:** Gumroad
- **PDF Export:** jsPDF + html2canvas

## Project Structure

```
/app
  /api              - Next.js API routes
  /auth             - Authentication pages
  /blog             - Blog posts (MDX)
  /app              - Protected routes (dashboard, history, settings)
  layout.tsx        - Root layout
  page.tsx          - Landing page
/components         - Reusable components
/lib                - Utility functions
/public             - Static assets
/styles             - Global CSS
```

## Environment Variables

See `.env.example` for all required variables.

**Key variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key
- `GROK_API_KEY` - X.AI API key
- `GUMROAD_SECRET_KEY` - Gumroad webhook secret

## Documentation

Full project brief available in [AGENTS.md](./AGENTS.md)

## Building

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Deployment

This app is optimized for Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## License

Proprietary - GEObrief.ai (2026)
