-- ============================================================
--  LAUREL HIGH SCHOOL - SUPABASE DATABASE SETUP
--  Run this entire script in Supabase > SQL Editor > Run
-- ============================================================

-- Posts table (announcements)
create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  category    text,
  author      text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Admin accounts table
create table if not exists admin_accounts (
  id               uuid primary key default gen_random_uuid(),
  username         text unique not null,
  password_plain   text not null,
  can_create_users boolean default false,
  created_at       timestamptz default now()
);

-- Row Level Security
alter table posts enable row level security;
alter table admin_accounts enable row level security;

-- Policies - allow all operations (login security is handled by the app)
create policy "Public read posts"          on posts for select using (true);
create policy "Admins manage posts"        on posts for all using (true) with check (true);
create policy "Read admin accounts"        on admin_accounts for select using (true);
create policy "Manage admin accounts"      on admin_accounts for all using (true) with check (true);

-- ============================================================
--  IF YOU ALREADY RAN THE OLD SQL - just run this to add
--  the new can_create_users column:
-- ============================================================
-- alter table admin_accounts add column if not exists can_create_users boolean default false;
