import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/services/seo";
import { getPublicGuides } from "@/lib/services/guides";
import { createPublicClient } from "@/lib/supabase/public";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { indexReady } from "@/lib/catalog-evidence";
import { canonicalOrigin } from "@/lib/site-identity";
import { characterEvidence } from "@/lib/character-evidence";
export const revalidate = 3600;
const realDate = (value?: string | null) => {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) && date.getTime() <= Date.now()
    ? date
    : undefined;
};
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = canonicalOrigin((await getSeoSettings()).canonicalBaseUrl);
  // Only canonical, indexable routes belong here. Public app variants,
  // unreviewed concepts, redirects and incomplete guides remain crawlable via links.
  const paths = [
    "",
    "/map",
    "/vehicles",
    "/compare/vehicles",
    "/weapons",
    "/compare/weapons",
    "/locations",
    "/tools",
    "/tools/money-calculator",
    "/tools/business-profit-calculator",
    "/tools/day-night-converter",
    "/tools/weapon-dps-calculator",
    "/tools/map-distance-calculator",
    "/characters",
    "/radio",
    "/guides",
    "/gta-6-world",
    "/gta-6-world/animals-wildlife",
    "/gta-6-world/birds-marine-life",
    "/gta-6-world/nature-environment",
    "/gta-6-world/weather-climate",
    "/gta-6-world/in-game-brands-ads",
    "/gta-6-world/social-media-apps",
    "/gta-6-world/tv-shows-media",
    "/gta-6-world/restaurants-food",
    "/gta-6-world/hotels-motels",
    "/gta-6-world/gangs-factions",
    "/gta-6-world/clothing-customization",
    "/wildlife",
    "/wildlife/american-flamingo",
    "/wildlife/american-alligator",
    "/wildlife/green-iguana",
    "/wildlife/birds-marine-life",
    "/news",
    "/about",
    "/contact",
    "/team",
    "/editorial-policy",
    "/corrections",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/cookies",
  ];
  const result: MetadataRoute.Sitemap = paths.map((path) => ({
    url: base + path,
  }));
  try {
    const { data, error } = await createPublicClient()
      .from("articles")
      .select("slug,content,published_at,updated_at")
      .eq("status", "published");
    if (error) throw error;
    for (const a of data || [])
      if (a.slug && a.content?.trim())
        result.push({
          url: base + "/news/" + a.slug,
          lastModified: realDate(a.updated_at || a.published_at),
        });
  } catch {
    /* No invented article URLs or timestamps during an outage. */
  }
  const [guides, vehicles, weapons] = await Promise.all([
    getPublicGuides(),
    getEvidenceCatalog("vehicles"),
    getEvidenceCatalog("weapons"),
  ]);
  for (const g of guides)
    if (g.slug)
      result.push({
        url: base + "/guides/" + g.slug,
        lastModified: realDate(g.updated_at),
      });
  for (const [kind, entries] of [
    ["vehicles", vehicles],
    ["weapons", weapons],
  ] as const)
    for (const e of entries.filter(indexReady))
      result.push({
        url: base + "/" + kind + "/" + e.slug,
        lastModified: realDate(
          e.claims
            .map((c) => c.reviewedAt)
            .sort()
            .at(-1),
        ),
      });
  for (const slug of Object.keys(characterEvidence))
    result.push({
      url: base + "/characters/" + slug,
      lastModified: new Date("2026-10-27T00:00:00Z"),
    });
  return Array.from(new Map(result.map((e) => [e.url, e])).values());
}
