-- ====================================================================
-- GTA 6 Atlas — CONTENT & SEO UPGRADE (03)
-- Run this in the Supabase SQL Editor AFTER 01_schema_v2_upgrade.sql.
-- Idempotent: safe to run multiple times.
--
-- What this does:
--   1. Adds per-article CMS/SEO columns used by the article editor:
--      seo_title, seo_description, canonical_url, og_image
--   2. Seeds the protagonist roster into the database so the characters
--      table is the single source of truth for the public site and the
--      admin Characters manager. (The full 12-character roster is seeded
--      by scripts/seed-characters.mjs — already applied.)
--   3. Adds Supabase Storage policies for the public `media` bucket
--      (public reads; writes stay service-role only, which bypasses RLS).
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. ARTICLE SEO / CMS COLUMNS
-- --------------------------------------------------------------------
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS og_image TEXT;

-- --------------------------------------------------------------------
-- 2. SEED PROTAGONISTS (skipped automatically if the rows exist)
-- --------------------------------------------------------------------
INSERT INTO public.characters
  (id, name, role, description, img, featured, alias, voice_actor, origin, specialty, perk, vehicle, weapons, affiliation, status, quote, bio, tags)
VALUES
  ('lucia', 'Lucia Caminos', 'Protagonist',
   'A fierce, strategic criminal rebuilding her life after release from the Leonida State Penitentiary.',
   '/img/char-lucia.jpg', true, 'The Mastermind', 'Manni L. Perez (Casting / Trailer Leak)',
   'Vice City Metro / Leonida Penitentiary', 'High-stakes Armed Robberies & Infiltration',
   'Tactical Reflexes (Bullet Time) & Lockpicking', 'Bravado Banshee (Modified)',
   ARRAY['Custom Glock 21', 'M4 Tactical Carbine', 'Sawed-off Shotgun'],
   'Jason Duval (Partner in Crime)', 'Active',
   'The only way we''re gonna get through this is by sticking together, being a team.',
   ARRAY['Lucia is the first female protagonist in the 3D Grand Theft Auto universe. Emerging from the Leonida State Penitentiary under supervised release, she immediately seeks to reclaim autonomy in a state fueled by greed, corruption, and social media excess.',
         'Partnered with Jason, Lucia acts as the calculated tactician during armed heists, balancing high-risk convenience store raids with coordinated bank vault infiltrations across Vice City.'],
   ARRAY['Dual Protagonist', 'Heist Leader', 'Ex-Convict', 'Vice City']),
  ('jason', 'Jason Duval', 'Protagonist',
   'A veteran smuggler and Lucia''s loyal partner handling logistics, heavy weapons, and high-speed escapes.',
   '/img/char-jason.jpg', true, 'The Enforcer', 'Gregory Connors (Confirmed / Speculated)',
   'Port Gellhorn & Keys Smuggling Routes', 'Off-Road Getaways & Heavy Weapons Combat',
   'Smuggler Eagle Eye (POI & Cache Detection)', 'Declasse Tulip 1972 Muscle Car',
   ARRAY['Vom Feuer Heavy Pistol', 'Combat Shotgun', 'Micro SMG'],
   'Lucia Caminos (Partner in Crime)', 'Active',
   'Trust. That''s what it comes down to. You and me against the whole damn state.',
   ARRAY['Jason is a hardened tactical operator with deep roots in the coastal and off-road smuggling corridors of the Leonida Keys and Port Gellhorn.',
         'His relationship with Lucia forms the emotional and operational core of Grand Theft Auto VI, navigating criminal syndicates, corrupt federal agencies, and ruthless competitors.'],
   ARRAY['Dual Protagonist', 'Smuggler', 'Getaway Driver', 'Leonida Keys']),
  ('cal', 'Cal Hampton', 'Antagonist',
   'A ruthless real estate magnate and corporate predator buying up distressed waterfront properties across Leonida.',
   '/img/char-cal.jpg', true, 'The Developer', 'Rockstar Ensemble Cast',
   'Biscayne Bay & Vice City Financial District', 'Hostile Takeovers & Private Security Contracts',
   'Political Immunity & Paramilitary Enforcers', 'Enus Jubilee Luxury SUV',
   ARRAY['Concealed Snub-nose .38', 'Contract Bodyguards'],
   'Hampton Financial Holdings', 'Active',
   'Every inch of this coastline has a price tag. Some people just don''t know when to cash out.',
   ARRAY['Cal Hampton represents the ruthless hyper-capitalist machine dominating modern Vice City. Through predatory zoning, intimidation, and shell companies, Hampton is reshaping Leonida''s shoreline.',
         'His financial empire frequently collides with street syndicates and independent operators who refuse to surrender valuable waterfront turf.'],
   ARRAY['Antagonist', 'Billionaire', 'Corporate Crime', 'Biscayne Bay'])
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 3. STORAGE POLICIES for the public `media` bucket
--    (bucket is created by 01_schema_v2_upgrade.sql)
-- --------------------------------------------------------------------
-- Public downloads of media objects
DROP POLICY IF EXISTS "Public can read media bucket objects" ON storage.objects;
CREATE POLICY "Public can read media bucket objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Writes (upload/update/delete) intentionally have NO anon/authenticated
-- policy — the app writes with the service_role key, which bypasses RLS.
-- If you later want authenticated browser uploads, add a policy scoped to
-- authenticated users only.

-- --------------------------------------------------------------------
-- DONE. Verify with:
--   SELECT column_name FROM information_schema.columns
--    WHERE table_name = 'articles'
--      AND column_name IN ('seo_title','seo_description','canonical_url','og_image');
-- --------------------------------------------------------------------
