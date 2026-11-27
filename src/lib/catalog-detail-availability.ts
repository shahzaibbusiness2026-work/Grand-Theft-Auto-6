import type { CatalogKind, EvidenceClaim, EvidenceEntry } from "./catalog-evidence";

const identityFields = new Set([
  "GTA VI appearance", "Official name", "Editorial label", "Vehicle class", "Weapon class",
]);

export function isPublisherEvidence(claim: EvidenceClaim): boolean {
  const { hostname, searchParams } = new URL(claim.source);
  return hostname === "rockstargames.com" || hostname.endsWith(".rockstargames.com") ||
    hostname === "store.playstation.com" || hostname === "www.playstation.com" || hostname === "www.xbox.com" ||
    (hostname === "www.youtube.com" && searchParams.get("v") === "tJbzMqJGH4k");
}

export function hasSpecificAppearance(claim: EvidenceClaim) {
  return !(
    /^(?:listed in\b|standout variant of\b)/i.test(claim.value) ||
    /\blisted\s*$|\bvehicle page\s*$|^unique weapons\s*[-–—].+\(\d{1,2}\s+[a-z]{3}\s+\d{4}\)\s*$/i.test(claim.locator)
  );
}

export function indexReady(entry: EvidenceEntry): boolean {
  const appearance = entry.claims.find((claim) => claim.field === "GTA VI appearance");
  if (!appearance) return false;
  // A timestamp, named mission or pickup can answer a reader's question even
  // when it is documented in the citation. A name-only table row cannot.
  return entry.claims.some((claim) => !identityFields.has(claim.field)) ||
    isPublisherEvidence(appearance) || hasSpecificAppearance(appearance);
}

export function catalogEntryPath(kind: CatalogKind, entry: EvidenceEntry): string {
  return indexReady(entry) ? `/${kind}/${entry.slug}` : `/${kind}?q=${encodeURIComponent(entry.name)}`;
}
