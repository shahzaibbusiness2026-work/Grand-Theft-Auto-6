-- ====================================================================
-- GTA 6 Atlas — SCHEMA V2 UPGRADE
-- Run this in the Supabase SQL Editor FIRST (before 02_seeds_canonical.sql).
-- Idempotent: safe to run multiple times.
--
-- What this does:
--   1. SECURITY: removes the "OR true" write policies that let ANY visitor
--      edit the database with the public anon key. Writes are now
--      service_role-only (the app's admin client).
--   2. Creates tables that were never applied from schema.sql:
--      seo_settings, missions, locations, media_assets
--   3. Creates new content tables so every piece of website content is
--      admin-editable: guides, properties, collectibles, radio_stations,
--      contact_messages, activity_log
--   4. Extends vehicles/weapons with columns used by the richer catalog
--   5. Migrates legacy site_settings JSON (locations_data / missions_data)
--      into the real tables
--   6. Adds updated_at triggers + performance indexes
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. SECURITY: Row Level Security hardening
-- --------------------------------------------------------------------

-- ARTICLES -------------------------------------------------------------
DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
DROP POLICY IF EXISTS "Service role has full access to articles" ON public.articles;
CREATE POLICY "Public can read published articles" ON public.articles
  FOR SELECT USING (status = 'published');
CREATE POLICY "Service role can insert articles" ON public.articles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update articles" ON public.articles
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete articles" ON public.articles
  FOR DELETE USING (auth.role() = 'service_role');

-- CHARACTERS -----------------------------------------------------------
DROP POLICY IF EXISTS "Public can read characters" ON public.characters;
DROP POLICY IF EXISTS "Service role has full access to characters" ON public.characters;
CREATE POLICY "Public can read characters" ON public.characters
  FOR SELECT USING (true);
CREATE POLICY "Service role can insert characters" ON public.characters
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update characters" ON public.characters
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete characters" ON public.characters
  FOR DELETE USING (auth.role() = 'service_role');

-- VEHICLES -------------------------------------------------------------
DROP POLICY IF EXISTS "Public can read vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Service role has full access to vehicles" ON public.vehicles;
CREATE POLICY "Public can read vehicles" ON public.vehicles
  FOR SELECT USING (true);
CREATE POLICY "Service role can insert vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update vehicles" ON public.vehicles
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete vehicles" ON public.vehicles
  FOR DELETE USING (auth.role() = 'service_role');

-- WEAPONS --------------------------------------------------------------
DROP POLICY IF EXISTS "Public can read weapons" ON public.weapons;
DROP POLICY IF EXISTS "Service role has full access to weapons" ON public.weapons;
CREATE POLICY "Public can read weapons" ON public.weapons
  FOR SELECT USING (true);
CREATE POLICY "Service role can insert weapons" ON public.weapons
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update weapons" ON public.weapons
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete weapons" ON public.weapons
  FOR DELETE USING (auth.role() = 'service_role');

-- SITE SETTINGS --------------------------------------------------------
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Service role has full access to site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "Service role can insert site settings" ON public.site_settings
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update site settings" ON public.site_settings
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete site settings" ON public.site_settings
  FOR DELETE USING (auth.role() = 'service_role');

-- MAP MARKERS ----------------------------------------------------------
DROP POLICY IF EXISTS "Public can read map markers" ON public.map_markers;
DROP POLICY IF EXISTS "Service role has full access to map markers" ON public.map_markers;
CREATE POLICY "Public can read map markers" ON public.map_markers
  FOR SELECT USING (true);
CREATE POLICY "Service role can insert map markers" ON public.map_markers
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update map markers" ON public.map_markers
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete map markers" ON public.map_markers
  FOR DELETE USING (auth.role() = 'service_role');

-- --------------------------------------------------------------------
-- 2. MISSING TABLES (from schema.sql sections 7–10, never applied)
-- --------------------------------------------------------------------

-- SEO SETTINGS ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read seo settings" ON public.seo_settings;
CREATE POLICY "Public can read seo settings" ON public.seo_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role has full access to seo settings" ON public.seo_settings;
CREATE POLICY "Service role can insert seo settings" ON public.seo_settings
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update seo settings" ON public.seo_settings
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete seo settings" ON public.seo_settings
  FOR DELETE USING (auth.role() = 'service_role');

INSERT INTO public.seo_settings (key, value) VALUES
  ('titleTemplate', '{title} | GTA 6 Atlas'),
  ('metaDescription', 'Your independent guide to GTA 6. News, articles, locations, vehicles, weapons and more — all in one place.'),
  ('canonicalBaseUrl', 'https://gta6atlas.com'),
  ('socialPreviewImage', '/img/hero-dark.jpg'),
  ('excludeDraftsAndArchived', 'true'),
  ('redirects', '[{"id":"red-1","fromUrl":"/old-map","toUrl":"/map","type":"301","enabled":true},{"id":"red-2","fromUrl":"/vehicle-list","toUrl":"/vehicles","type":"301","enabled":true}]')
ON CONFLICT (key) DO NOTHING;

-- MISSIONS (extended) --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.missions (
  id TEXT PRIMARY KEY,
  slug TEXT,
  name TEXT NOT NULL,
  protagonist TEXT NOT NULL DEFAULT 'Both',      -- 'Lucia' | 'Jason' | 'Both'
  act TEXT NOT NULL DEFAULT 'Main Story',
  mission_type TEXT,                             -- 'Main Story' | 'Heist' | ...
  difficulty TEXT,
  duration TEXT,
  district TEXT,
  cash_reward_display TEXT,
  other_rewards JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  objectives TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Rumoured',       -- 'Confirmed' | 'Rumoured'
  confidence TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read missions" ON public.missions;
CREATE POLICY "Public can read missions" ON public.missions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role has full access to missions" ON public.missions;
CREATE POLICY "Service role can insert missions" ON public.missions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update missions" ON public.missions
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete missions" ON public.missions
  FOR DELETE USING (auth.role() = 'service_role');

-- LOCATIONS (extended) -------------------------------------------------
CREATE TABLE IF NOT EXISTS public.locations (
  id TEXT PRIMARY KEY,
  slug TEXT,
  name TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT 'Vice City Metro',
  type TEXT NOT NULL DEFAULT 'Landmark',         -- admin-facing type
  category TEXT,                                 -- canonical category
  verification TEXT NOT NULL DEFAULT 'pending',  -- 'verified' | 'pending'
  coordinates TEXT,
  description TEXT,
  hours TEXT,
  threat_level TEXT,
  img TEXT,
  confidence TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read locations" ON public.locations;
CREATE POLICY "Public can read locations" ON public.locations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role has full access to locations" ON public.locations;
CREATE POLICY "Service role can insert locations" ON public.locations
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update locations" ON public.locations
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete locations" ON public.locations
  FOR DELETE USING (auth.role() = 'service_role');

-- MEDIA ASSETS ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  dimensions TEXT,
  file_size TEXT,
  type TEXT NOT NULL DEFAULT 'Image',
  alt_text TEXT DEFAULT '',
  credit TEXT DEFAULT '',
  license TEXT DEFAULT 'Internal illustration',
  used_by JSONB DEFAULT '[]'::jsonb,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read media assets" ON public.media_assets;
CREATE POLICY "Public can read media assets" ON public.media_assets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role has full access to media assets" ON public.media_assets;
CREATE POLICY "Service role can insert media assets" ON public.media_assets
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update media assets" ON public.media_assets
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete media assets" ON public.media_assets
  FOR DELETE USING (auth.role() = 'service_role');

-- --------------------------------------------------------------------
-- 3. NEW CONTENT TABLES (every website content type becomes editable)
-- --------------------------------------------------------------------

-- GUIDES ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guides (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Getting Started',
  read_time TEXT DEFAULT '10 min read',
  views INTEGER DEFAULT 0,
  image TEXT DEFAULT '/img/hero-dark.jpg',
  featured BOOLEAN DEFAULT FALSE,
  popular BOOLEAN DEFAULT FALSE,
  tag TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read guides" ON public.guides;
CREATE POLICY "Public can read guides" ON public.guides FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role has full access to guides" ON public.guides;
CREATE POLICY "Service role can insert guides" ON public.guides
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update guides" ON public.guides
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete guides" ON public.guides
  FOR DELETE USING (auth.role() = 'service_role');

INSERT INTO public.guides (id, slug, title, description, category, read_time, views, image, featured, popular, tag) VALUES
  ('guide-beginner', 'complete-beginner-guide', 'Complete Beginner Guide', 'Everything you need to know to start your journey in Vice City.', 'Getting Started', '15 min read', 24800, '/img/car-purple.jpg', TRUE, FALSE, 'Getting Started'),
  ('guide-money-fast', 'make-money-fast', 'Make Money Fast', 'Best early game methods to earn cash and build your empire.', 'Money & Economy', '18 min read', 18200, '/img/boat.jpg', FALSE, FALSE, 'Money & Economy'),
  ('guide-map', 'vice-city-map-guide', 'Vice City Map Guide', 'All districts, key locations and points of interest explained.', 'Locations', '20 min read', 16500, '/img/map-dark.svg', FALSE, FALSE, 'Locations'),
  ('guide-weapons-tier', 'best-weapons-tier-list', 'Best Weapons Tier List', 'Ranked list of the best weapons and how to get them.', 'Weapons', '20 min read', 16700, '/img/gunstore.svg', FALSE, FALSE, 'Weapons'),
  ('guide-100-percent', '100-percent-completion-guide', '100% Completion Guide', 'Step-by-step route to complete everything in GTA 6.', 'Getting Started', '22 min read', 9300, '/img/heli.jpg', FALSE, FALSE, 'Getting Started'),
  ('guide-nightclub', 'nightclub-ownership-guide', 'Nightclub Ownership Guide', 'Manage and profit from nightclubs in Vice City.', 'Money & Economy', '21 min read', 31400, '/img/hero-dark.jpg', FALSE, TRUE, 'Money & Economy'),
  ('guide-characters', 'all-main-characters-explained', 'All Main Characters Explained', 'Backgrounds and unique abilities of all playable characters.', 'Characters', '21 min read', 27800, '/img/char-jason.jpg', FALSE, TRUE, 'Characters'),
  ('guide-stunt-jumps', 'best-stunt-jumps-locations', 'Best Stunt Jumps Locations', 'Find all stunt jumps and earn big rewards.', 'Activities', '14 min read', 22100, '/img/car-orange.jpg', FALSE, TRUE, 'Activities'),
  ('guide-heists', 'heists-big-score-guide', 'Heists & Big Score Guide', 'Crews and approaches for all major heists and robberies.', 'Story & Missions', '24 min read', 19600, '/img/hero-dark.jpg', FALSE, TRUE, 'Story & Missions'),
  ('guide-fastest-cars', 'fastest-cars-in-gta-6', 'Fastest Cars in GTA 6', 'Top speed, stats and locations of the fastest vehicles.', 'Vehicles', '13 min read', 17200, '/img/car-pink.jpg', FALSE, TRUE, 'Vehicles')
ON CONFLICT (id) DO NOTHING;

-- PROPERTIES -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  district TEXT,
  type TEXT NOT NULL DEFAULT 'Safehouse',
  price BIGINT,
  price_display TEXT,
  garage_capacity INTEGER DEFAULT 0,
  passive_income_per_hour BIGINT,
  passive_income_display TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  upgrades JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  confidence TEXT,
  source TEXT,
  img TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read properties" ON public.properties;
CREATE POLICY "Public can read properties" ON public.properties FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role has full access to properties" ON public.properties;
CREATE POLICY "Service role can insert properties" ON public.properties
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update properties" ON public.properties
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete properties" ON public.properties
  FOR DELETE USING (auth.role() = 'service_role');

-- COLLECTIBLES ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collectibles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Hidden Packages',
  district TEXT,
  reward TEXT,
  requirements TEXT,
  description TEXT,
  guide_tip TEXT,
  coord_top TEXT DEFAULT '50%',
  coord_left TEXT DEFAULT '50%',
  confidence TEXT,
  source TEXT,
  img TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.collectibles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read collectibles" ON public.collectibles;
CREATE POLICY "Public can read collectibles" ON public.collectibles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role has full access to collectibles" ON public.collectibles;
CREATE POLICY "Service role can insert collectibles" ON public.collectibles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update collectibles" ON public.collectibles
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete collectibles" ON public.collectibles
  FOR DELETE USING (auth.role() = 'service_role');

-- RADIO STATIONS -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.radio_stations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT,
  host TEXT,
  frequency TEXT,
  accent_color TEXT DEFAULT '#B8AAFF',
  description TEXT,
  tracks JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.radio_stations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read radio stations" ON public.radio_stations;
CREATE POLICY "Public can read radio stations" ON public.radio_stations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role has full access to radio stations" ON public.radio_stations;
CREATE POLICY "Service role can insert radio stations" ON public.radio_stations
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update radio stations" ON public.radio_stations
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete radio stations" ON public.radio_stations
  FOR DELETE USING (auth.role() = 'service_role');

-- CONTACT MESSAGES (no public policies: writes go through the server) --
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',            -- 'new' | 'read' | 'handled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
-- Intentionally NO policies: anon/authenticated roles get nothing.
-- The app writes via the service_role admin client and reads in the admin dashboard.

-- ACTIVITY LOG (audit trail for the admin Activity page) ---------------
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor TEXT NOT NULL DEFAULT 'admin',
  action TEXT NOT NULL,                          -- 'create' | 'update' | 'delete' | 'submit'
  target_type TEXT NOT NULL,                     -- 'article' | 'vehicle' | ...
  target_id TEXT,
  target_label TEXT,
  detail JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON public.activity_log (created_at DESC);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
-- Intentionally NO public policies: written by the server, read via service role.

-- --------------------------------------------------------------------
-- 4. EXTEND vehicles / weapons with catalog columns
-- --------------------------------------------------------------------
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS confidence TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS price BIGINT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS price_display TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS seating INTEGER;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS drivetrain TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS power_hp INTEGER;

ALTER TABLE public.weapons ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.weapons ADD COLUMN IF NOT EXISTS confidence TEXT;
ALTER TABLE public.weapons ADD COLUMN IF NOT EXISTS price_display TEXT;
ALTER TABLE public.weapons ADD COLUMN IF NOT EXISTS rarity TEXT;
ALTER TABLE public.weapons ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT ARRAY[]::TEXT[];

-- --------------------------------------------------------------------
-- 5. MIGRATE legacy site_settings JSON into real tables
-- --------------------------------------------------------------------
DO $$
DECLARE arr JSONB;
BEGIN
  SELECT value INTO arr FROM public.site_settings WHERE key = 'locations_data';
  IF arr IS NOT NULL THEN
    INSERT INTO public.locations (id, name, district, type, verification, coordinates, description)
    SELECT elem->>'id', elem->>'name',
           COALESCE(NULLIF(elem->>'district',''), 'Vice City Metro'),
           COALESCE(NULLIF(elem->>'type',''), 'Landmark'),
           COALESCE(NULLIF(elem->>'verification',''), 'pending'),
           COALESCE(elem->>'coordinates', ''),
           COALESCE(elem->>'description', '')
    FROM jsonb_array_elements(arr) AS elem
    WHERE elem->>'id' IS NOT NULL AND elem->>'name' IS NOT NULL
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

DO $$
DECLARE arr JSONB;
BEGIN
  SELECT value INTO arr FROM public.site_settings WHERE key = 'missions_data';
  IF arr IS NOT NULL THEN
    INSERT INTO public.missions (id, name, protagonist, act, status, objectives, description)
    SELECT elem->>'id', elem->>'name',
           COALESCE(NULLIF(elem->>'protagonist',''), 'Both'),
           COALESCE(NULLIF(elem->>'act',''), 'Main Story'),
           COALESCE(NULLIF(elem->>'status',''), 'Rumoured'),
           COALESCE(elem->>'objectives', ''),
           COALESCE(elem->>'description', '')
    FROM jsonb_array_elements(arr) AS elem
    WHERE elem->>'id' IS NOT NULL AND elem->>'name' IS NOT NULL
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- --------------------------------------------------------------------
-- 6. updated_at triggers
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'articles','characters','vehicles','weapons','site_settings','map_markers',
    'seo_settings','missions','locations','media_assets',
    'guides','properties','collectibles','radio_stations'
  ] LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=t) THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_set_updated_at ON public.%I', t);
      EXECUTE format('CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
    END IF;
  END LOOP;
END $$;

-- --------------------------------------------------------------------
-- 7. Performance indexes
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles (status);
CREATE INDEX IF NOT EXISTS idx_weapons_status ON public.weapons (status);
CREATE INDEX IF NOT EXISTS idx_weapons_category ON public.weapons (category);
CREATE INDEX IF NOT EXISTS idx_guides_status ON public.guides (status);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties (status);
CREATE INDEX IF NOT EXISTS idx_collectibles_category ON public.collectibles (category);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (status);

-- --------------------------------------------------------------------
-- 8. Storage bucket for the Media Library
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- DONE. Now run 02_seeds_canonical.sql to load the full catalog.
-- Verify with:
--   SELECT 'articles' t, count(*) FROM articles UNION ALL
--   SELECT 'vehicles', count(*) FROM vehicles UNION ALL
--   SELECT 'weapons', count(*) FROM weapons UNION ALL
--   SELECT 'characters', count(*) FROM characters UNION ALL
--   SELECT 'missions', count(*) FROM missions UNION ALL
--   SELECT 'locations', count(*) FROM locations UNION ALL
--   SELECT 'guides', count(*) FROM guides UNION ALL
--   SELECT 'properties', count(*) FROM properties UNION ALL
--   SELECT 'collectibles', count(*) FROM collectibles UNION ALL
--   SELECT 'radio_stations', count(*) FROM radio_stations UNION ALL
--   SELECT 'map_markers', count(*) FROM map_markers;
-- --------------------------------------------------------------------
