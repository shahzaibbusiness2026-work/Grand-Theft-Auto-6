"use server";

/**
 * queries.ts — Server-side query aggregator.
 * Provides wrapper functions that delegate to individual service modules,
 * plus cross-cutting queries like getDashboardStats.
 *
 * "use server" files cannot use re-export syntax (export { x } from 'y').
 * Instead we define wrapper async functions that call through.
 *
 * All exports are server-only. Never import from client components.
 */

import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { articles as fallbackArticles, Article, Character, Vehicle } from "@/lib/data";
import { AdminWeapon } from "@/lib/admin-store";
import { getPublicArticles as _getPublicArticles } from "./articles";
import { getPublicCharacters as _getPublicCharacters } from "./characters";
import { getPublicVehicles as _getPublicVehicles } from "./vehicles";
import { getPublicWeapons as _getPublicWeapons } from "./weapons";
import { getSiteSettings as _getSiteSettings } from "./settings";
import type { DatabaseArticleRow } from "./articles";
import type { ComprehensiveSiteSettings } from "./settings";

/* ------------------------------------------------------------------ */
/* PUBLIC QUERY WRAPPERS (maintains backwards compat with all pages)   */
/* ------------------------------------------------------------------ */

/** Fetch published articles for public frontend */
export async function getPublicArticles(): Promise<Article[]> {
  return _getPublicArticles();
}

/** Fetch all characters for public frontend */
export async function getPublicCharacters(): Promise<Character[]> {
  return _getPublicCharacters();
}

/** Fetch published vehicles for public frontend */
export async function getPublicVehicles(): Promise<Vehicle[]> {
  return _getPublicVehicles();
}

/** Fetch published weapons for public frontend */
export async function getPublicWeapons(): Promise<AdminWeapon[]> {
  return _getPublicWeapons();
}

/** Fetch site settings from Supabase with fallback */
export async function getSiteSettings(): Promise<ComprehensiveSiteSettings> {
  return _getSiteSettings();
}

/* ------------------------------------------------------------------ */
import { getLocations, LocationRecord } from "./locations";
import { getMissions, MissionRecord } from "./missions";

/* ------------------------------------------------------------------ */
/* DASHBOARD STATS QUERY                                               */
/* ------------------------------------------------------------------ */
export interface DashboardVehicleItem {
  id: string;
  name: string;
  class: string;
  topSpeed: string;
  acceleration?: string;
  priceDisplay: string;
  img: string;
  manufacturer?: string;
}

export interface DashboardWeaponItem {
  id: string;
  name: string;
  category: string;
  damage: string;
  range?: string;
  acquisitionMethod: string;
  priceDisplay?: string;
  rarity?: string;
  attachments?: string[];
}

export interface DashboardStats {
  totalVehicles: number;
  totalWeapons: number;
  totalCharacters: number;
  totalArticles: number;
  totalMapMarkers: number;
  totalLocations: number;
  totalMissions: number;
  latestArticles: Article[];
  featuredVehicles: DashboardVehicleItem[];
  featuredWeapons: DashboardWeaponItem[];
  featuredLocations: LocationRecord[];
  activeMission?: MissionRecord | null;
}

