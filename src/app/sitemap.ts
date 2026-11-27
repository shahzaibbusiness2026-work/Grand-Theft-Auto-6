import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/services/seo";
import { getPublicGuides } from "@/lib/services/guides";
import { createPublicClient } from "@/lib/supabase/public";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { canonicalOrigin } from "@/lib/site-identity";
import { articlePublicationDates, hasArticleBody } from "@/lib/editorial-quality";
import { indexReady } from "@/lib/catalog-evidence";
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
    "/settings-guide",
    "/guides",
    "/gta-6-world",
    "/gta-6-world/animals-wildlife",
    "/gta-6-world/birds",
    "/gta-6-world/mammals",
    "/gta-6-world/marine-life",
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
    "/tools/loadout-builder",
    "/tools/money-maker",
  ];
  // Detail URLs use their own recorded update dates. Unrelated article edits
  // do not establish when static pages were substantively changed.
  const articleEntries: MetadataRoute.Sitemap = [];
  try {
    const { data, error } = await createPublicClient()
      .from("articles")
      .select("slug,title,excerpt,content,published_at,updated_at")
      .eq("status", "published");
    if (error) throw error;
    for (const a of data || [])
      if (a.slug && hasArticleBody(a)) {
        const { published, modified } = articlePublicationDates(a.published_at, a.updated_at);
        const lm = realDate(modified) || realDate(published);
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
  // Detail URLs share the same evidence rule as the public catalog routes.
  // The newest recorded field review captures additions beyond first appearance.
  const evidenceLastModified = (e: {
    claims?: { reviewedAt?: string }[];
  }) => {
    const dates = (e.claims || [])
      .map((c) => realDate(c.reviewedAt))
      .filter((d): d is Date => !!d);
    return dates.length
      ? new Date(Math.max(...dates.map((d) => d.getTime())))
      : undefined;
  };
  const detailEntries: MetadataRoute.Sitemap = [
    ...vehicles
      .filter(indexReady)
      .map((e) => ({
        url: base + "/vehicles/" + e.slug,
        lastModified: evidenceLastModified(e),
      })),
    ...weapons
      .filter(indexReady)
      .map((e) => ({
        url: base + "/weapons/" + e.slug,
        lastModified: evidenceLastModified(e),
      })),
  ];
  const characterReviewed = new Date(CHARACTER_REVIEWED_AT + "T00:00:00Z");
  const characterEntries: MetadataRoute.Sitemap = Object.keys(
    characterEvidence,
  ).map((slug) => ({
    url: base + "/characters/" + slug,
    lastModified: characterReviewed,
  }));
  // Static routes have no per-page record of their last substantive edit.
  const result: MetadataRoute.Sitemap = paths.map((path) => ({
    url: base + path,
  }));
  result.push(...articleEntries, ...guideEntries, ...characterEntries, ...detailEntries);
  return Array.from(new Map(result.map((e) => [e.url, e])).values());
}
