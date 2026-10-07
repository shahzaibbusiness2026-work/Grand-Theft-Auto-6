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
import { ALL_RANKING_SLUGS } from "@/lib/rankings";

export const dynamic = "force-dynamic";

/**
 * DB/CMS-driven sitemap:
 *  - base URL comes from the admin SEO settings (canonicalBaseUrl)
 *  - published articles are included with their real published dates
 *  - canonical catalog routes stay static (they are code-defined content)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeoSettings();
  const baseUrl = seo.canonicalBaseUrl?.startsWith("http")
    ? seo.canonicalBaseUrl
    : "https://gta6atlas.com";

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
    "/ai",
    "/pricing",
    "/characters",
    "/radio",
    "/cheats",
    "/guides",
    "/news",
    "/blog",
    "/database/vehicles",
    "/database/weapons",
    "/rankings",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
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

  // Dynamic Vehicle Routes
  const vehicleRoutes = canonicalVehicles.map((v) => ({
    url: `${baseUrl}/vehicles/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Weapon Routes
  const weaponRoutes = canonicalWeapons.map((w) => ({
    url: `${baseUrl}/weapons/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Mission Routes
  const missionRoutes = canonicalMissions.map((m) => ({
    url: `${baseUrl}/missions/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Location Routes
  const locationRoutes = canonicalLocations.map((l) => ({
    url: `${baseUrl}/locations/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Property Routes
  const propertyRoutes = canonicalProperties.map((p) => ({
    url: `${baseUrl}/properties/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Collectible Routes
  const collectibleRoutes = canonicalCollectibles.map((c) => ({
    url: `${baseUrl}/collectibles/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Auto-generated ranking pages
  const rankingRoutes = ALL_RANKING_SLUGS.map((slug) => ({
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
