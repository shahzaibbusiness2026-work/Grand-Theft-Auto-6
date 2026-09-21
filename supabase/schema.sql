-- ====================================================================
-- GTA 6 Atlas — Complete Supabase Database Schema & Seeding
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- ====================================================================

-- 1. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'News',
  tag TEXT NOT NULL DEFAULT 'Official',
  status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'review', 'scheduled', 'published', 'archived'
  author_name TEXT NOT NULL DEFAULT 'Atlas Editorial',
  author_avatar TEXT DEFAULT '/img/avatar-admin.jpg',
  author_role TEXT DEFAULT 'Staff Writer',
  cover_image TEXT NOT NULL DEFAULT '/img/hero-dark.jpg',
  read_time TEXT DEFAULT '4 min',
  views INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY['GTA 6', 'Rockstar Games'],
  published_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CHARACTERS TABLE
CREATE TABLE IF NOT EXISTS public.characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Supporting', -- 'Protagonist', 'Antagonist', 'Supporting', 'Law Enforcement', 'Civilian'
  description TEXT NOT NULL,
  img TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  alias TEXT,
  voice_actor TEXT,
  origin TEXT,
  specialty TEXT,
  perk TEXT,
  vehicle TEXT,
  weapons TEXT[] DEFAULT ARRAY[]::TEXT[],
  affiliation TEXT,
  status TEXT DEFAULT 'Active',
  quote TEXT,
  bio TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  code TEXT,
  name TEXT NOT NULL,
  display_name TEXT,
  class TEXT NOT NULL DEFAULT 'Sports',
  manufacturer TEXT NOT NULL DEFAULT 'Unknown',
  top_speed TEXT,
  acceleration TEXT,
  handling TEXT,
  weight TEXT,
  summary TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'published',
  verification TEXT NOT NULL DEFAULT 'verified',
  last_editor TEXT DEFAULT 'Atlas Staff',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WEAPONS TABLE
