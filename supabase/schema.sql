-- PortalKit schema — run in Supabase SQL editor

create extension if not exists "pgcrypto";

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  name text not null default 'My workspace',
  plan text not null default 'starter' check (plan in ('starter', 'pro', 'founder')),
  studio_name text not null default 'My studio',
  brand_accent text not null default '#FF5A5F',
  support_email text not null default '',
  razorpay_customer_id text,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_subscription_id text,
  plan_interval text,
  subscription_status text,
  client_razorpay_key_id text not null default '',
  client_razorpay_key_secret text not null default '',
  lead_form_token text unique,
  hide_portalkit_badge boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null default '',
  company text,
  store_url text,
  notes text default '',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id text primary key,
  workspace_id uuid not null references workspaces (id) on delete cascade,
  contact_id uuid references contacts (id) on delete set null,
  name text not null,
  client_name text not null,
  client_email text not null,
  store_url text not null default '',
  status text not null default 'lead'
    check (status in (
      'lead',
      'offer_sent',
      'signed',
      'deposit_paid',
      'in_build',
      'done',
      'lost'
    )),
  due_date date,
  notes text not null default '',
  share_token text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_files (
  id text primary key,
  project_id text not null references projects (id) on delete cascade,
  name text not null,
  size_label text not null default '',
  storage_path text,
  uploaded_at date not null default current_date
);

create table if not exists payments (
  id text primary key,
  project_id text not null references projects (id) on delete cascade,
  label text not null,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'USD',
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid')),
  razorpay_order_id text,
  razorpay_payment_id text,
  due_at date,
  last_reminder_at timestamptz,
  created_at date not null default current_date
);

create table if not exists project_tasks (
  id text primary key,
  project_id text not null references projects (id) on delete cascade,
  title text not null,
  done boolean not null default false,
  done_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists project_messages (
  id text primary key,
  project_id text not null references projects (id) on delete cascade,
  author text not null check (author in ('freelancer', 'client')),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists project_tasks_project_idx on project_tasks (project_id);
create index if not exists project_messages_project_idx on project_messages (project_id);

create table if not exists offers (
  id text primary key,
  workspace_id uuid not null references workspaces (id) on delete cascade,
  project_id text not null references projects (id) on delete cascade,
  share_token text not null unique,
  title text not null,
  scope text not null default '',
  total_cents integer not null check (total_cents >= 0),
  deposit_cents integer not null default 0 check (deposit_cents >= 0),
  currency text not null default 'USD',
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'accepted', 'superseded')),
  version integer not null default 1,
  accepted_name text,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists offers_workspace_idx on offers (workspace_id);
create index if not exists offers_project_idx on offers (project_id);
create index if not exists offers_share_token_idx on offers (share_token);

alter table workspaces enable row level security;
alter table contacts enable row level security;
alter table projects enable row level security;
alter table project_files enable row level security;
alter table payments enable row level security;
alter table offers enable row level security;
alter table project_tasks enable row level security;
alter table project_messages enable row level security;

-- KAR-23: Automations
create table if not exists automations (
  id text primary key,
  workspace_id uuid not null references workspaces (id) on delete cascade,
  name text not null,
  description text not null default '',
  trigger text not null,
  category text not null default 'Sales',
  actions jsonb not null default '[]'::jsonb,
  enabled boolean not null default true,
  run_count integer not null default 0,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- KAR-24: Calendar & Scheduler Events
create table if not exists calendar_events (
  id text primary key,
  workspace_id uuid not null references workspaces (id) on delete cascade,
  project_id text references projects (id) on delete set null,
  title text not null,
  event_type text not null default 'call',
  event_date date not null,
  event_time text,
  duration_minutes integer default 30,
  client_name text,
  client_email text,
  meet_url text,
  notes text default '',
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists automations_workspace_idx on automations (workspace_id);
create index if not exists calendar_events_workspace_idx on calendar_events (workspace_id);

alter table automations enable row level security;
alter table calendar_events enable row level security;

-- Storage: create a private bucket named `project-files` in Supabase Storage.

-- If you already ran an older schema, run:
-- KAR-26: Remove badge support
-- alter table workspaces add column if not exists hide_portalkit_badge boolean not null default false;
-- alter table workspaces add column if not exists razorpay_customer_id text;
-- alter table workspaces add column if not exists razorpay_order_id text;
-- alter table workspaces add column if not exists razorpay_payment_id text;
-- alter table workspaces add column if not exists studio_name text not null default 'My studio';
-- alter table workspaces add column if not exists brand_accent text not null default '#FF5A5F';
-- alter table workspaces add column if not exists support_email text not null default '';
-- alter table payments add column if not exists currency text not null default 'USD';
-- alter table payments add column if not exists razorpay_order_id text;
-- alter table payments add column if not exists razorpay_payment_id text;
-- alter table payments add column if not exists due_at date;
-- alter table payments add column if not exists last_reminder_at timestamptz;
-- alter table workspaces add column if not exists client_razorpay_key_id text not null default '';
-- alter table workspaces add column if not exists client_razorpay_key_secret text not null default '';
-- alter table workspaces add column if not exists lead_form_token text unique;
-- alter table workspaces add column if not exists razorpay_subscription_id text;
-- alter table workspaces add column if not exists plan_interval text;
-- alter table workspaces add column if not exists subscription_status text;
-- alter table contacts add column if not exists phone text not null default '';
-- alter table contacts add column if not exists archived_at timestamptz;
-- create table offers (... see schema above) if missing;
-- Pipeline stages migration (run once on existing DBs):
-- alter table projects drop constraint if exists projects_status_check;
-- update projects set status = 'lead' where status = 'todo';
-- update projects set status = 'in_build' where status = 'in_progress';
-- update projects set status = 'signed' where status = 'in_review';
-- alter table projects alter column status set default 'lead';
-- alter table projects add constraint projects_status_check
--   check (status in ('lead','offer_sent','signed','deposit_paid','in_build','done','lost'));

-- Service role / server routes bypass RLS. Public portal reads by share_token
-- should go through Next.js API with the service role key.
