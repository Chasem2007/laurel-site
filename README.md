# 🚂 Laurel High School — Setup Guide

Everything you need to get the site live. Read this top to bottom before starting. It looks long but each step is short and has pictures to guide you in Supabase and Netlify's interfaces.

---

## What You're Setting Up

| What | Why |
|------|-----|
| **Supabase** (free) | The database that stores announcements and admin accounts — works across all computers |
| **Netlify** (free) | Hosts the website files and serves the live RSS feed |

Both are free. Neither requires a credit card.

---

## STEP 1 — Create a Supabase Account & Project

1. Go to **https://supabase.com** and click **"Start your project"**
2. Sign up with GitHub or email
3. Click **"New project"**
4. Fill in:
   - **Project name:** `laurel-high` (or anything)
   - **Database password:** Choose something strong — save it somewhere safe
   - **Region:** Pick the one closest to Mississippi (US East is fine)
5. Click **"Create new project"** — wait about 1 minute for it to set up

---

## STEP 2 — Create the Database Tables

Once your project loads, click **"SQL Editor"** in the left sidebar. You'll see a blank code window.

**Copy and paste ALL of this into that window, then click "Run":**

```sql
-- Table that stores announcements
create table posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text not null,
  category    text,
  author      text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Table that stores admin accounts (created by super admin)
create table admin_accounts (
  id             uuid primary key default gen_random_uuid(),
  username       text unique not null,
  password_plain text not null,
  created_at     timestamptz default now()
);

-- Allow anyone to READ posts (public countdown page needs this)
create policy "Public can read posts"
  on posts for select
  using (true);

-- Allow anyone to INSERT/UPDATE/DELETE posts (login is handled by our app)
create policy "Admins can manage posts"
  on posts for all
  using (true)
  with check (true);

-- Allow reading admin accounts (for login check)
create policy "Allow reading admin accounts"
  on admin_accounts for select
  using (true);

-- Allow super admin to manage admin accounts
create policy "Allow managing admin accounts"
  on admin_accounts for all
  using (true)
  with check (true);

-- Turn on row security (required for policies to work)
alter table posts enable row level security;
alter table admin_accounts enable row level security;
```

You should see: **"Success. No rows returned."** — that's correct!

---

## STEP 3 — Get Your Supabase Keys

1. In Supabase, click the **gear icon (⚙️) → "API"** in the left sidebar
2. You'll see two values you need:
   - **Project URL** — looks like `https://abcdefghijk.supabase.co`
   - **anon / public key** — a long string starting with `eyJ...`

Copy both of these — you'll need them in the next two steps.

---

## STEP 4 — Add Your Keys to `config.js`

Open the file **`config.js`** (in the root of this folder — NOT inside `/admin/`).

Find these two lines:

```js
const SUPABASE_URL  = "PASTE_YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";
```

Replace the placeholder text with your actual values. It should look like:

```js
const SUPABASE_URL  = "https://abcdefghijk.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

Save the file.

---

## STEP 5 — Update Your Countdown Dates

Still in `config.js`, find:

```js
const GRADUATION_DATE  = "2025-05-17T10:00:00";
const END_OF_YEAR_DATE = "2025-05-23T15:00:00";
```

Change these to your actual dates. The format is:
`"YEAR-MONTH-DAYZHOUR:MINUTE:SECOND"` using 24-hour time.

Example: May 17, 2025 at 10:00 AM = `"2025-05-17T10:00:00"`

---

## STEP 6 — Deploy to Netlify

### Option A — Drag & Drop (Easiest, one time)

1. Go to **https://netlify.com** and sign up / log in
2. From your dashboard, click **"Add new site"** → **"Deploy manually"**
3. Drag the entire **`laurel-site`** folder onto the upload box
4. Your site is live immediately! Netlify gives you a URL like `https://graceful-locomotive-123.netlify.app`

> **To update the site later**, just drag the folder again to the same site in your Netlify dashboard.

### Option B — GitHub (Best for ongoing updates)

1. Create a free account at **https://github.com**
2. Click **"New repository"**, name it `laurel-site`, make it **Private**
3. Upload all the files from this folder to that repository
4. In Netlify: **"Add new site"** → **"Import an existing project"** → Connect GitHub
5. Select your repository. Set **Publish directory** to `/` (just a forward slash)
6. Click **Deploy**

---

## STEP 7 — Add Supabase Keys to Netlify (For the RSS Feed)

The live RSS feed (`/feed.xml`) runs as a Netlify Edge Function and needs your Supabase keys as **environment variables** in Netlify (separate from `config.js`).

1. In Netlify, go to your site → **"Site configuration"** → **"Environment variables"**
2. Click **"Add a variable"** and add these two:

| Key | Value |
|-----|-------|
| `SUPABASE_URL`  | Your Supabase project URL |
| `SUPABASE_ANON` | Your Supabase anon key |

3. Click **"Save"**, then go to **"Deploys"** and click **"Trigger deploy"** → **"Deploy site"**

After this, `https://your-site.netlify.app/feed.xml` will return a live RSS feed!

---

## STEP 8 — Add the Logo

Make sure the file **`logo.png`** is in the root of the folder (it should already be there — it's your Laurel Locomotives logo). If you ever want to update the logo, just replace that file.

---

## You're Done! 🎉

| URL | What it is |
|-----|------------|
| `https://your-site.netlify.app` | Public countdown page |
| `https://your-site.netlify.app/admin` | Admin login |
| `https://your-site.netlify.app/feed.xml` | Live RSS feed for announcement boards |

---

## Default Login

| Username | Password | Role |
|----------|----------|------|
| `chase`  | `admin123` | Super Admin (can create/remove other admins) |

**To change the super admin credentials:** Open `config.js` and update:
```js
const SUPER_ADMIN_USER = "chase";
const SUPER_ADMIN_PASS = "admin123";
```

---

## How Admin Accounts Work

- **Super admin (chase):** Can create and delete admin accounts. Sees all system options.
- **Regular admins:** Can only see, edit, and delete **their own posts**. Cannot see other admins' posts.
- All posts from all admins appear on the **public page** and in the **RSS feed**.

---

## Troubleshooting

**"Could not load announcements" on the public page**
→ Check that your `SUPABASE_URL` and `SUPABASE_ANON` in `config.js` are correct and you re-deployed after changing them.

**Login says invalid even with correct credentials**
→ For regular admins: check the `admin_accounts` table in Supabase (Table Editor → admin_accounts) to confirm the account exists.

**RSS feed shows an error page**
→ Make sure you added `SUPABASE_URL` and `SUPABASE_ANON` as Netlify environment variables (Step 7) and triggered a new deploy after.

**I need to update the graduation date**
→ Edit `config.js`, change the date, and re-deploy to Netlify.
