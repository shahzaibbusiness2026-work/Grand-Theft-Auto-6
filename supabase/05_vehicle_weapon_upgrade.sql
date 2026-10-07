-- ============================================================
-- Migration 05 — Deep vehicle & weapon database upgrade
-- Run in the Supabase SQL Editor (Dashboard → SQL Editor).
-- Safe to re-run (idempotent: adds columns only if missing).
--
-- Adds the full stat/economy/engine/characteristics/features/
-- customization/audio field set for vehicles and weapons so the
-- CMS, comparison tools and rankings can use real columns.
-- ============================================================

-- ---------------- VEHICLES ----------------
alter table public.vehicles
  add column if not exists traction int,
  add column if not exists cornering int,
  add column if not exists launch int,
  add column if not exists reverse_speed int,
  add column if not exists torque int,
  -- Economy
  add column if not exists resale_price numeric,
  add column if not exists insurance_cost numeric,
  add column if not exists upgrade_cost numeric,
  add column if not exists repair_cost numeric,
  add column if not exists storage_cost numeric,
  -- Engine / mechanical
  add column if not exists engine_type text,
  add column if not exists engine_size text,
  add column if not exists transmission text,
  add column if not exists gears int,
  add column if not exists fuel_type text,
  add column if not exists turbo boolean default false,
  add column if not exists electric boolean default false,
  -- Characteristics
  add column if not exists doors int,
  add column if not exists convertible boolean default false,
  add column if not exists roof_type text,
  add column if not exists trunk_capacity text,
  add column if not exists offroad_rating int,
  add column if not exists water_rating int,
  add column if not exists amphibious boolean default false,
  add column if not exists bullet_resistance int,
  add column if not exists explosion_resistance int,
  -- Special features & ratings
  add column if not exists armor_rating int,
  add column if not exists weaponized boolean default false,
  add column if not exists drift_rating int,
  add column if not exists special_ability text,
  add column if not exists features text[] default '{}',
  -- Customization, audio, meta
  add column if not exists customization text[] default '{}',
  add column if not exists sound_rating int,
  add column if not exists engine_sound text,
  add column if not exists exhaust_sound text,
  add column if not exists horn text,
  add column if not exists turbo_sound text,
  add column if not exists gear_shift_sound text,
  add column if not exists availability text,
  add column if not exists featured boolean default false,
  add column if not exists gallery text[] default '{}',
  add column if not exists tags text[] default '{}';

-- ---------------- WEAPONS ----------------
alter table public.weapons
  add column if not exists reload int,
  add column if not exists ammo_capacity int,
  add column if not exists recoil int,
  add column if not exists mobility int,
  add column if not exists projectile_speed int,
  add column if not exists headshot_multiplier numeric,
  add column if not exists damage_falloff int,
  -- Characteristics
  add column if not exists fire_mode text,
  add column if not exists features text[] default '{}',
  -- Economy
  add column if not exists price numeric,
  add column if not exists ammo_cost numeric,
  add column if not exists upgrade_cost numeric,
  -- Meta / customization
  add column if not exists manufacturer text,
  add column if not exists availability text,
  add column if not exists featured boolean default false,
  add column if not exists image text,
  add column if not exists gallery text[] default '{}',
  add column if not exists tags text[] default '{}',
  add column if not exists customization text[] default '{}';

-- ---------------- Helpful indexes for rankings/filters ----------------
create index if not exists vehicles_class_idx on public.vehicles (class);
create index if not exists vehicles_status_idx on public.vehicles (status);
create index if not exists vehicles_top_speed_idx on public.vehicles (top_speed);
create index if not exists vehicles_price_idx on public.vehicles (price);
create index if not exists weapons_category_idx on public.weapons (category);
create index if not exists weapons_status_idx on public.weapons (status);
create index if not exists weapons_damage_idx on public.weapons (damage);
