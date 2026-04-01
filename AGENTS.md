# GEObrief.ai — Complete Project Brief

**Last Updated:** April 1, 2026  
**Status:** In Development  
**Current Phase:** Initialization

---

## 🎯 Project Overview

**Product Name:** GEObrief.ai  
**Tagline:** "Stop writing for Google. Start writing for AI."

**Core Purpose:**  
Users enter a keyword or topic. Grok AI (with live web search) analyzes how that topic is currently being answered across AI engines (ChatGPT, Perplexity, Google AI Overviews) and generates a full GEO-optimized content brief — structured specifically to get cited and surfaced by AI answer engines, not just ranked on traditional Google SERPs.

**Target User:** SEO freelancers, content agencies, indie bloggers, and marketing teams who are losing traffic to AI Overviews and want to adapt their content strategy.

**Monetization Model:**  
- Freemium: 3 free briefs/month, then $15/mo for unlimited
- Lifetime deal: $59 for early adopters (sold via Gumroad)
- **Passive income goal:** $300–500/mo MRR within 3 months via SEO content + Reddit/Indie Hackers organic marketing

---

## 💳 Payments Setup

**Payment Processor:** Gumroad only (works from Morocco via PayPal payout)

**Usage Gate:**  
- Enforce the 3 free briefs/month limit at the API route level using Supabase (usage_count field on user record, reset monthly)
- Track usage in real-time, no client-side trust

**Upgrade Flow:**  
1. User hits 3 free briefs limit
2. "You've used your 3 free briefs" → CTA button
3. Gumroad checkout page
4. Webhook confirms payment
5. Supabase user.plan updated to "pro"

**NO:** Stripe, LemonSqueezy, or other processors

---

## 🤖 Grok API Usage

**Model:** grok-3 with web_search tool enabled  
**Base URL:** https://api.x.ai/v1 (OpenAI-compatible)  
**SDK:** Use OpenAI JS SDK, pointed at Grok base URL

**What Grok Does:**

1. **User Input:**
   - Target keyword (required)
   - Website URL or niche (optional)

2. **Grok Actions (with web search enabled):**
   - Find how AI engines (ChatGPT, Perplexity, AI Overviews) currently answer this topic
   - Identify sources they cite most
   - Discover questions users are asking around this topic
   - Analyze what content format dominates (list, guide, definition, comparison, etc.)

3. **Output: Structured GEO Content Brief with:**
   - Recommended title optimized for AI citation (clear, authoritative, direct)
   - Ideal content format & structure (AI engines favor specific formats)
   - Primary answer block (the "snippet" AI engines are likely to lift verbatim)
   - Supporting H2/H3 heading structure
   - Key questions to answer (sourced from AI engine PAA equivalents)
   - Schema markup recommendations (FAQ, HowTo, Article)
   - E-E-A-T signals to include (author bio, sources, proof blocks)
   - 3 currently cited sources to study and outperform
   - GEO score estimate: likelihood content gets cited by AI engines (Low/Med/High)

**Critical:** Web search must be enabled on EVERY Grok API call for accurate, current briefs.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + Tailwind CSS |
| Backend | Next.js API routes (serverless, Vercel) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Payments | Gumroad (webhook integration) |
| Hosting | Vercel (free tier) |
| AI | Grok 3 API (web_search enabled) |
| PDF Generation | jsPDF or react-pdf (lightweight) |
| Markdown Rendering | react-markdown |

---

## 🎨 Design & Branding

**Visual Style:** Sharp, editorial dark SaaS — data-forward, no fluff. Cross between Perplexity's UI and a premium SEO tool.

**Color Palette:**
- Background: Near-black #080C14
- Accent: Vivid cyan #00D8FF
- Text: White
- Aesthetic: Minimalist but premium, subtle data/grid aesthetics

**Logo/Icon Idea:**  
Stylized "G" or brain/signal icon suggesting "AI visibility" — like a radar ping or neural node

**Mood:** Authoritative, precise, built for professionals serious about the AI search shift

---

## 📄 Pages & Features to Build

### 1. Landing Page
- Hero: bold headline, subheadline explaining GEO vs SEO, keyword input demo CTA
- "Why GEO?" explainer section (AI search shift in numbers)
- Feature highlights: what's inside a GEO brief
- Pricing section: Free (3/mo) vs Pro ($15/mo) vs Lifetime ($59)
- FAQ (schema-marked for SEO/GEO)
- Footer with SEO-targeted anchor links
- **SEO/GEO Meta tags, OG tags, structured data (FAQPage, WebApplication schema)**

### 2. Auth Page
- Sign up / Login via Supabase Auth
- Email/password + Google OAuth

### 3. Dashboard (Main App)
- Keyword input + optional URL/niche field
- "Generate GEO Brief" button
- Brief output panel: rendered markdown, sections clearly labeled
- Copy to clipboard button
- Download as PDF button
- Usage counter ("2 of 3 free briefs used this month")
- Upgrade CTA banner when limit approached

### 4. History Page
- List of past briefs (title, keyword, date, link to reopen)
- Search/filter by keyword

### 5. Settings Page
- Account info
- Plan status
- Gumroad billing link
- Usage reset date
- Logout

