// ============================================================
//  LAUREL HIGH SCHOOL — SUPABASE CONFIGURATION
//  
//  STEP 1: Follow the SETUP GUIDE in README.md to create your
//          free Supabase project and database tables.
//
//  STEP 2: Replace the two values below with YOUR project's
//          values from Supabase (Settings → API).
//
//  STEP 3: Save this file, then deploy to Netlify.
// ============================================================

const SUPABASE_URL  = "https://mtsuxvxipmiiqyznjvry.supabase.co";
const SUPABASE_ANON = "sb_secret_L1eok7lwyyxWLII2FMa1jg_frTUYXfD";

// ── Countdown dates ──────────────────────────────────────────
// Format: "YYYY-MM-DDTHH:MM:SS"  (24-hour, local school time)
const GRADUATION_DATE  = "2025-05-31T13:00:00";
const END_OF_YEAR_DATE = "2025-06-06T12:00:00";

const GRADUATION_LABEL  = "Graduation Ceremony";
const END_OF_YEAR_LABEL = "Last Day of School";

// ── Super-admin credentials ──────────────────────────────────
// These are checked client-side only. Supabase RLS handles
// actual data security. Change these if desired.
const SUPER_ADMIN_USER = "chase";
const SUPER_ADMIN_PASS = "Smilingsquash479$";
