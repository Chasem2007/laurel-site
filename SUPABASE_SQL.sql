-- ============================================================
--  LAUREL HIGH SCHOOL - SUPABASE SETUP
--  Paste this into Supabase > SQL Editor and click Run
-- ============================================================

-- 1. Create tables first
create table posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  category    text,
  author      text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table admin_accounts (
  id               uuid primary key default gen_random_uuid(),
  username         text unique not null,
  password_plain   text not null,
  can_create_users boolean default false,
  created_at       timestamptz default now()
);

-- 2. Enable row level security BEFORE creating policies
alter table posts enable row level security;
alter table admin_accounts enable row level security;

-- 3. Now create the policies
create policy "Public read posts"
  on posts for select using (true);

create policy "Admins manage posts"
  on posts for all using (true) with check (true);

create policy "Read admin accounts"
  on admin_accounts for select using (true);

create policy "Manage admin accounts"
  on admin_accounts for all using (true) with check (true);
