import { MetadataRoute } from "next";
import {
  canonicalVehicles,
  canonicalWeapons,
  canonicalMissions,
  canonicalLocations,
  canonicalProperties,
  canonicalCollectibles,
} from "@/lib/canonical-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gta6atlas.com";
  const lastUpdated = new Date("2026-09-13T00:00:00Z");

  // Core Static Routes
  const staticRoutes = [
    "",
    "/map",
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
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastUpdated,
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic Vehicle Routes
  const vehicleRoutes = canonicalVehicles.map((v) => ({
    url: `${baseUrl}/vehicles/${v.slug}`,
    lastModified: lastUpdated,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Weapon Routes
  const weaponRoutes = canonicalWeapons.map((w) => ({
    url: `${baseUrl}/weapons/${w.slug}`,
    lastModified: lastUpdated,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Mission Routes
  const missionRoutes = canonicalMissions.map((m) => ({
    url: `${baseUrl}/missions/${m.slug}`,
    lastModified: lastUpdated,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Location Routes
  const locationRoutes = canonicalLocations.map((l) => ({
    url: `${baseUrl}/locations/${l.slug}`,
    lastModified: lastUpdated,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Property Routes
  const propertyRoutes = canonicalProperties.map((p) => ({
    url: `${baseUrl}/properties/${p.slug}`,
    lastModified: lastUpdated,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Collectible Routes
  const collectibleRoutes = canonicalCollectibles.map((c) => ({
    url: `${baseUrl}/collectibles/${c.slug}`,
    lastModified: lastUpdated,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...vehicleRoutes,
    ...weaponRoutes,
    ...missionRoutes,
    ...locationRoutes,
    ...propertyRoutes,
    ...collectibleRoutes,
  ];
}
