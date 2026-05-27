-- CreatorFlow AI — phase 2 persistence hardening

-- Auto-updated timestamp helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Creator workspace state (dashboard/session preferences)
create table if not exists public.creator_workspaces (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  workspace_name text not null default 'My Workspace',
  last_input jsonb,
  dashboard_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists creator_workspaces_set_updated_at on public.creator_workspaces;
create trigger creator_workspaces_set_updated_at
  before update on public.creator_workspaces
  for each row execute procedure public.set_updated_at();

-- Saved creator strategies
create table if not exists public.creator_strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  generation_id uuid references public.generations(id) on delete set null,
  title text not null,
  summary text,
  status text not null default 'active' check (status in ('active', 'archived')),
  strategy_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creator_strategies_user_id_idx on public.creator_strategies(user_id);
create index if not exists creator_strategies_created_at_idx on public.creator_strategies(created_at desc);

drop trigger if exists creator_strategies_set_updated_at on public.creator_strategies;
create trigger creator_strategies_set_updated_at
  before update on public.creator_strategies
  for each row execute procedure public.set_updated_at();

-- Flattened content history for easier timeline/search
create table if not exists public.content_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  generation_id uuid references public.generations(id) on delete cascade,
  content_type text not null check (content_type in ('hook', 'caption', 'cta', 'angle', 'carousel', 'trigger', 'strategy', 'insight')),
  title text not null,
  content text not null,
  score integer,
  created_at timestamptz not null default now()
);

create index if not exists content_history_user_id_idx on public.content_history(user_id);
create index if not exists content_history_generation_id_idx on public.content_history(generation_id);
create index if not exists content_history_created_at_idx on public.content_history(created_at desc);

-- Subscription state placeholder for billing sync and reporting
create table if not exists public.subscription_states (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'pro')),
  status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists subscription_states_set_updated_at on public.subscription_states;
create trigger subscription_states_set_updated_at
  before update on public.subscription_states
  for each row execute procedure public.set_updated_at();

-- Initialize new per-user rows on auth signup
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
  )
  on conflict (id) do nothing;

  insert into public.creator_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.analytics_snapshots (user_id, engagement_score, hook_success_rate, weekly_generations)
  values (new.id, 72, 68, 0);

  insert into public.ai_activity (user_id, type, message)
  values (new.id, 'optimize', 'Welcome to CreatorFlow AI — your creator OS is ready.');

  insert into public.creator_workspaces (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.subscription_states (user_id, tier, status)
  values (new.id, 'free', 'inactive')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- RLS
alter table public.creator_workspaces enable row level security;
alter table public.creator_strategies enable row level security;
alter table public.content_history enable row level security;
alter table public.subscription_states enable row level security;

drop policy if exists "Users manage own workspace state" on public.creator_workspaces;
create policy "Users manage own workspace state" on public.creator_workspaces for all using (auth.uid() = user_id);
drop policy if exists "Users manage own strategies" on public.creator_strategies;
create policy "Users manage own strategies" on public.creator_strategies for all using (auth.uid() = user_id);
drop policy if exists "Users manage own content history" on public.content_history;
create policy "Users manage own content history" on public.content_history for all using (auth.uid() = user_id);
drop policy if exists "Users manage own subscription states" on public.subscription_states;
create policy "Users manage own subscription states" on public.subscription_states for all using (auth.uid() = user_id);