/**
 * Fetch aggregated stats + latest articles + live vehicles, weapons, locations for Dashboard.
 * Uses anon key (public read) — safe for SSR without auth.
 * All queries run in parallel via Promise.allSettled for performance.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const defaults: DashboardStats = {
    totalVehicles: 0,
    totalWeapons: 0,
    totalCharacters: 0,
    totalArticles: 0,
    totalMapMarkers: 0,
    totalLocations: 0,
    totalMissions: 0,
    latestArticles: fallbackArticles.slice(0, 3),
    featuredVehicles: [],
    featuredWeapons: [],
    featuredLocations: [],
    activeMission: null,
  };

  try {
    const supabase = await createServerSupabase();

    // Run all count and data queries in parallel for performance
    const [
      vehiclesCountRes,
      weaponsCountRes,
      charsRes,
      articlesRes,
      markersRes,
      latestRes,
      locsRes,
      missRes,
      vehiclesDataRes,
      weaponsDataRes,
    ] = await Promise.allSettled([
      supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("weapons").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("characters").select("id", { count: "exact", head: true }),
      supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("map_markers").select("id", { count: "exact", head: true }),
      supabase
        .from("articles")
        .select("title, slug, excerpt, published_at, cover_image, read_time, tag, category")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3),
      getLocations(),
      getMissions(),
      supabase
        .from("vehicles")
        .select("id, name, class, top_speed, acceleration, price_display, images, manufacturer")
        .eq("status", "published")
        .order("created_at", { ascending: true })
        .limit(4),
      supabase
        .from("weapons")
        .select("id, name, category, damage, range, acquisition_method, price_display, rarity, attachments")
        .eq("status", "published")
        .order("created_at", { ascending: true })
        .limit(4),
    ]);

    const stats: DashboardStats = {
      totalVehicles: vehiclesCountRes.status === "fulfilled" ? (vehiclesCountRes.value.count ?? 0) : 0,
      totalWeapons: weaponsCountRes.status === "fulfilled" ? (weaponsCountRes.value.count ?? 0) : 0,
      totalCharacters: charsRes.status === "fulfilled" ? (charsRes.value.count ?? 0) : 0,
      totalArticles: articlesRes.status === "fulfilled" ? (articlesRes.value.count ?? 0) : 0,
      totalMapMarkers: markersRes.status === "fulfilled" ? (markersRes.value.count ?? 0) : 0,
      totalLocations: locsRes.status === "fulfilled" ? locsRes.value.length : 0,
      totalMissions: missRes.status === "fulfilled" ? missRes.value.length : 0,
      latestArticles: defaults.latestArticles,
      featuredVehicles: [],
      featuredWeapons: [],
      featuredLocations: locsRes.status === "fulfilled" ? locsRes.value.slice(0, 4) : [],
      activeMission: missRes.status === "fulfilled" && missRes.value.length > 0 ? missRes.value[0] : null,
    };

    // Map live vehicles
    if (vehiclesDataRes.status === "fulfilled" && vehiclesDataRes.value.data) {
      stats.featuredVehicles = vehiclesDataRes.value.data.map(
        (row: {
          id: string;
          name: string;
          class?: string;
          top_speed?: string;
          acceleration?: string;
          price_display?: string;
          images?: string[];
          manufacturer?: string;
        }) => ({
          id: row.id,
          name: row.name,
          class: row.class || "Sports",
          topSpeed: row.top_speed || "180 mph",
          acceleration: row.acceleration || "3.5s",
          priceDisplay: row.price_display || "$150,000",
          img: Array.isArray(row.images) && row.images[0] ? row.images[0] : "/img/car-purple.jpg",
          manufacturer: row.manufacturer || "Grotti",
        })
      );
    }

    // Map live weapons
    if (weaponsDataRes.status === "fulfilled" && weaponsDataRes.value.data) {
      stats.featuredWeapons = weaponsDataRes.value.data.map(
        (row: {
          id: string;
          name: string;
          category?: string;
          damage?: string;
          range?: string;
          acquisition_method?: string;
          price_display?: string;
          rarity?: string;
          attachments?: string[];
        }) => ({
          id: row.id,
          name: row.name,
          category: row.category || "Assault Rifle",
          damage: row.damage || "60/100",
          range: row.range || "65m",
          acquisitionMethod: row.acquisition_method || "Ammu-Nation",
          priceDisplay: row.price_display || "$10,000",
          rarity: row.rarity || "Common",
          attachments: Array.isArray(row.attachments) ? row.attachments : [],
        })
      );
    }

    // Map latest articles to the Article type
    if (latestRes.status === "fulfilled" && !latestRes.value.error && latestRes.value.data?.length) {
      stats.latestArticles = (latestRes.value.data as DatabaseArticleRow[]).map((row) => ({
        title: row.title,
        excerpt: row.excerpt,
        date: row.published_at
          ? new Date(row.published_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recent",
        read: row.read_time || "4 min read",
        img: row.cover_image || "/img/hero-dark.jpg",
        tag: row.tag || row.category || "News",
        slug: row.slug,
        category: row.category,
      }));
    }

    return stats;
  } catch {
    // Return defaults on any error — dashboard never shows error state
    return defaults;
  }
}
