-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255), -- For email/password auth (Supabase Auth handles this)
  plan VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'pro', 'annual'
  usage_count INTEGER NOT NULL DEFAULT 0, -- Briefs generated this month
  usage_reset_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Next reset date (1st of next month)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT valid_plan CHECK (plan IN ('free', 'pro', 'annual'))
);

-- Create briefs table
CREATE TABLE public.briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  keyword VARCHAR(255) NOT NULL,
  website_url VARCHAR(255), -- Optional user website
  niche VARCHAR(255), -- Optional user niche
  brief_data JSONB NOT NULL, -- Full structured brief from Grok
  brief_markdown TEXT NOT NULL, -- Markdown version for display
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for faster queries
  CONSTRAINT briefs_user_keyword_unique UNIQUE (user_id, keyword, created_at)
);

-- Create indexes
CREATE INDEX idx_briefs_user_id ON public.briefs(user_id);
CREATE INDEX idx_briefs_created_at ON public.briefs(created_at DESC);
CREATE INDEX idx_users_plan ON public.users(plan);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can only read their own profile
CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Only service role can update users (for plan upgrades via webhook)
CREATE POLICY "Service role can update users"
  ON public.users
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Only service role can insert users (for signup via auth)
CREATE POLICY "Service role can insert users"
  ON public.users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- RLS Policies for briefs table
-- Users can only read their own briefs
CREATE POLICY "Users can read own briefs"
  ON public.briefs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert briefs for themselves
CREATE POLICY "Users can insert own briefs"
  ON public.briefs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own briefs
CREATE POLICY "Users can update own briefs"
  ON public.briefs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own briefs
CREATE POLICY "Users can delete own briefs"
  ON public.briefs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger for users table
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Add updated_at trigger for briefs table
CREATE OR REPLACE FUNCTION update_briefs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER briefs_updated_at_trigger
BEFORE UPDATE ON public.briefs
FOR EACH ROW
EXECUTE FUNCTION update_briefs_updated_at();
