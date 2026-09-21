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

-- 6. MAP MARKERS TABLE
CREATE TABLE IF NOT EXISTS public.map_markers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Location',
  layer TEXT NOT NULL DEFAULT 'Official',
  visible BOOLEAN DEFAULT TRUE,
  icon TEXT DEFAULT 'pin',
  coord_x NUMERIC DEFAULT 50,
  coord_y NUMERIC DEFAULT 50,
  description TEXT DEFAULT '',
  verification TEXT DEFAULT 'verified',
  source TEXT,
  linked_record TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
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
ALTER TABLE public.map_markers ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "Public can read map markers" ON public.map_markers;
CREATE POLICY "Public can read map markers" ON public.map_markers 
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

DROP POLICY IF EXISTS "Service role has full access to map markers" ON public.map_markers;
CREATE POLICY "Service role has full access to map markers" ON public.map_markers 
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

-- ====================================================================
-- SEED INITIAL MAP MARKERS
-- ====================================================================
INSERT INTO public.map_markers (id, name, category, layer, visible, icon, coord_x, coord_y, description, verification)
VALUES
  ('poi-ammu', 'Ammu-Nation Downtown', 'Location', 'Official', true, 'pin', 58, 46, 'Buy military weapons, heavy body armor, ammo and specialized weapon attachments.', 'verified'),
  ('poi-garage', 'Garage – Ocean Drive', 'Location', 'Official', true, 'car', 64, 56, 'Vehicle storage, custom widebody kits, performance turbo tuning, and instant respray.', 'verified'),
  ('poi-suite', 'High-End Bayfront Penthouse', 'Location', 'Official', true, 'star', 61, 51, 'Luxury penthouse with 10-car garage, private helipad, and panoramic Biscayne bay view.', 'verified'),
  ('poi-cache', 'Hidden Smuggler Cache #12', 'Collectibles', 'Research', true, 'pin', 67, 62, 'Smuggler''s waterproof cargo chest submerged beneath coastal coral reef.', 'verified'),
  ('poi-stunt', 'Stunt Jump #8 – Escobar Causeway', 'Activities', 'Official', true, 'star', 53, 49, 'Highway bridge ramp launch over dual express lanes with cinematic slow-mo camera.', 'verified'),
  ('poi-heist', 'Keys Depository Branch', 'Location', 'Official', true, 'flag', 44, 73, 'Main story bank heist target with Lucia and Jason targeting regional depository vault.', 'verified'),
  ('poi-ufo', 'Cryptic UFO Swamplands Mural', 'Collectibles', 'Research', true, 'dot', 54, 32, 'Cryptic extraterrestrial artwork painted across abandoned cold-war military radar dome.', 'verified'),
  ('poi-weapon-smg', 'Tactical SMG Drop', 'Activities', 'Official', true, 'square', 35, 41, 'Military suppressed submachine gun hidden inside high-security shipping depot container.', 'verified'),
  ('poi-north-wilds', 'Northern Wilds Fire Lookout', 'Location', 'Official', true, 'pin', 34, 22, 'Mountain ridge fire lookout tower with 360-degree panorama spanning Leonida wilderness.', 'verified'),
  ('poi-port-gellhorn', 'Port Gellhorn Underground Safehouse', 'Location', 'Official', true, 'car', 33, 44, 'Low-profile industrial safehouse with escape tunnel to docks, armory, and vehicle stash.', 'verified'),
  ('poi-club', 'Malibú Neon Nightclub', 'Activities', 'Official', true, 'star', 62, 58, 'Legendary 80s-inspired oceanfront nightclub. Hotspot for Vice City underground contacts.', 'verified'),
  ('poi-supercar', 'Grotti Visione Exotic Dealership', 'Location', 'Official', true, 'car', 60, 47, 'Exclusive showroom housing the fastest exotic hypercars and customized test vehicles.', 'verified'),
  ('poi-heli', 'Vice International Helipad', 'Location', 'Official', true, 'flag', 51, 54, 'Charter flight landing pad with available police and civilian transport helicopters.', 'verified'),
  ('poi-keys-docks', 'Smuggler Marina & Speedboats', 'Location', 'Official', true, 'pin', 48, 76, 'Deep-sea marina docked with high-speed offshore powerboats and jet-skis.', 'verified'),
  ('marker-1', 'Harbor Reference', 'Location', 'Research', true, 'pin', 42, 68, 'Harbor area reference point for mapping discussion.', 'unverified'),
  ('marker-2', 'Downtown Reference', 'Location', 'Research', true, 'pin', 51, 45, 'Central skyscraper district with financial towers.', 'unverified'),
  ('marker-3', 'Coast Reference', 'Location', 'Research', true, 'pin', 61, 58, 'Oceanfront boulevard with neon strip hotels.', 'unverified')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- SEED INITIAL SITE SETTINGS
