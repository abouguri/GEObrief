-- Migration 003: track the Gumroad purchase behind each paid plan
--
-- Lets the webhook be idempotent (a replayed ping updates the same row
-- instead of double-applying) and gives the settings page something concrete
-- to show a paying customer.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS gumroad_sale_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS gumroad_subscription_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS plan_updated_at TIMESTAMP WITH TIME ZONE;

-- Gumroad identifies recurring customers by subscription id; we look users up
-- by that id when a cancellation ping arrives without a usable email.
CREATE INDEX IF NOT EXISTS idx_users_gumroad_subscription_id
  ON public.users(gumroad_subscription_id)
  WHERE gumroad_subscription_id IS NOT NULL;

-- Email is how a fresh sale is matched to an account, so keep it fast and
-- case-insensitive. Gumroad may send a different capitalisation than signup.
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower
  ON public.users(lower(email));
