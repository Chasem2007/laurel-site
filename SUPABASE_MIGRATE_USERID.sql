-- ============================================================
--  MIGRATION: Switch posts to use permanent user_id
--  Run this in Supabase > SQL Editor > Run
-- ============================================================

-- 1. Add author_id column to posts (links to admin_accounts.id permanently)
alter table posts add column if not exists author_id uuid references admin_accounts(id);

-- 2. Backfill author_id for any existing posts by matching on the old username string
update posts
set author_id = admin_accounts.id
from admin_accounts
where posts.author = admin_accounts.username;

-- Done! New posts will store author_id. The old "author" text column stays
-- as a display fallback for any posts that predate this migration.
