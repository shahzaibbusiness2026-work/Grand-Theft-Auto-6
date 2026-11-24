import { cache } from "react";
import { getMergedVehicles, getMergedWeapons } from "./catalog";
import { canonicalCatalogSlug } from "@/lib/catalog-url-state";
import {
  publicCatalogEntry,
  type CatalogKind,
  type EvidenceEntry,
} from "@/lib/catalog-evidence";
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
      .map((row) => publicCatalogEntry(kind, row));
  },
);
