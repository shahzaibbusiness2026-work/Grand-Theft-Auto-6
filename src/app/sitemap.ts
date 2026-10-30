import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/services/seo";
import { getPublicGuides } from "@/lib/services/guides";
import { createPublicClient } from "@/lib/supabase/public";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { canonicalOrigin } from "@/lib/site-identity";
import { characterEvidence, CHARACTER_REVIEWED_AT } from "@/lib/character-evidence";
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
    "/tools/vehicle-upgrade-calculator",
    "/tools/heist-payout-splitter",
    "/tools/garage-planner",
    "/tools/countdown-widget",
    "/tools/business-income-calculator",
    "/characters",
    "/radio",
    "/controls",
    "/money-guide",
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
    "/regions",
    "/regions/vice-city",
    "/regions/leonida-keys",
    "/regions/grassrivers",
    "/regions/port-gellhorn",
    "/regions/ambrosia",
    "/regions/mount-kalaga",
    "/wildlife/american-flamingo",
    "/wildlife/american-alligator",
    "/wildlife/green-iguana",
    "/wildlife/birds-marine-life",
    "/wildlife/sea-turtle",
    "/wildlife/eel",
    "/wildlife/poach",
    "/news",
    "/about",
    "/contact",
    "/dmca",
    "/team",
    "/editorial-policy",
    "/corrections",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/cookies",
    "/pricing",
    "/tools/character-quiz",
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
  // Pre-launch gate (AdSense audit, 29 Oct 2026): vehicle/weapon detail
  // pages each carry only a single "GTA VI appearance" claim with all
  // statistics withheld, so they are thin content. They stay crawlable
  // via hubs and are marked noindex on their own pages, and are NOT
  // listed in the sitemap until launch, when verified statistics exist.
  // The vehicles/weapons fetches above are kept so this file still
  // fails loudly if the catalog service breaks, without publishing URLs.
  void vehicles;
  void weapons;
  for (const slug of Object.keys(characterEvidence))
    result.push({
      url: base + "/characters/" + slug,
      lastModified: new Date(CHARACTER_REVIEWED_AT + "T00:00:00Z"),
    });
  return Array.from(new Map(result.map((e) => [e.url, e])).values());
}
