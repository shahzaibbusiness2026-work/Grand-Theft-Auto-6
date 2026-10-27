import { cache } from "react";
import { getMergedVehicles, getMergedWeapons } from "./catalog";
import {
  claimsFor,
  editorialCategory,
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
    return rows
      .filter((row) => {
        const slug = row.slug || row.id;
        if (seen.has(slug)) return false;
        seen.add(slug);
        return true;
      })
      .map((row) => ({
        id: row.id,
        slug: row.slug || row.id,
        name: row.name,
        category: editorialCategory(row.klass),
        img: row.img || "/img/hero-dark.jpg",
        claims: claimsFor(kind, row.id),
      }));
  },
);
