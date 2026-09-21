import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { articles as fallbackArticles } from "@/lib/data";
import type { DatabaseArticleRow } from "@/lib/services/articles";

// Revalidate cache every 60 seconds for near-real-time data
export const revalidate = 60;

/**
 * GET /api/dashboard/stats
 * Returns live counts and latest articles for the dashboard.
 * Uses anon key (public read) — no auth required.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Parallel queries for all counts + latest articles
    const [vehiclesRes, weaponsRes, charsRes, articlesRes, markersRes, latestRes] =
      await Promise.allSettled([
        supabase
          .from("vehicles")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),
        supabase
          .from("weapons")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),
        supabase
          .from("characters")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("articles")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),
        supabase
          .from("map_markers")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("articles")
          .select("id, title, excerpt, published_at, cover_image, read_time, tag, category, tags")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3),
      ]);

    const totalVehicles =
      vehiclesRes.status === "fulfilled" ? (vehiclesRes.value.count ?? 0) : 0;
    const totalWeapons =
      weaponsRes.status === "fulfilled" ? (weaponsRes.value.count ?? 0) : 0;
    const totalCharacters =
      charsRes.status === "fulfilled" ? (charsRes.value.count ?? 0) : 0;
    const totalArticles =
      articlesRes.status === "fulfilled" ? (articlesRes.value.count ?? 0) : 0;
    const totalMapMarkers =
      markersRes.status === "fulfilled" ? (markersRes.value.count ?? 0) : 0;

    // Map DB rows to Article shape
    let latestArticles = fallbackArticles.slice(0, 3);
    if (
      latestRes.status === "fulfilled" &&
      !latestRes.value.error &&
      latestRes.value.data?.length
    ) {
      latestArticles = (latestRes.value.data as DatabaseArticleRow[]).map((row) => ({
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

    return NextResponse.json({
      totalVehicles,
      totalWeapons,
      totalCharacters,
      totalArticles,
      totalMapMarkers,
      latestArticles,
    });
  } catch (err) {
    console.error("[/api/dashboard/stats] Error:", err);
    // Return graceful fallback so the dashboard never shows an error state
    return NextResponse.json({
      totalVehicles: 0,
      totalWeapons: 0,
      totalCharacters: 0,
      totalArticles: 0,
      totalMapMarkers: 0,
      latestArticles: fallbackArticles.slice(0, 3),
    });
  }
}
