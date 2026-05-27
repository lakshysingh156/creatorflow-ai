-- CreatorFlow AI — production schema
-- Run in Supabase SQL Editor or via CLI

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text default 'inactive',
  generations_this_month integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Creator preferences
create table if not exists public.creator_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  default_tone text default 'Confident',
  default_platform text default 'TikTok',
  default_audience text default 'Beginners',
  default_goal text default 'Grow followers',
  niche text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- AI generations
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  niche text not null,
  tone text not null,
  platform text not null,
  audience text not null,
  goal text not null,
  result_json jsonb not null,
  engagement_prediction integer,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists generations_user_id_idx on public.generations(user_id);
create index if not exists generations_created_at_idx on public.generations(created_at desc);

-- Saved hook packs
create table if not exists public.hook_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  niche text,
  hooks_json jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists hook_packs_user_id_idx on public.hook_packs(user_id);

-- AI activity log
create table if not exists public.ai_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('generation', 'save', 'optimize', 'trend', 'billing')),
  message text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_activity_user_id_idx on public.ai_activity(user_id);

-- Analytics snapshots
create table if not exists public.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  engagement_score integer default 0,
  hook_success_rate integer default 0,
  weekly_generations integer default 0,
  snapshot_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- Content workflows (pipeline)
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  stage text not null default 'idea' check (stage in ('idea', 'draft', 'scheduled', 'published')),
  platform text,
  generation_id uuid references public.generations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  insert into public.creator_preferences (user_id)
  values (new.id);
  insert into public.analytics_snapshots (user_id, engagement_score, hook_success_rate, weekly_generations)
  values (new.id, 72, 68, 0);
  insert into public.ai_activity (user_id, type, message)
  values (new.id, 'optimize', 'Welcome to CreatorFlow AI — your creator OS is ready.');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.creator_preferences enable row level security;
alter table public.generations enable row level security;
alter table public.hook_packs enable row level security;
alter table public.ai_activity enable row level security;
alter table public.analytics_snapshots enable row level security;
alter table public.workflows enable row level security;

create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users manage own preferences" on public.creator_preferences for all using (auth.uid() = user_id);

create policy "Users manage own generations" on public.generations for all using (auth.uid() = user_id);

create policy "Users manage own hook packs" on public.hook_packs for all using (auth.uid() = user_id);

create policy "Users manage own activity" on public.ai_activity for all using (auth.uid() = user_id);

create policy "Users manage own analytics" on public.analytics_snapshots for all using (auth.uid() = user_id);

create policy "Users manage own workflows" on public.workflows for all using (auth.uid() = user_id);
