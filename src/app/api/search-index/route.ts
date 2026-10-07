import { NextResponse } from "next/server";
import { getMergedVehicles, getMergedWeapons } from "@/lib/services/catalog";
import { getPublicArticles } from "@/lib/services/articles";
import { getPublicGuides } from "@/lib/services/guides";
import {
  canonicalMissions,
  canonicalLocations,
  canonicalProperties,
  canonicalCollectibles,
} from "@/lib/canonical-data";
import { characters } from "@/lib/data";
import { TOOL_SEARCH_ITEMS, type SearchItem } from "@/lib/search-types";

/**
 * Search index for the Ctrl+K command palette.
 * Built server-side so CMS content (published articles, guides, and any
 * admin-created/edited vehicles or weapons) is searchable without a code
 * change. Force-dynamic so admin edits are reflected immediately.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const items: SearchItem[] = [...TOOL_SEARCH_ITEMS];

  try {
    // Vehicles (DB wins over canonical via the shared merge)
    const vehicles = await getMergedVehicles();
    vehicles.forEach((v) => {
      items.push({
        id: `veh-${v.id}`,
        title: v.name,
        subtitle: `${v.klass} • ${v.topSpeed} mph • ${v.priceDisplay}`,
        category: "Vehicle",
        href: `/vehicles/${v.slug}`,
        img: v.img,
      });
    });

    // Weapons
    const weapons = await getMergedWeapons();
    weapons.forEach((w) => {
      items.push({
        id: `wep-${w.id}`,
        title: w.name,
        subtitle: `${w.klass} • ${w.damage} Dmg • ${w.priceDisplay}`,
        category: "Weapon",
        href: `/weapons/${w.slug}`,
        img: w.img,
      });
    });

    // Published articles — CMS content that was previously unsearchable
    const articles = await getPublicArticles();
    articles.forEach((a, i) => {
      items.push({
        id: `art-${a.slug || i}`,
        title: a.title,
        subtitle: `${a.category || a.tag || "News"} • ${a.date}`,
        category: "News",
        href: a.slug ? `/news/${a.slug}` : "/news",
        img: a.img,
      });
    });

    // Published guides
    const guides = await getPublicGuides();
    guides.forEach((g) => {
      items.push({
        id: `gui-${g.slug || g.id}`,
        title: g.title,
        subtitle: `${g.category}${g.read_time ? " • " + g.read_time : ""}`,
        category: "Guide",
        href: "/guides",
        img: g.image,
      });
    });

    // Missions
    canonicalMissions.forEach((m) => {
      items.push({
        id: `mis-${m.id}`,
        title: m.title,
        subtitle: `${m.type} • ${m.character} • ${m.cashRewardDisplay}`,
        category: "Mission",
        href: `/missions/${m.slug}`,
        img: m.img,
      });
    });

    // Locations
    canonicalLocations.forEach((l) => {
      items.push({
        id: `loc-${l.id}`,
        title: l.name,
        subtitle: `${l.district} • Threat: ${l.threatLevel}`,
        category: "Location",
        href: `/locations/${l.slug}`,
        img: l.img,
      });
    });

    // Properties
    canonicalProperties.forEach((p) => {
      items.push({
        id: `prop-${p.id}`,
        title: p.name,
        subtitle: `${p.type} in ${p.district} • ${p.priceDisplay}`,
        category: "Property",
        href: `/properties/${p.slug}`,
        img: p.img,
      });
    });

    // Collectibles
    canonicalCollectibles.forEach((c) => {
      items.push({
        id: `col-${c.id}`,
        title: c.title,
        subtitle: `${c.category} in ${c.district} • ${c.reward}`,
        category: "Collectible",
        href: `/collectibles/${c.slug}`,
        img: c.img,
      });
    });

    // Characters
    characters.forEach((c) => {
      items.push({
        id: `char-${c.id}`,
        title: c.name,
        subtitle: `${c.role} • ${c.desc.slice(0, 50)}...`,
        category: "Character",
        href: "/characters",
        img: c.img,
      });
    });
  } catch {
    // On any failure return at least the static tool entries
    return NextResponse.json(
      { items: TOOL_SEARCH_ITEMS },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "no-store" } }
  );
}
