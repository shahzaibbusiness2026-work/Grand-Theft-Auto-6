import { cache } from "react";
import { getMergedVehicles, getMergedWeapons } from "./catalog";
import { canonicalCatalogSlug } from "@/lib/catalog-url-state";
import { canonicalVehicles, canonicalWeapons } from "@/lib/canonical-data";
import {
  publicCatalogEntry,
  type CatalogKind,
  type EvidenceEntry,
} from "@/lib/catalog-evidence";

const reviewedImages = {
  vehicles: catalogImages("vehicles", canonicalVehicles),
  weapons: catalogImages("weapons", canonicalWeapons),
};

function catalogImages(kind: CatalogKind, rows: { id: string; slug?: string; img?: string }[]) {
  const images = new Map<string, string>();
  for (const row of rows) {
    if (!row.img || !/^\/img\/(?:catalog|gta6)\//.test(row.img)) continue;
    images.set(canonicalCatalogSlug(kind, row.slug || row.id), row.img);
  }
  return images;
}
// Raw CMS/canonical performance values stay server-side. Never send them to
// a public component until the specific field has supporting evidence.
export const getEvidenceCatalog = cache(
  async (kind: CatalogKind): Promise<EvidenceEntry[]> => {
    const rows =
      kind === "vehicles"
        ? await getMergedVehicles()
        : await getMergedWeapons();
    const seen = new Set<string>();
    const directSlugs = new Set(rows.map((row) => row.slug || row.id));
    return rows
      .filter((row) => {
        const requested = row.slug || row.id;
        const slug = canonicalCatalogSlug(kind, requested);
        if (requested !== slug && directSlugs.has(slug)) return false;
        if (seen.has(slug)) return false;
        seen.add(slug);
        return true;
      })
      .map((row) => {
        const slug = canonicalCatalogSlug(kind, row.slug || row.id);
        return publicCatalogEntry(kind, row, reviewedImages[kind].get(slug));
      });
  },
);
