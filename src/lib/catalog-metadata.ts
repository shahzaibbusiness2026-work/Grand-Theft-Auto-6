import type { Metadata } from "next";
import { catalogArtwork } from "./catalog-artwork";
import { indexReady, type CatalogKind, type EvidenceEntry } from "./catalog-evidence";
import { catalogCanonicalPath, isCatalogVariant } from "./catalog-url-state";

const catalogCovers = {
  vehicles: { url: "/img/car-purple.jpg", alt: "Editorial cover for the Taish Gaming GTA 6 vehicle catalog" },
  weapons: { url: "/img/world-evidence/gta-6-handgun-robbery-scene-trailer-1.webp", alt: "GTA 6 Trailer 1 robbery scene used as the Taish Gaming weapon catalog cover" },
};

function socialMetadata(path: string, title: string, description: string, image: { url: string; alt: string }): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: { type: "website", url: path, title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function catalogListingMetadata(kind: CatalogKind, params: URLSearchParams, entries: EvidenceEntry[]): Metadata {
  const path = catalogCanonicalPath(kind, params, entries);
  const page = new URLSearchParams(path.split("?")[1]).get("page");
  const baseTitle = kind === "vehicles" ? "GTA 6 Vehicle Database" : "GTA 6 Weapons Database";
  const title = page ? `${baseTitle} – Page ${page}` : baseTitle;
  const summary = kind === "vehicles"
    ? "Browse GTA 6 cars, bikes, boats and aircraft with source links. Compare reviewed appearances and see where prices or performance are still unknown."
    : "Browse GTA 6 weapon sightings and provisional identifications with source links. Compare reviewed appearances and see which gameplay details remain unknown.";
  const description = page ? `Page ${page} of the ${baseTitle}. ${summary}` : summary;
  return {
    title,
    description,
    alternates: { canonical: path },
    ...socialMetadata(path, title, description, catalogCovers[kind]),
    ...(isCatalogVariant(params) ? { robots: { index: false, follow: true } } : {}),
  };
}

export function catalogComparisonMetadata(kind: CatalogKind, params: URLSearchParams): Metadata {
  const path = `/compare/${kind}`;
  const title = kind === "vehicles" ? "GTA 6 Vehicle Comparison Tool" : "GTA 6 Weapon Comparison Tool";
  const description = `Compare up to four GTA 6 ${kind} side by side. Check source reviews for appearances and see which gameplay details are still unverified.`;
  return {
    title,
    description,
    alternates: { canonical: path },
    ...socialMetadata(path, title, description, catalogCovers[kind]),
    ...(isCatalogVariant(params) || params.has("page") ? { robots: { index: false, follow: true } } : {}),
  };
}

function claimValue(entry: EvidenceEntry, field: string): string | undefined {
  return entry.claims.find((c) => c.field === field)?.value;
}

// Strip a trailing "(...)" note from a claim value: "5.0/10 (shop rating)" -> "5.0/10".
function cleanValue(value: string): string {
  return value.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function priceAmount(value: string): string | undefined {
  return value.match(/^(\$[\d,]+)/)?.[1];
}

// Build the meta description from the entry's own verified claims, in
// priority order, capped at 155 chars. Facts are dropped from the end
// (lowest priority first) until the text fits; the honest generic tail is
// added only when it fits. Pages with no verified facts keep the generic
// template — nothing is invented to fill the space.
function detailDescription(kind: CatalogKind, entry: EvidenceEntry): string {
  const label = kind === "vehicles" ? "vehicle" : "weapon";
  const facts: string[] = [];
  if (kind === "vehicles") {
    const speed = claimValue(entry, "Speed rating");
    if (speed) facts.push(`speed rating ${cleanValue(speed)}`);
    const accel = claimValue(entry, "Acceleration rating");
    if (accel) facts.push(`acceleration ${cleanValue(accel)}`);
    const reg = claimValue(entry, "Registration cost");
    const sell = claimValue(entry, "Scanned sell value");
    const shown = claimValue(entry, "Price shown");
    if (reg && priceAmount(reg)) facts.push(`${priceAmount(reg)} to register`);
    else if (sell && priceAmount(sell)) facts.push(`sells for ${priceAmount(sell)}`);
    else if (shown) facts.push(cleanValue(shown));
    const location = claimValue(entry, "Observed location");
    if (location) facts.push(`spotted at ${cleanValue(location)}`);
    const seats = claimValue(entry, "Seating");
    if (seats) facts.push(cleanValue(seats));
  } else {
    const damage = claimValue(entry, "Damage");
    if (damage) facts.push(`damage ${cleanValue(damage)}`);
    const shown = claimValue(entry, "Price shown");
    if (shown) facts.push(cleanValue(shown));
    const mag = claimValue(entry, "Magazine size");
    const magCount = mag?.match(/^(\d+)\s+rounds/)?.[1];
    if (magCount) facts.push(`${magCount}-round magazine`);
    else if (mag) facts.push(cleanValue(mag));
    const location = claimValue(entry, "Observed location");
    if (location) facts.push(`spotted at ${cleanValue(location)}`);
    const acquisition = claimValue(entry, "Acquisition method");
    if (acquisition) facts.push(cleanValue(acquisition));
  }
  const tail = " Verified evidence and sources.";
  const head = (useFacts: string[]) =>
    useFacts.length
      ? `${entry.name} in GTA 6: ${useFacts.join("; ")}.`
      : "";
  let use = [...facts];
  while (use.length > 1 && head(use).length + tail.length > 155) use.pop();
  if (use.length) {
    const withTail = head(use) + tail;
    return withTail.length <= 155 ? withTail : head(use);
  }
  return indexReady(entry)
    ? `Review the GTA 6 ${label} evidence for ${entry.name}, including where it was reported or shown. Compare source reviews and unverified gameplay details.`
    : `${entry.name} is a provisional GTA 6 ${label} catalog entry. See its review status and compare with other entries in the catalog.`;
}

function detailKeywords(kind: CatalogKind, entry: EvidenceEntry): string[] {
  const label = kind === "vehicles" ? "vehicle" : "weapon";
  const keywords = [
    `${entry.name} GTA 6`,
    `GTA 6 ${entry.category}`,
    `GTA 6 ${label}`,
  ];
  const hasPrice =
    claimValue(entry, "Price shown") ||
    claimValue(entry, "Registration cost") ||
    claimValue(entry, "Scanned sell value");
  if (hasPrice) keywords.push(`${entry.name} price GTA 6`);
  if (claimValue(entry, "Observed location"))
    keywords.push(`${entry.name} location GTA 6`);
  return keywords.slice(0, 6);
}

export function catalogDetailMetadata(kind: CatalogKind, entry: EvidenceEntry): Metadata {
  const path = `/${kind}/${entry.slug}`;
  const title = `${entry.name} – GTA 6`;
  const description = detailDescription(kind, entry);
  const artwork = catalogArtwork(kind, entry);
  const image = artwork && !artwork.contextual
    ? { url: artwork.src, alt: artwork.alt }
    : catalogCovers[kind];
  return {
    title: title.length + 15 > 60 ? { absolute: title } : title,
    description,
    keywords: detailKeywords(kind, entry),
    alternates: { canonical: path },
    ...socialMetadata(path, title, description, image),
    robots: {
      index: indexReady(entry),
      follow: true,
      googleBot: { index: indexReady(entry), follow: true, "max-image-preview": "large" },
    },
  };
}
