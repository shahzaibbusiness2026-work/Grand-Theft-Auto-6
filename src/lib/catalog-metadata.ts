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

export function catalogDetailMetadata(kind: CatalogKind, entry: EvidenceEntry): Metadata {
  const path = `/${kind}/${entry.slug}`;
  const title = `${entry.name} – GTA 6`;
  const label = kind === "vehicles" ? "vehicle" : "weapon";
  const description = indexReady(entry)
    ? `Review the GTA 6 ${label} evidence for ${entry.name}, including where it was reported or shown. Compare source reviews and unverified gameplay details.`
    : `${entry.name} is a provisional GTA 6 ${label} catalog entry. See its review status and compare with other entries in the catalog.`;
  const artwork = catalogArtwork(kind, entry);
  const image = artwork && !artwork.contextual
    ? { url: artwork.src, alt: artwork.alt }
    : catalogCovers[kind];
  return {
    title: title.length + 15 > 60 ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    ...socialMetadata(path, title, description, image),
    robots: {
      index: indexReady(entry),
      follow: true,
      googleBot: { index: indexReady(entry), follow: true, "max-image-preview": "large" },
    },
  };
}
