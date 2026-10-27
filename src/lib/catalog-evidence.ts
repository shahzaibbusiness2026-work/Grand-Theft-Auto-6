/**
 * Only reviewed, field-specific evidence can publish a GTA VI claim.
 * Editorial catalog data and values carried forward from older GTA games are
 * never proof. Add records to catalog-evidence.json after reviewing a source.
 */
import records from "./catalog-evidence.json";
export type CatalogKind = "vehicles" | "weapons";
export interface EvidenceClaim {
  kind: CatalogKind;
  id: string;
  field: string;
  value: string;
  source: string;
  locator: string;
  reviewedAt: string;
  reviewer: string;
}
export interface EvidenceEntry {
  id: string;
  slug: string;
  name: string;
  category: string;
  img: string;
  claims: EvidenceClaim[];
}
export function validClaim(c: EvidenceClaim): boolean {
  try {
    const url = new URL(c.source);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !!c.id?.trim() &&
      !!c.field?.trim() &&
      !!c.value?.trim() &&
      !!c.locator?.trim() &&
      !!c.reviewer?.trim() &&
      Number.isFinite(Date.parse(c.reviewedAt)) &&
      Date.parse(c.reviewedAt) <= Date.now()
    );
  } catch {
    return false;
  }
}
export function claimsFor(kind: CatalogKind, id: string): EvidenceClaim[] {
  return (records as EvidenceClaim[]).filter(
    (c) => c.kind === kind && c.id === id && validClaim(c),
  );
}
export function indexReady(entry: EvidenceEntry): boolean {
  return entry.claims.some((c) => c.field === "GTA VI appearance");
}
export function editorialCategory(value: string): string {
  const aliases: Record<string, string> = {
    boats: "Boat",
    boat: "Boat",
    motorcycles: "Motorcycle",
    motorcycle: "Motorcycle",
    super: "Super Car",
    "super car": "Super Car",
    sports: "Sports Car",
    "sports car": "Sports Car",
    planes: "Plane",
    helicopters: "Helicopter",
    "assault rifles": "Assault Rifle",
    pistols: "Pistol",
    shotguns: "Shotgun",
    smgs: "SMG",
  };
  const trimmed = value.trim();
  return aliases[trimmed.toLowerCase()] || trimmed || "Uncategorized";
}
