-- ====================================================================
-- GTA 6 Atlas — RLS Security Fix
-- Run this in your Supabase SQL Editor AFTER schema.sql
-- Fixes the critical "OR true" vulnerability that disabled RLS entirely.
-- ====================================================================

-- ====================================================================
-- ARTICLES: Public SELECT, service_role-only writes
-- ====================================================================
DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
CREATE POLICY "Public can read published articles" ON public.articles
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Service role has full access to articles" ON public.articles;
CREATE POLICY "Service role can insert articles" ON public.articles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update articles" ON public.articles
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete articles" ON public.articles
  FOR DELETE USING (auth.role() = 'service_role');

-- ====================================================================
-- CHARACTERS: Public SELECT, service_role-only writes
-- ====================================================================
DROP POLICY IF EXISTS "Public can read characters" ON public.characters;
CREATE POLICY "Public can read characters" ON public.characters
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to characters" ON public.characters;
CREATE POLICY "Service role can insert characters" ON public.characters
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update characters" ON public.characters
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete characters" ON public.characters
  FOR DELETE USING (auth.role() = 'service_role');

-- ====================================================================
-- VEHICLES: Public SELECT, service_role-only writes
-- ====================================================================
DROP POLICY IF EXISTS "Public can read vehicles" ON public.vehicles;
CREATE POLICY "Public can read vehicles" ON public.vehicles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to vehicles" ON public.vehicles;
CREATE POLICY "Service role can insert vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update vehicles" ON public.vehicles
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete vehicles" ON public.vehicles
  FOR DELETE USING (auth.role() = 'service_role');

-- ====================================================================
-- WEAPONS: Public SELECT, service_role-only writes
-- ====================================================================
DROP POLICY IF EXISTS "Public can read weapons" ON public.weapons;
CREATE POLICY "Public can read weapons" ON public.weapons
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to weapons" ON public.weapons;
CREATE POLICY "Service role can insert weapons" ON public.weapons
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update weapons" ON public.weapons
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete weapons" ON public.weapons
  FOR DELETE USING (auth.role() = 'service_role');

-- ====================================================================
-- SITE SETTINGS: Public SELECT, service_role-only writes
-- ====================================================================
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to site settings" ON public.site_settings;
CREATE POLICY "Service role can insert site settings" ON public.site_settings
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update site settings" ON public.site_settings
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete site settings" ON public.site_settings
  FOR DELETE USING (auth.role() = 'service_role');

-- ====================================================================
-- MAP MARKERS: Public SELECT, service_role-only writes
-- ====================================================================
DROP POLICY IF EXISTS "Public can read map markers" ON public.map_markers;
CREATE POLICY "Public can read map markers" ON public.map_markers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to map markers" ON public.map_markers;
CREATE POLICY "Service role can insert map markers" ON public.map_markers
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update map markers" ON public.map_markers
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete map markers" ON public.map_markers
  FOR DELETE USING (auth.role() = 'service_role');

-- ====================================================================
-- SEO SETTINGS: Public SELECT, service_role-only writes
-- ====================================================================
DROP POLICY IF EXISTS "Public can read seo settings" ON public.seo_settings;
CREATE POLICY "Public can read seo settings" ON public.seo_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to seo settings" ON public.seo_settings;
CREATE POLICY "Service role can insert seo settings" ON public.seo_settings
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update seo settings" ON public.seo_settings
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete seo settings" ON public.seo_settings
  FOR DELETE USING (auth.role() = 'service_role');

-- ====================================================================
-- MISSIONS: Public SELECT, service_role-only writes
-- ====================================================================
DROP POLICY IF EXISTS "Public can read missions" ON public.missions;
CREATE POLICY "Public can read missions" ON public.missions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to missions" ON public.missions;
CREATE POLICY "Service role can insert missions" ON public.missions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update missions" ON public.missions
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete missions" ON public.missions
  FOR DELETE USING (auth.role() = 'service_role');

-- ====================================================================
-- LOCATIONS: Public SELECT, service_role-only writes
-- ====================================================================
DROP POLICY IF EXISTS "Public can read locations" ON public.locations;
CREATE POLICY "Public can read locations" ON public.locations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to locations" ON public.locations;
CREATE POLICY "Service role can insert locations" ON public.locations
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update locations" ON public.locations
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete locations" ON public.locations
  FOR DELETE USING (auth.role() = 'service_role');

-- ====================================================================
-- MEDIA ASSETS: Public SELECT, service_role-only writes
-- ====================================================================
DROP POLICY IF EXISTS "Public can read media assets" ON public.media_assets;
CREATE POLICY "Public can read media assets" ON public.media_assets
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to media assets" ON public.media_assets;
CREATE POLICY "Service role can insert media assets" ON public.media_assets
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update media assets" ON public.media_assets
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete media assets" ON public.media_assets
  FOR DELETE USING (auth.role() = 'service_role');
