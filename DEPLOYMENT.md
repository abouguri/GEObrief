# Deploying GEObrief.ai

Start-to-finish deployment on Vercel + Supabase + Gumroad. Budget about an hour for a first run.

---

## 1. Supabase

### Create the project

1. Create a project at [supabase.com](https://supabase.com) (the free tier is fine to launch).
2. Pick a region close to your users — it sets database latency for every request.
3. Save the database password somewhere safe.

### Run the migrations

**SQL Editor → New query**, then run each file in order and confirm success before the next:

1. `migrations/001_initial_schema.sql`
2. `migrations/002_user_provisioning.sql`
3. `migrations/003_gumroad_billing.sql`

Verify:

```sql
-- Both tables exist with RLS on
select tablename, rowsecurity from pg_tables
where schemaname = 'public' and tablename in ('users','briefs');

-- The provisioning trigger is attached
select tgname from pg_trigger where tgname = 'on_auth_user_created';
```

Both queries must return rows. If the trigger is missing, signups will succeed at the auth layer and then fail every usage lookup.

### Collect the keys

**Project Settings → API:**

| Value | Env var |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` key | `SUPABASE_SERVICE_ROLE_KEY` |

The `service_role` key bypasses RLS entirely. It must only ever be set as a server-side variable — never with a `NEXT_PUBLIC_` prefix, never in client code.

### Configure auth URLs

**Authentication → URL Configuration:**

- **Site URL:** `https://yourdomain.com`
- **Redirect URLs:** add both
  - `https://yourdomain.com/auth/callback`
  - `http://localhost:3000/auth/callback`

### Google OAuth (optional)

1. In [Google Cloud Console](https://console.cloud.google.com), create an OAuth 2.0 Client ID (type: Web application).
2. Authorized redirect URI — use the value Supabase shows you, which looks like:
   `https://<project-ref>.supabase.co/auth/v1/callback`
3. In Supabase, **Authentication → Providers → Google**: enable it and paste the client ID and secret.

Skip this and email/password still works; the Google button will just error.

### Email confirmation

By default Supabase requires email confirmation. For launch, either:

- **Keep it on** — users must click the emailed link, which lands on `/auth/callback`. Set up custom SMTP under **Project Settings → Auth → SMTP** before real traffic; the built-in sender is heavily rate-limited.
- **Turn it off** for a frictionless funnel (**Authentication → Providers → Email → Confirm email**), accepting that signups can use addresses they do not own.

---

## 2. Grok API

1. Get a key at [console.x.ai](https://console.x.ai) → `GROK_API_KEY`.
2. Add billing credit. Each brief is one `grok-3` call with web search.
3. Set a spend limit if the console offers one — the usage gate protects your quota per user, but nothing caps total spend across many signups.

---

## 3. Gumroad

1. Create two products:
   - **GEObrief Pro** — $15, recurring monthly
   - **GEObrief Lifetime** — $59, one-time
2. Copy each checkout URL into `NEXT_PUBLIC_GUMROAD_PRO_URL` and `NEXT_PUBLIC_GUMROAD_LIFETIME_URL`.
3. Note the lifetime product's permalink (the part after `/l/`) → `GUMROAD_LIFETIME_PERMALINK`.
4. Generate the webhook secret:

   ```bash
   openssl rand -hex 32
   ```

   → `GUMROAD_SECRET_KEY`

5. **Settings → Advanced → Ping**, set the ping URL to:

   ```
   https://yourdomain.com/api/webhooks/gumroad?secret=<GUMROAD_SECRET_KEY>
   ```

6. Set up payouts (PayPal works from Morocco).

Gumroad Ping is unsigned, so that URL *is* the credential. Do not paste it into issues, screenshots, or support threads. If it leaks, rotate `GUMROAD_SECRET_KEY` and update the ping URL.

---

## 4. Vercel

### Deploy

1. Push to GitHub.
2. **Add New → Project** at [vercel.com](https://vercel.com), import the repo.
3. Framework preset: Next.js. Leave build settings at their defaults.

### Environment variables

Add all of these under **Settings → Environment Variables** for Production (and Preview, if you use preview deploys):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GROK_API_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPPORT_EMAIL
GUMROAD_SECRET_KEY
NEXT_PUBLIC_GUMROAD_PRO_URL
NEXT_PUBLIC_GUMROAD_LIFETIME_URL
GUMROAD_LIFETIME_PERMALINK
GUMROAD_SELLER_ID          # optional
```

`NEXT_PUBLIC_APP_URL` must be your real production URL with **no trailing slash**. It drives canonical tags, the sitemap, and OAuth redirects — a wrong value here produces broken canonicals and failing logins.

`NEXT_PUBLIC_*` variables are inlined at build time, so changing one requires a redeploy, not just a restart.

### Custom domain

1. **Settings → Domains → Add** `geobrief.ai`.
2. Point DNS at Vercel as instructed.
3. Wait for the certificate, then update `NEXT_PUBLIC_APP_URL`, the Supabase Site URL, and the Gumroad ping URL to the final domain — and redeploy.

---

## 5. Post-deploy checklist

Work through this on the live site.

**Marketing**
- [ ] `/` renders; pricing shows Free / Pro $15 / Lifetime $59
- [ ] `/blog` lists 5 posts; each post opens
- [ ] `/privacy` and `/terms` load; footer links all resolve
- [ ] `/sitemap.xml` lists your real domain, not `geobrief.ai`
- [ ] `/robots.txt` allows `/` and disallows `/app/`, `/auth/`, `/api/`
- [ ] Rich Results Test passes on the landing page and one blog post

**Auth**
- [ ] Email signup works; confirmation email arrives if confirmation is on
- [ ] A `public.users` row appears for the new account:
      `select id, email, plan, usage_count, usage_reset_date from public.users;`
- [ ] Google sign-in completes and lands on the dashboard
- [ ] Visiting `/app/dashboard` signed out redirects to login
- [ ] Sign out returns to `/`

**Core flow**
- [ ] Generating a brief returns rendered markdown
- [ ] `usage_count` incremented by exactly 1
- [ ] A row appeared in `briefs`
- [ ] Copy button copies markdown
- [ ] Download produces a readable multi-page PDF
- [ ] The brief appears in `/app/history` and reopens
- [ ] History keyword filter works

**Usage gate**
- [ ] Generate 3 briefs on a free account; the 4th returns the limit message
- [ ] The upgrade CTA appears at the limit
- [ ] Unauthenticated `POST /api/generate-brief` returns 401:

      ```bash
      curl -X POST https://yourdomain.com/api/generate-brief \
        -H 'Content-Type: application/json' \
        -d '{"keyword":"test"}'
      ```

      This must return 401 and must not consume Grok credit.

**Payments**
- [ ] `GET /api/webhooks/gumroad` returns `{"status":"ok"}`
- [ ] A wrong secret returns 401:

      ```bash
      curl -X POST 'https://yourdomain.com/api/webhooks/gumroad?secret=wrong' \
        -d 'email=test@example.com'
      ```

- [ ] Buy your own product with a real account's email; `plan` flips to `pro`/`annual`
- [ ] Dashboard and settings then show unlimited
- [ ] Refund the test purchase; `plan` returns to `free`

---

## 6. Operating notes

**Monthly usage reset** happens lazily: the first brief attempt after `usage_reset_date` passes resets the counter. There is no cron job, so an inactive user's row simply stays stale until they return — which is harmless.

**Unmatched purchases.** If someone buys with a different email than their account, the webhook logs a warning and returns 200 (so Gumroad stops retrying) without changing any plan. Watch Vercel logs for `Gumroad ping for unknown account` after launch and fix those by hand:

```sql
update public.users set plan = 'pro', plan_updated_at = now()
where email = 'buyer@example.com';
```

**Cost control.** Every free signup can consume 3 Grok calls. If signups spike, watch x.ai spend before celebrating. `FREE_BRIEF_LIMIT` in `lib/config.ts` is the single source of truth — both the UI copy and the server-side gate read it, so changing it there is enough.

**Logs.** Vercel → Deployments → Functions shows API route logs. Grok and Supabase failures are logged with context there.

---

## 7. Before you promote it

- [ ] Replace the blog byline with a real author and a `sameAs` profile link (`content/types.ts`) — the posts argue for exactly this, so shipping anonymous content undercuts them
- [ ] Have a lawyer or a competent template review `/privacy` and `/terms` for your jurisdiction; they are written to be accurate about this app's data flows, not to be legal advice
- [ ] Set up custom SMTP if email confirmation is on
- [ ] Add analytics (Vercel Analytics is a one-click start)
- [ ] Run your own product on your own keywords and publish the resulting briefs — it is the cheapest proof the tool works