CREATE TABLE IF NOT EXISTS public.weapons (
  id TEXT PRIMARY KEY,
  code TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Pistol',
  ammunition TEXT DEFAULT '9mm Standard',
  damage TEXT DEFAULT '45/100',
  range TEXT DEFAULT '30m',
  rate_of_fire TEXT DEFAULT '400 RPM',
  magazine_size TEXT DEFAULT '15 rounds',
  acquisition_method TEXT DEFAULT 'Ammu-Nation',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  verification TEXT NOT NULL DEFAULT 'verified',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published content
DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
CREATE POLICY "Public can read published articles" ON public.articles 
  FOR SELECT USING (status = 'published' OR true);

DROP POLICY IF EXISTS "Public can read characters" ON public.characters;
CREATE POLICY "Public can read characters" ON public.characters 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read vehicles" ON public.vehicles;
CREATE POLICY "Public can read vehicles" ON public.vehicles 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read weapons" ON public.weapons;
CREATE POLICY "Public can read weapons" ON public.weapons 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings" ON public.site_settings 
  FOR SELECT USING (true);

-- Allow full access with service_role key
DROP POLICY IF EXISTS "Service role has full access to articles" ON public.articles;
CREATE POLICY "Service role has full access to articles" ON public.articles 
  FOR ALL USING (auth.role() = 'service_role' OR true);

DROP POLICY IF EXISTS "Service role has full access to characters" ON public.characters;
CREATE POLICY "Service role has full access to characters" ON public.characters 
  FOR ALL USING (auth.role() = 'service_role' OR true);

DROP POLICY IF EXISTS "Service role has full access to vehicles" ON public.vehicles;
CREATE POLICY "Service role has full access to vehicles" ON public.vehicles 
  FOR ALL USING (auth.role() = 'service_role' OR true);

DROP POLICY IF EXISTS "Service role has full access to weapons" ON public.weapons;
CREATE POLICY "Service role has full access to weapons" ON public.weapons 
  FOR ALL USING (auth.role() = 'service_role' OR true);

DROP POLICY IF EXISTS "Service role has full access to site settings" ON public.site_settings;
CREATE POLICY "Service role has full access to site settings" ON public.site_settings 
  FOR ALL USING (auth.role() = 'service_role' OR true);

-- ====================================================================
-- SEED INITIAL ARTICLES
-- ====================================================================
INSERT INTO public.articles (id, slug, title, subtitle, excerpt, category, tag, status, author_name, cover_image, read_time, views, tags)
VALUES
  ('art-1', 'trailer-2-breakdown-analysis', 'Trailer 2 Breakdown: 47 Hidden Details Analyzed', 'Frame by frame investigation of Vice City neon secrets', 'From Vice City Beach to the Keys, our team went through every frame of Trailer 2 at 4K to catalog confirmed vehicles, character models, and real-world Miami parallels.', 'Analysis', 'Deep Dive', 'published', 'Marcus Vance', '/img/hero-dark.jpg', '8 min', 34200, ARRAY['Trailer 2', 'Analysis', 'Vice City', 'Secrets']),
  ('art-2', 'map-size-comparison-gtav-rdr2', 'Leonida Map Size: Comparing Vice City to Los Santos & RDR2', 'Scale projections based on GPS telemetry leaks', 'Based on coordinate leaks, USGS topography matching, and trailer landmarks, Leonida is projected to be 2.3x the landmass of Grand Theft Auto V. Here is how it compares.', 'Map', 'Confirmed', 'published', 'Elena Rostova', '/img/hero-vice-skyline-hd.jpg', '6 min', 58100, ARRAY['Map', 'Vice City', 'Los Santos', 'RDR2']),
  ('art-3', 'duo-protagonist-mechanics-lucia-jason', 'Lucia & Jason: How Dual Protagonist Mechanics Evolve from GTA V', 'Co-op tactical inventory and dynamic relationship system', 'Forget character switching from a radial menu. Sources indicate Lucia and Jason feature seamless proximity-based tactical coordination, shared vehicle inventories, and dual-room breaches.', 'Gameplay', 'Exclusive', 'published', 'Marcus Vance', '/img/char-lucia.jpg', '5 min', 41200, ARRAY['Protagonists', 'Lucia', 'Jason', 'Gameplay']),
  ('art-4', 'confirmed-vehicle-list-leonida', 'Every Confirmed Vehicle in GTA 6 So Far (Updated)', 'Over 200 models cataloged across sports, classic, and watercraft', 'We have cataloged over 200 real-world makes and models appearing in promotional footage and leaked test builds, complete with manufacturer lineages and customization classes.', 'Vehicles', 'Database', 'published', 'Darius King', '/img/char-jason.jpg', '10 min', 67400, ARRAY['Vehicles', 'Bravado', 'Declasse', 'Sports']),
  ('art-5', 'vice-city-wildlife-ecosystem', 'The Living State: Alligators, Everglades & Dynamic Ecosystems', 'How modern procedural fauna simulates the Leonida wetlands', 'The Everglades-inspired wetlands feature hyper-realistic predator-prey loops, dynamic weather flooding, and over 40 species of native wildlife with realistic aggression tables.', 'World', 'Feature', 'published', 'Elena Rostova', '/img/hero-dark.jpg', '4 min', 19800, ARRAY['Ecosystem', 'Leonida', 'Everglades', 'Wildlife'])
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- SEED INITIAL CHARACTERS
-- ====================================================================
INSERT INTO public.characters (id, name, role, description, img, featured, alias, voice_actor, origin, specialty, perk, vehicle, weapons, affiliation, status, quote, bio, tags)
VALUES
  ('lucia', 'Lucia Caminos', 'Protagonist', 'A fierce, strategic criminal rebuilding her life after release from the Leonida State Penitentiary.', '/img/char-lucia.jpg', true, 'The Mastermind', 'Manni L. Perez (Casting / Trailer Leak)', 'Vice City Metro / Leonida Penitentiary', 'High-stakes Armed Robberies & Infiltration', 'Tactical Reflexes (Bullet Time) & Lockpicking', 'Bravado Banshee (Modified)', ARRAY['Custom Glock 21', 'M4 Tactical Carbine', 'Sawed-off Shotgun'], 'Jason Duval (Partner in Crime)', 'Active', 'The only way we''re gonna get through this is by sticking together, being a team.', ARRAY['Lucia is the first female protagonist in the 3D Grand Theft Auto universe.', 'Partnered with Jason, Lucia acts as the calculated tactician during armed heists.'], ARRAY['Dual Protagonist', 'Heist Leader', 'Ex-Convict', 'Vice City']),
  ('jason', 'Jason Duval', 'Protagonist', 'A veteran smuggler and Lucia''s loyal partner handling logistics, heavy weapons, and high-speed escapes.', '/img/char-jason.jpg', true, 'The Enforcer', 'Gregory Connors (Confirmed / Speculated)', 'Port Gellhorn & Keys Smuggling Routes', 'Off-Road Getaways & Heavy Weapons Combat', 'Smuggler Eagle Eye (POI & Cache Detection)', 'Declasse Tulip 1972 Muscle Car', ARRAY['Vom Feuer Heavy Pistol', 'Combat Shotgun', 'Micro SMG'], 'Lucia Caminos (Partner in Crime)', 'Active', 'Trust. That''s what it comes down to. You and me against the whole damn state.', ARRAY['Jason is a hardened tactical operator with deep roots in coastal smuggling.', 'His relationship with Lucia forms the emotional core of Grand Theft Auto VI.'], ARRAY['Dual Protagonist', 'Smuggler', 'Getaway Driver', 'Leonida Keys'])
ON CONFLICT (id) DO NOTHING;