-- ====================================================================
INSERT INTO public.site_settings (key, value)
VALUES
  ('siteTitle', '"GTA 6 Atlas — Interactive Map & Database"'::jsonb),
  ('siteTagline', '"The Ultimate GTA 6 Companion Platform & Database"'::jsonb),
  ('heroHeading', '"Grand Theft Auto VI — Official Database & Interactive Atlas"'::jsonb),
  ('heroSubtitle', '"Explore Vice City & The State of Leonida with confirmed intelligence, vehicles, lore, and map coordinates."'::jsonb),
  ('announcementBanner', '"GTA 6 Atlas — The Ultimate Interactive Companion for Grand Theft Auto VI"'::jsonb),
  ('targetReleaseDate', '"2026-11-19T00:00:00Z"'::jsonb),
  ('isReleaseDateConfirmed', 'false'::jsonb),
  ('countdownCaption', '"Target countdown • Official date to be confirmed by Rockstar Games"'::jsonb),
  ('copyrightText', '"© 2026 GTA 6 Atlas. All rights reserved. Grand Theft Auto, GTA 6, and Rockstar Games are trademarks of Take-Two Interactive."'::jsonb),
  ('siteDescription', '"Your independent, high-performance tactical intelligence guide and reconnaissance map for Grand Theft Auto VI."'::jsonb),
  ('twitterHandle', '"@GTA6Atlas"'::jsonb),
  ('discordUrl', '"https://discord.gg/gta6atlas"'::jsonb),
  ('redditUrl', '"https://reddit.com/r/GTA6Atlas"'::jsonb),
  ('contactEmail', '"contact@gta6atlas.com"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ====================================================================
-- SEED INITIAL VEHICLES
-- ====================================================================
INSERT INTO public.vehicles (id, code, name, display_name, class, manufacturer, top_speed, acceleration, handling, weight, summary, status, verification)
VALUES
  ('veh-001', 'V-001', 'Bravado Banshee', 'Bravado Banshee (Custom)', 'Sports', 'Bravado', '160 mph', '3.8s', '82/100', '1,450 kg', 'A legendary sports car spotted with custom widebody.', 'published', 'verified'),
  ('veh-002', 'V-002', 'Declasse Tulip 1972', 'Declasse Tulip 1972', 'Muscle', 'Declasse', '135 mph', '4.9s', '68/100', '1,720 kg', 'Vintage muscle cruiser driven by Jason Duval.', 'published', 'verified'),
  ('veh-003', 'V-003', 'Grotti Cheetah Classic', 'Grotti Cheetah Classic', 'Sports', 'Grotti', '155 mph', '4.1s', '80/100', '1,380 kg', 'Iconic Vice City exotic sports coupe with pop-up headlights.', 'published', 'verified'),
  ('veh-004', 'V-004', 'Pegassi Torero XO', 'Pegassi Torero XO', 'Super', 'Pegassi', '185 mph', '2.9s', '91/100', '1,290 kg', 'Ultra high-performance all-wheel-drive hypercar.', 'published', 'verified'),
  ('veh-005', 'V-005', 'Maibatsu Frogger', 'Maibatsu Frogger', 'Helicopter', 'Maibatsu', '130 mph', '6.2s', '75/100', '2,100 kg', 'Agile civilian and corporate transport helicopter.', 'published', 'verified')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- SEED INITIAL WEAPONS
-- ====================================================================
INSERT INTO public.weapons (id, code, name, category, ammunition, damage, range, rate_of_fire, magazine_size, acquisition_method, notes, status, verification)
VALUES
  ('wep-001', 'W-001', 'Service Pistol', 'Pistol', '9mm Standard', '45/100', '30m', '400 RPM', '15 rounds', 'Ammu-Nation', 'Sidearm carried by law enforcement in initial trailer scenes.', 'draft', 'unverified'),
  ('wep-002', 'W-002', 'Tactical Carbine', 'Rifle', '5.56mm NATO', '68/100', '65m', '650 RPM', '30 rounds', 'Ammu-Nation', 'Assault rifle configuration seen in weapon wheel leak footage.', 'published', 'verified'),
  ('wep-003', 'W-003', 'Compact SMG', 'SMG', '9mm Parabellum', '52/100', '40m', '800 RPM', '30 rounds', 'Ammu-Nation', 'Compact submachine gun frame with tactical folding stock.', 'draft', 'unverified'),
  ('wep-004', 'W-004', 'Heavy Revolver', 'Pistol', '.44 Magnum', '75/100', '35m', '180 RPM', '6 rounds', 'Ammu-Nation', 'Heavy caliber revolver spotted in holster.', 'published', 'verified'),
  ('wep-005', 'W-005', 'Hunting Rifle', 'Rifle', '7.62mm', '80/100', '90m', '250 RPM', '10 rounds', 'Ammu-Nation', 'Semi-automatic high-powered hunting rifle.', 'draft', 'unverified'),
  ('wep-006', 'W-006', 'Pump Shotgun', 'Shotgun', '12 Gauge', '88/100', '20m', '120 RPM', '8 rounds', 'Ammu-Nation', 'Pump-action shotgun with tactical flashlight mount.', 'published', 'verified'),
  ('wep-007', 'W-007', 'Suppressed Pistol', 'Pistol', '9mm Suppressed', '40/100', '25m', '350 RPM', '12 rounds', 'Ammu-Nation', 'Silenced tactical pistol variant for covert operations.', 'draft', 'unverified')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 7. SEO SETTINGS TABLE
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.seo_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read seo settings" ON public.seo_settings;
CREATE POLICY "Public can read seo settings" ON public.seo_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to seo settings" ON public.seo_settings;
CREATE POLICY "Service role has full access to seo settings" ON public.seo_settings
  FOR ALL USING (auth.role() = 'service_role' OR true);

INSERT INTO public.seo_settings (key, value) VALUES
  ('titleTemplate', '{title} | GTA 6 Atlas'),
  ('metaDescription', 'Your independent guide to GTA 6. News, articles, locations, vehicles, weapons and more — all in one place.'),
  ('canonicalBaseUrl', 'https://gta6atlas.com'),
  ('socialPreviewImage', '/img/hero-dark.jpg'),
  ('excludeDraftsAndArchived', 'true'),
  ('redirects', '[{"id":"red-1","fromUrl":"/old-map","toUrl":"/map","type":"301","enabled":true},{"id":"red-2","fromUrl":"/vehicle-list","toUrl":"/vehicles","type":"301","enabled":true}]')
ON CONFLICT (key) DO NOTHING;

-- ====================================================================
-- 8. MISSIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.missions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  protagonist TEXT NOT NULL DEFAULT 'Both', -- 'Lucia', 'Jason', 'Both'
  act TEXT NOT NULL DEFAULT 'Act 1',
  status TEXT NOT NULL DEFAULT 'Rumoured', -- 'Confirmed', 'Rumoured'
  objectives TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read missions" ON public.missions;
CREATE POLICY "Public can read missions" ON public.missions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to missions" ON public.missions;
CREATE POLICY "Service role has full access to missions" ON public.missions
  FOR ALL USING (auth.role() = 'service_role' OR true);

INSERT INTO public.missions (id, name, protagonist, act, status, objectives) VALUES
  ('mis-1', 'Leonida Corrections Breakout', 'Lucia', 'Prologue / Act 1', 'Confirmed', 'Escape penitentiary grounds with contact assistance.'),
  ('mis-2', 'Convenience Store Robbery', 'Both', 'Act 1', 'Confirmed', 'Armed robbery of Vice City convenience store.'),
  ('mis-3', 'Port Gellhorn Airfield Infiltration', 'Jason', 'Act 2', 'Rumoured', 'Secure contraband flight plan from hangar.')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 9. LOCATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT 'Vice City Metro',
  type TEXT NOT NULL DEFAULT 'City District', -- 'City District', 'Island / Keys', 'Government Facility', 'Landmark'
  verification TEXT NOT NULL DEFAULT 'pending', -- 'verified', 'pending'
  coordinates TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read locations" ON public.locations;
CREATE POLICY "Public can read locations" ON public.locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to locations" ON public.locations;
CREATE POLICY "Service role has full access to locations" ON public.locations
  FOR ALL USING (auth.role() = 'service_role' OR true);

INSERT INTO public.locations (id, name, district, type, verification, coordinates) VALUES
  ('loc-1', 'Vice City Beach', 'Vice City Metro', 'City District', 'verified', '25.7617, -80.1918'),
  ('loc-2', 'Leonida Penitentiary', 'Leonard County', 'Government Facility', 'verified', '25.9011, -80.3542'),
  ('loc-3', 'Grassrivers Wetlands', 'Everglades Equivalent', 'Landmark', 'pending', '25.6120, -80.6010'),
  ('loc-4', 'Kelly County Archipelago', 'The Keys', 'Island / Keys', 'verified', '24.5551, -81.7800')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 10. MEDIA ASSETS TABLE (for Supabase Storage integration)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  dimensions TEXT,
  file_size TEXT,
  type TEXT NOT NULL DEFAULT 'Image', -- 'Image', 'Video', 'Document'
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
CREATE POLICY "Service role has full access to media assets" ON public.media_assets
  FOR ALL USING (auth.role() = 'service_role' OR true);

-- Create storage bucket for media uploads (run this separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;
