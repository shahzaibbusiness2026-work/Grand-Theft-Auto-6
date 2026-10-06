-- ============================================================
-- 04_private_settings.sql — Private settings table (security fix)
-- ============================================================
-- site_settings is intentionally readable by the anon key (the public site
-- fetches its keys through it), so private data such as newsletter
-- subscribers and admin team members must NOT live there.
--
-- This creates a service-role-only key/value store: RLS is enabled and NO
-- policies are added, so the anon key can do nothing at all — only the
-- server's service_role key has access.
--
-- Run this in the Supabase SQL Editor AFTER the code deploy has completed.
-- ============================================================

create table if not exists public.private_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.private_settings enable row level security;

-- Deliberately NO "create policy" statements: with RLS enabled and zero
-- policies, anon/authenticated roles are denied every operation. Only the
-- service_role key (used by the site's server code) bypasses RLS.

-- Migrate any existing private rows out of the anon-readable table.
insert into public.private_settings (key, value, updated_at)
select key, value, coalesce(updated_at, now())
from public.site_settings
where key in ('newsletter_subscribers', 'admin_team_members')
on conflict (key) do nothing;

delete from public.site_settings
where key in ('newsletter_subscribers', 'admin_team_members');
