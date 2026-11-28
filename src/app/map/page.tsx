import { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/shells";
import { MapClient } from "./map-client";
import { getSiteSettings } from "@/lib/services/settings";
import { FeatureDisabled } from "@/components/feature-disabled";
import { getMapMarkers } from "@/lib/services/map";
import { REGION_PAGES, ROCKSTAR_LEONIDA_PLACES_URL } from "@/lib/regions";
import { mapView } from "@/lib/official-map";

const title = "GTA 6 Interactive Map: Explore Leonida Regions & Locations";
const description =
  "Zoom into Rockstar’s GTA 6 map of Leonida. Search official map labels for Vice City, the Keys and other locations, with an image for every result.";

export const metadata: Metadata = {
  // Absolute title: the title (58 chars) must render without the
  // " | Taish Gaming" suffix, which would push it to 73 chars and truncate.
  // og/twitter titles keep the same string.
  title: { absolute: title },
  description,
  alternates: { canonical: "/map" },
  openGraph: { type: "website",
    url: "/map",
    title,
    description,
    images: [
      {
        url: "/maps/rockstar-official/overview.webp",
        alt: "Rockstar Games’ printable map of Leonida from GTA 6",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/maps/rockstar-official/overview.webp"],
  },
};

type MapPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function MapPage({ searchParams }: MapPageProps) {
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams]);
  if (!(settings.publicToolToggles ?? []).includes("map_tool")) {
    return (
      <SiteShell>
        <FeatureDisabled title="Interactive Map" />
      </SiteShell>
    );
  }
  const view = mapView(params);
  const initialPlace = typeof params.place === "string" ? params.place : undefined;
  return (
    <SiteShell>
      <link
        rel="preload"
        as="image"
        href={view === "official" ? "/maps/rockstar-official/overview.webp" : "/maps/gtadb-yanis17/overview.webp"}
        fetchPriority="high"
      />
      <MapClient view={view} initialPlace={initialPlace} markers={view === "community" ? await getMapMarkers() : []} />
      <section className="container-site space-y-4 pb-6" aria-labelledby="map-evidence-heading">
        <h2 id="map-evidence-heading" className="font-display text-2xl font-bold">
          Leonida regions and locations
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Rockstar introduces six featured destinations in <a href={ROCKSTAR_LEONIDA_PLACES_URL} className="font-semibold text-primary underline">Only in Leonida</a>.
        </p>
        <ul className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {REGION_PAGES.map((region) => (
            <li key={region.slug}>
              <Link href={`/regions/${region.slug}`} className="font-semibold text-primary underline">
                {region.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Browse the <Link href="/locations" className="font-semibold text-primary underline">Leonida location directory</Link> for editorial entries and planning positions.
        </p>
      </section>
      <p className="container-site py-6 text-sm text-muted-foreground">
        Plan with the{" "}
        <Link href="/guides/vice-city-map-guide" className="font-semibold text-primary underline">
          GTA 6 map guide: Vice City &amp; Leonida
        </Link>{" "}
        and hunt the{" "}
        <Link href="/guides/gta-6-easter-eggs-found-first-24-hours" className="font-semibold text-primary underline">
          7 Easter eggs found in the first 24 hours
        </Link>
        .
      </p>
    </SiteShell>
  );
}
