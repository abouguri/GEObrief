-- Migration 002: provision public.users from auth.users
--
-- Why: signup previously inserted the public.users row from the browser using
-- the anon key, which the RLS policy in 001 correctly rejects (only
-- service_role may insert). That left authenticated accounts with no profile
-- row, so every usage lookup failed with "User not found".
--
-- Fix: let Postgres own provisioning via a trigger on auth.users. The trigger
-- function is SECURITY DEFINER, so it bypasses RLS without exposing an
-- insert path to clients.

-- 1. Tie public.users.id to the auth user it represents -------------------

-- The id must always be the auth user's id, never a fresh random uuid.
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;

ALTER TABLE public.users
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Supabase Auth stores credentials in auth.users; this column was never used.
ALTER TABLE public.users DROP COLUMN IF EXISTS password_hash;

-- Free briefs reset on the 1st of the following month, not today.
ALTER TABLE public.users
  ALTER COLUMN usage_reset_date
  SET DEFAULT (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date;

-- 2. Provisioning trigger -------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, plan, usage_count, usage_reset_date)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    0,
    (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date
  )
  -- Re-confirmations and repeated OAuth logins can fire this more than once.
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

-- 3. Backfill any accounts created before this migration ------------------

INSERT INTO public.users (id, email, plan, usage_count, usage_reset_date)
SELECT
  au.id,
  au.email,
  'free',
  0,
  (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
  AND au.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- 4. Drop the unusable client insert policy -------------------------------

-- Inserts now happen only through the trigger above and the service role,
-- which bypasses RLS entirely. The policy served no purpose.
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
