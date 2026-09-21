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
/* DASHBOARD STATS QUERY                                               */
/* ------------------------------------------------------------------ */
export interface DashboardStats {
  totalVehicles: number;
  totalWeapons: number;
  totalCharacters: number;
  totalArticles: number;
  totalMapMarkers: number;
  latestArticles: Article[];
}

/**
 * Fetch aggregated stats + latest articles for the Dashboard page.
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
    latestArticles: fallbackArticles.slice(0, 3),
  };

  try {
    const supabase = await createServerSupabase();

    // Run all count queries in parallel for performance
    const [vehiclesRes, weaponsRes, charsRes, articlesRes, markersRes, latestRes] =
      await Promise.allSettled([
        supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("weapons").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("characters").select("id", { count: "exact", head: true }),
        supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("map_markers").select("id", { count: "exact", head: true }),
        supabase
          .from("articles")
          .select("title, excerpt, published_at, cover_image, read_time, tag, category")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3),
      ]);

    const stats: DashboardStats = {
      totalVehicles: vehiclesRes.status === "fulfilled" ? (vehiclesRes.value.count ?? 0) : 0,
      totalWeapons: weaponsRes.status === "fulfilled" ? (weaponsRes.value.count ?? 0) : 0,
      totalCharacters: charsRes.status === "fulfilled" ? (charsRes.value.count ?? 0) : 0,
      totalArticles: articlesRes.status === "fulfilled" ? (articlesRes.value.count ?? 0) : 0,
      totalMapMarkers: markersRes.status === "fulfilled" ? (markersRes.value.count ?? 0) : 0,
      latestArticles: defaults.latestArticles,
    };

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
      }));
    }

    return stats;
  } catch {
    // Return defaults on any error — dashboard never shows error state
    return defaults;
  }
}
