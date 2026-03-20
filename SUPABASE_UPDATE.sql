-- ============================================================
--  LAUREL HIGH SCHOOL - UPDATE EXISTING DATABASE
--  Run this if you already have the tables set up
-- ============================================================

-- Add the can_create_users column to admin_accounts
alter table admin_accounts 
  add column if not exists can_create_users boolean default false;

-- Make body optional (was "not null" before, now it can be empty)
alter table posts 
  alter column body drop not null;
