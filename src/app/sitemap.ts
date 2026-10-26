import { MetadataRoute } from "next";
import {
  canonicalVehicles,
  canonicalWeapons,
  canonicalMissions,
  canonicalLocations,
  canonicalProperties,
  canonicalCollectibles,
} from "@/lib/canonical-data";
import { getSeoSettings } from "@/lib/services/seo";
import { getPublicArticles } from "@/lib/services/articles";
import { getLiveRankingSlugs } from "@/lib/rankings";
import { getMergedVehicles, getMergedWeapons } from "@/lib/services/catalog";

/**
 * Revalidate at most once per hour: this keeps the sitemap fresh (new
 * articles published directly to Supabase by the daily cron show up
 * automatically) without re-rendering on every single request.
 */
export const revalidate = 3600;

/**
 * DB/CMS-driven sitemap:
 *  - base URL comes from the admin SEO settings (canonicalBaseUrl)
 *  - published articles are included with their real published dates
 *  - canonical catalog routes stay static (they are code-defined content)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeoSettings();
  // Prefer admin-set URL, but ignore the stale gta6atlas.com default (parked domain)
  const adminUrl = seo.canonicalBaseUrl?.startsWith("http") && !seo.canonicalBaseUrl.includes("gta6atlas.com")
    ? seo.canonicalBaseUrl
    : null;
  // Priority: admin-set canonical → NEXT_PUBLIC_SITE_URL → stable Vercel
  // alias. The deployment-specific VERCEL_URL is deliberately NOT used —
  // it changes on every redeploy and would make sitemap URLs drift.
  const baseUrl = adminUrl
    || process.env.NEXT_PUBLIC_SITE_URL
    || "https://www.taishgaming.com";

  // Core Static Routes
  const staticRoutes = [
    "",
    "/map",
    "/map-explorer",
    "/vehicles",
    "/compare/vehicles",
    "/missions",
    "/weapons",
    "/compare/weapons",
    "/tracker",
    "/collectibles",
    "/locations",
    "/properties",
    "/tools",
    "/tools/money-calculator",
    "/tools/business-profit-calculator",
    "/tools/money-maker",
    "/tools/loadout-builder",
    "/tools/vehicle-upgrade-calculator",
    "/tools/wanted-level-guide",
    "/tools/map-distance-calculator",
    "/tools/day-night-converter",
    "/tools/business-income-calculator",
    "/tools/heist-payout-splitter",
    "/tools/character-quiz",
    "/tools/countdown-widget",
    "/tools/photo-spot-finder",
    "/tools/weapon-dps-calculator",
    "/tools/garage-planner",
    "/site-map",
    "/pricing",
    "/characters",
    "/radio",
    "/guides",
    "/news",
    "/blog",
    "/database/vehicles",
    "/database/weapons",
    "/rankings",
    "/achievements",
    "/activities",
    "/easter-eggs",
    "/businesses",
    "/money-guide",
    "/settings-guide",
    "/controls",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/cookies",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Published CMS articles (respects excludeDraftsAndArchived — the public
  // query already filters to status = "published").
  let articleRoutes: MetadataRoute.Sitemap = [];
  if (seo.excludeDraftsAndArchived !== false) {
    try {
      const articles = await getPublicArticles();
      articleRoutes = articles
        .filter((a) => a.slug)
        .map((a) => {
          // Use the article's real publish date when it parses; display dates
          // are "Jan 5, 2026"-style strings, which Date() understands.
          const published = a.date ? new Date(a.date) : null;
          return {
            url: `${baseUrl}/news/${a.slug}`,
            lastModified: published && !Number.isNaN(published.getTime()) ? published : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          };
        });
    } catch {
      // Sitemap still ships without articles if the DB is unreachable
    }
  }

  // Dynamic entity routes — index-ready gate: Rumored and Speculation
  // pages stay crawlable through the hubs but are kept out of the sitemap,
  // so search engines prioritize the better-evidenced pages.
  // Dynamic Vehicle Routes
  const vehicleRoutes = canonicalVehicles
    .filter((v) => v.confidence !== "RUMORED" && v.confidence !== "SPECULATION")
    .map((v) => ({
    url: `${baseUrl}/vehicles/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Weapon Routes
  const weaponRoutes = canonicalWeapons
    .filter((w) => w.confidence !== "RUMORED" && w.confidence !== "SPECULATION")
    .map((w) => ({
    url: `${baseUrl}/weapons/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Mission Routes
  const missionRoutes = canonicalMissions
    .filter((m) => m.confidence !== "RUMORED" && m.confidence !== "SPECULATION")
    .map((m) => ({
    url: `${baseUrl}/missions/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Location Routes
  const locationRoutes = canonicalLocations
    .filter((l) => l.confidence !== "RUMORED" && l.confidence !== "SPECULATION")
    .map((l) => ({
    url: `${baseUrl}/locations/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Property Routes
  const propertyRoutes = canonicalProperties
    .filter((p) => p.confidence !== "RUMORED" && p.confidence !== "SPECULATION")
    .map((p) => ({
    url: `${baseUrl}/properties/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Collectible Routes
  const collectibleRoutes = canonicalCollectibles
    .filter((c) => c.confidence !== "RUMORED" && c.confidence !== "SPECULATION")
    .map((c) => ({
    url: `${baseUrl}/collectibles/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Auto-generated ranking pages — only rankings with entries, so the
  // sitemap never points at a page that 404s (e.g. best-weaponized today).
  const [liveVehicles, liveWeapons] = await Promise.all([getMergedVehicles(), getMergedWeapons()]);
  const rankingRoutes = getLiveRankingSlugs(liveVehicles, liveWeapons).map((slug) => ({
    url: `${baseUrl}/rankings/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...vehicleRoutes,
    ...weaponRoutes,
    ...missionRoutes,
    ...locationRoutes,
    ...propertyRoutes,
    ...collectibleRoutes,
    ...rankingRoutes,
  ];
}
