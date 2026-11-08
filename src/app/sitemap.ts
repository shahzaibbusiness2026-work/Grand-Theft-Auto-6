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
    "/tools/download-time-calculator",
    "/characters",
    "/radio",
    "/controls",
    "/money-guide",
    "/guides",
    "/gta-6-world",
    "/gta-6-world/animals-wildlife",
    "/gta-6-world/birds",
    "/gta-6-world/mammals",
    "/gta-6-world/marine-life",
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
    "/tools/character-quiz",
  ];
  // Detail URLs use their own recorded update dates. Unrelated article edits
  // do not establish when static pages were substantively changed.
  const articleEntries: MetadataRoute.Sitemap = [];
  try {
    const { data, error } = await createPublicClient()
      .from("articles")
      .select("slug,content,published_at,updated_at")
      .eq("status", "published");
    if (error) throw error;
    for (const a of data || [])
      if (a.slug && a.content?.trim()) {
        const lm = realDate(a.updated_at || a.published_at);
        articleEntries.push({
          url: base + "/news/" + a.slug,
          lastModified: lm,
        });
      }
  } catch {
    /* No invented article URLs or timestamps during an outage. */
  }
  const [guides, vehicles, weapons] = await Promise.all([
    getPublicGuides(),
    getEvidenceCatalog("vehicles"),
    getEvidenceCatalog("weapons"),
  ]);
  const guideEntries: MetadataRoute.Sitemap = [];
  for (const g of guides)
    if (g.slug) {
      const lm = realDate(g.updated_at);
      guideEntries.push({
        url: base + "/guides/" + g.slug,
        lastModified: lm,
      });
    }
  // Indexed on the user's instruction (8 Nov 2026): all vehicle and
  // weapon detail pages, including verification-pending entries.
  // No lastModified: the catalog service does not expose recorded update
  // dates for these rows, so none is invented.
  const detailEntries: MetadataRoute.Sitemap = [
    ...vehicles.map((e) => ({ url: base + "/vehicles/" + e.slug })),
    ...weapons.map((e) => ({ url: base + "/weapons/" + e.slug })),
  ];
  const characterReviewed = new Date(CHARACTER_REVIEWED_AT + "T00:00:00Z");
  const characterEntries: MetadataRoute.Sitemap = Object.keys(
    characterEvidence,
  ).map((slug) => ({
    url: base + "/characters/" + slug,
    lastModified: characterReviewed,
  }));
  const result: MetadataRoute.Sitemap = paths.map((path) => ({
    url: base + path,
  }));
  result.push(...articleEntries, ...guideEntries, ...characterEntries, ...detailEntries);
  return Array.from(new Map(result.map((e) => [e.url, e])).values());
}
