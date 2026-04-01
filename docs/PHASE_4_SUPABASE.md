# Phase 4: Supabase Schema & Database Setup

## Overview

This phase sets up the PostgreSQL database schema in Supabase with two main tables: `users` and `briefs`, complete with Row Level Security (RLS) policies.

## Database Schema

### `users` Table
Stores user account information, subscription plan, and usage tracking.

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key, auto-generated |
| `email` | VARCHAR(255) | User email, unique |
| `plan` | VARCHAR(50) | 'free' \| 'pro' \| 'annual' (default: 'free') |
| `usage_count` | INTEGER | Briefs generated this month (resets monthly) |
| `usage_reset_date` | DATE | When usage counter resets (1st of next month) |
| `created_at` | TIMESTAMP | Account creation time |
| `updated_at` | TIMESTAMP | Last modification time |

**Indexes:**
- `idx_users_plan` — Fast plan lookup for queries

**Triggers:**
- `users_updated_at_trigger` — Auto-updates `updated_at` on every modification

### `briefs` Table
Stores all generated GEO briefs with full JSON data and markdown version.

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to `users.id` (cascade delete) |
| `keyword` | VARCHAR(255) | The search keyword |
| `website_url` | VARCHAR(255) | Optional user website URL |
| `niche` | VARCHAR(255) | Optional industry/niche |
| `brief_data` | JSONB | Full structured brief from Grok API |
| `brief_markdown` | TEXT | Markdown-formatted brief for UI |
| `created_at` | TIMESTAMP | Brief creation time |
| `updated_at` | TIMESTAMP | Last modification |

**Indexes:**
- `idx_briefs_user_id` — Look up briefs by user
- `idx_briefs_created_at` — Sort briefs by recency
- `UNIQUE (user_id, keyword, created_at)` — Prevent exact duplicate briefs in same second

**Triggers:**
- `briefs_updated_at_trigger` — Auto-updates `updated_at` on modification

## Row Level Security (RLS)

All tables have RLS enabled with strict policies:

### Users Table Policies

1. **SELECT: Users can read own profile**
   - Users can only see their own record
   - Condition: `auth.uid() = id`

2. **UPDATE: Service role can update users**
   - Only Supabase service role (API routes, webhooks) can update
   - Used for plan upgrades via Gumroad webhook

3. **INSERT: Service role can insert users**
   - Only service role creates user records (via auth signup)

### Briefs Table Policies

1. **SELECT: Users can read own briefs**
   - Users only see briefs they created
   - Condition: `auth.uid() = user_id`

2. **INSERT: Users can insert own briefs**
   - Users can only create briefs attached to their ID

3. **UPDATE: Users can update own briefs**
   - Users can only modify their own briefs

4. **DELETE: Users can delete own briefs**
   - Users can only delete their own briefs

## How to Deploy

### Option A: Supabase Dashboard (Easiest)

1. Go to [Supabase Dashboard](https://app.supabase.com) → Select your project
2. Click **SQL Editor** (left sidebar)
3. Create new query
4. Copy the entire contents of `migrations/001_initial_schema.sql`
5. Paste and click **Run**

### Option B: Supabase CLI

```bash
# Install Supabase CLI (if not already done)
brew install supabase/tap/supabase

# Link to your project
supabase link --project-ref <your-project-ref>

# Run migration
supabase db push
```

## Integration with Existing Code

### Usage Tracking (`lib/usage.ts`)

The code already references these columns:
- `users.usage_count` — Tracks briefs generated
- `users.usage_reset_date` — Monthly reset boundary
- `users.plan` — Determines unlimited access (pro/annual) vs 3-brief limit (free)

### Brief Generation (`app/api/generate-brief/route.ts`)

After generating a brief, save it:

```typescript
await supabaseAdmin()
  .from("briefs")
  .insert({
    user_id: userId,
    keyword: keyword.trim(),
    website_url: url,
    niche: niche,
    brief_data: brief, // JSON from Grok
    brief_markdown: briefMarkdown, // Formatted markdown
  });
```

### Dashboard History (`app/app/history/page.tsx` — Phase 7)

Query recent briefs:

```typescript
const { data: briefs } = await supabase()
  .from("briefs")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false });
```

## Testing RLS Policies

After deployment, test policies:

1. **Authenticated User Test:**
   ```sql
   -- As authenticated user, should return their data
   SELECT * FROM users;
   SELECT * FROM briefs WHERE user_id = auth.uid();
   ```

2. **Cross-User Test:**
   ```sql
   -- Should NOT see other users' data
   SELECT * FROM briefs WHERE user_id != auth.uid();
   -- Expected: 0 rows
   ```

3. **Service Role Test (Webhook):**
   ```sql
   -- Service role should be able to update any user
   UPDATE users SET plan = 'pro' WHERE id = '<any-user-id>';
   -- Expected: Success
   ```

## Next Steps

1. Deploy this migration to your Supabase project
2. Verify tables exist: Supabase Dashboard → Tables
3. Test RLS policies (see "Testing RLS Policies" above)
4. Proceed to **Phase 5: Auth Flow**
   - Connect Supabase Auth to `users` table
   - Build login/signup pages
   - Sync auth user → users table row

## Important Notes

- **RLS is mandatory for production** — Prevents data leaks between users
- **Service role key is sensitive** — Only use in `.env.local`, never expose in frontend
- **Monthly reset logic** — `checkUsageLimit()` in `lib/usage.ts` handles the monthly boundary
- **JSONB storage** — `brief_data` stores full structured JSON for future analysis/export
- **Cascading deletes** — Deleting a user automatically deletes all their briefs

---

**Status:** ✅ Schema defined, ready to deploy
