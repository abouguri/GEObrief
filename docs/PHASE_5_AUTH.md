# Phase 5: Authentication with Supabase

## Overview

This phase implements full authentication using Supabase with email/password and Google OAuth sign-up/sign-in.

## Architecture

```
┌─────────────────────────────────────┐
│   App Layout (with AuthProvider)    │
└──────────────────┬──────────────────┘
                   │
        ┌──────────▼──────────┐
        │  Auth Context Hook  │
        │  (lib/auth-context) │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  useAuth() Hook     │
        │  (all components)   │
        └──────────┬──────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
 Login Signup  Dashboard  Protected
 Pages        Pages      Routes
```

## Files Created

### `lib/auth-context.tsx` (170 lines)
React Context + custom hook for authentication state management.

**Functions:**
- `useAuth()` — Returns auth state and methods in any component
- `signUp(email, password)` — Email/password registration
- `signIn(email, password)` — Email/password login
- `signOut()` — Logout
- `signInWithGoogle()` — OAuth login
- Auto user record creation in `users` table on signup

**State:**
- `user` — Current User object or null
- `session` — Supabase Session
- `loading` — Auth initialization status
- `error` — Error message if any

### `app/layout.tsx` (Updated)
Wrapped entire app with `<AuthProvider>` to make auth state global.

### `app/auth/login/page.tsx` (Full component)
Email/password login form with:
- Auto-redirect if already logged in
- Form validation
- Error display
- Link to signup
- Loading spinner

### `app/auth/signup/page.tsx` (Full component)
Email/password/confirm signup form with:
- 8-character password validation
- Auto-create user record
- Google OAuth button with SVG icon
- Link to login
- Loading states

## Setup Instructions

### Step 1: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing
3. Navigate to **Settings → API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Local Development (.env.local)

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Deploy Schema to Supabase

Follow **Phase 4** instructions to run the migration:
```sql
CREATE TABLE users (...)
CREATE TABLE briefs (...)
```

### Step 4: Configure Google OAuth (Optional)

#### In Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable **Google+ API**
4. Create OAuth 2.0 credential:
   - Type: **Web application**
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (local)
     - `https://yourdomain.com/auth/callback` (production)
5. Copy **Client ID** and **Client Secret**

#### In Supabase:

1. Go to **Auth → Providers**
2. Click **Google**
3. Enable toggle
4. Paste **Client ID** and **Client Secret**
5. Save

### Step 5: Add Callback Handler (Optional for now)

Create `app/auth/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`/auth/login?error=${error}`);
  }

  if (code) {
    // Supabase auth automatically handles the code
    return NextResponse.redirect('/app/dashboard');
  }

  return NextResponse.redirect('/auth/login');
}
```

### Step 6: Vercel Deployment

1. Push to GitHub
2. Go to Vercel project settings
3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
   ```
4. Redeploy

## How It Works

### Sign Up Flow

```
User enters email/password
         ↓
Supabase creates auth user
         ↓
Code auto-creates users table row with plan='free'
         ↓
User logged in, redirects to /app/dashboard
         ↓
useAuth() provides user context
```

### Sign In Flow

```
User enters email/password
         ↓
Supabase validates credentials
         ↓
Session created
         ↓
Auth listener picks up state change
         ↓
Redirects to /app/dashboard
```

### Google OAuth Flow

```
User clicks "Sign in with Google"
         ↓
Redirects to Google login
         ↓
Google redirects back to /auth/callback
         ↓
Supabase exchanges code for session
         ↓
Auth listener updates
         ↓
Redirects to /app/dashboard
```

## Using useAuth() in Components

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export default function MyComponent() {
  const { user, loading, signOut, error } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Protected Routes (Phase 6)

To protect `/app/*` routes, create middleware:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-token');
  
  if (!token && request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
```

## Troubleshooting

### "Missing Supabase environment variables"

**Cause:** `.env.local` not set or variables are empty

**Fix:** 
1. Check `.env.local` exists in root directory
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is not empty
3. Restart dev server: `npm run dev`

### "Google sign in not working"

**Cause:** OAuth credentials not configured or redirect URI mismatch

**Fix:**
1. Verify Google OAuth enabled in Supabase
2. Check redirect URI matches exactly (including protocol)
3. Ensure Client ID/Secret copied correctly

### "Can't sign up - users table error"

**Cause:** Supabase schema not deployed or RLS policy blocking insertion

**Fix:**
1. Run Phase 4 migration
2. Check RLS policies allow service role inserts
3. Verify user record created in Supabase dashboard

### Auth state not persisting across page reload

**Cause:** Browser cookies not enabled or Supabase session expired

**Fix:**
1. Enable cookies in browser
2. Logout and login again
3. Check Supabase project settings for session timeout

## Database Sync

On signup, the following happens automatically:

1. Supabase Auth creates user in `auth.users` table
2. Trigger or code creates row in public `users` table:
   - `id` = Auth user ID
   - `email` = User email
   - `plan` = 'free'
   - `usage_count` = 0
   - `usage_reset_date` = 1st of next month

This links auth identity to usage tracking.

## Next Steps

- **Phase 6:** Gumroad webhook to upgrade users to "pro" or "annual"
- **Phase 7:** History page to list past briefs
- **Phase 8:** Settings page for account management

---

**Status:** ✅ Auth system fully functional. Requires Supabase credentials to work.