### 6. Blog Section
- MDX template
- 5 starter post outlines (full content, not placeholder)
- SEO-optimized for long-tail GEO/SEO keywords
- Targeted for passive organic traffic

---

## 🔍 SEO & GEO Strategy (for Passive Income)

**Primary Keywords:**
- GEO content brief
- Generative engine optimization tool
- AI search optimization brief
- How to rank in AI overviews

**Secondary / Long-Tail:**
- What is GEO SEO
- How to get cited by ChatGPT
- Perplexity SEO strategy
- AI Overview optimization 2026

**Blog Starter Post Ideas (Full Outlines + Content):**

1. **"GEO vs SEO: What's the Difference in 2026?"**
   - Define traditional SEO vs GEO
   - Why AI is reshaping search
   - Practical differences in content strategy
   - Case studies / examples

2. **"How to Write Content That Gets Cited by ChatGPT and Perplexity"**
   - How AI engines choose sources
   - E-E-A-T signals that AI looks for
   - Content structure best practices
   - Examples of high-citation content

3. **"The GEO Content Brief Template (Free Download)"**
   - Explain the brief framework
   - Show a real example brief
   - Download link to template

4. **"Why Your Blog Traffic Is Dropping (And How AI Search Is To Blame)"**
   - Data on AI Overview impact on organic traffic
   - Statistics on user behavior shift
   - Urgency for content adaptation

5. **"E-E-A-T in 2026: What AI Engines Actually Look For"**
   - Deep dive into E-E-A-T
   - How AI evaluates expertise, experience, authoritativeness, trustworthiness
   - Practical implementation

**On All Pages:**
- Meta tags (title, description)
- OG tags (for social sharing)
- Structured data (FAQPage on landing, WebApplication schema, Article on blog)
- Core Web Vitals: High priority — no heavy libs on landing page
- robots.txt + sitemap.xml

**URL Structure:**
```
/ — landing page
/blog/[slug] — blog posts
/app/dashboard — main dashboard
/app/history — brief history
/app/settings — user settings
/auth/login — login page
/auth/signup — signup page
```

---

## 📦 Build Order (One Deliverable at a Time)

- [ ] **Phase 1:** Landing page — full Next.js component, all sections, SEO/GEO meta tags
- [ ] **Phase 2:** Grok API route — `/api/generate-brief` (with web search, usage gate, error handling)
- [ ] **Phase 3:** Dashboard UI — input form, rendered brief output, copy + PDF download
- [ ] **Phase 4:** Supabase schema — users, briefs, usage_count tables + Row Level Security
- [ ] **Phase 5:** Auth flow — Supabase email + Google OAuth
- [ ] **Phase 6:** Gumroad webhook route — `/api/webhooks/gumroad` → update user.plan
- [ ] **Phase 7:** History page
- [ ] **Phase 8:** Settings page
- [ ] **Phase 9:** Blog template + 5 post outlines (MDX)
- [ ] **Phase 10:** sitemap.xml + robots.txt
- [ ] **Phase 11:** .env.example + full Vercel deployment instructions

---

## ⚠️ Constraints & Notes

**Build Discipline:**
- Build ONE deliverable at a time — wait for explicit go-ahead before moving to next
- No placeholder content — every section must be real, copy-ready text

**Payment Stack:**
- Gumroad only — no Stripe, no LemonSqueezy
- Usage limits enforced at API route level — never trust client
- Gumroad webhook → Supabase user.plan update flow

**API & Performance:**
- Grok API base URL: https://api.x.ai/v1 — use OpenAI JS SDK, point at this base
- Web search MUST be enabled on every Grok API call (what makes briefs accurate)
- PDF generation: use lightweight lib (jsPDF or react-pdf) — no heavy dependencies
- Brief markdown output must render beautifully in dashboard (use react-markdown)
- No heavy libraries on landing page — prioritize Core Web Vitals

**Founder Context:**
- Morocco-based: Gumroad + PayPal payout is the payment stack
- No Stripe Atlas yet

---

## 📊 Success Metrics

- **Launch target:** Next 2 weeks
- **MRR target:** $300–500/mo within 3 months
- **Primary channel:** SEO content (blog) + Reddit + Indie Hackers organic mentions
- **Churn target:** Keep free-to-pro conversion at 15%+ of active users

---

## 🚀 Quick Reference

| Aspect | Details |
|--------|---------|
| **Live API Key** | Set in `.env.local` as `GROK_API_KEY` |
| **Grok Model** | grok-3 with web_search tool |
| **Free Plan** | 3 briefs/month |
| **Pro Plan** | Unlimited briefs, $15/mo or $59 lifetime |
| **Payment Webhook** | POST to `/api/webhooks/gumroad` |
| **Usage Check** | Query Supabase `users` table, check `usage_count` and `plan` |
| **Brand Colors** | #080C14 (bg), #00D8FF (accent), #FFFFFF (text) |
| **Primary CTA** | "Generate Your GEO Brief" |

---

## 📝 Notes for Future Phases

- Consider A/B testing landing page copy for conversion
- Plan Reddit community engagement strategy for launch
- Prepare Indie Hackers launch post
- Set up analytics (Vercel analytics, maybe PostHog for in-app)
- Plan email nurture sequence for free users approaching limit

---

**End of Brief**
