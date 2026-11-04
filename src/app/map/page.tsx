import { PUBLIC_TOOL_COPY } from "@/lib/public-tool-copy";
import { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { RelatedArticles } from "@/components/related-articles";
import { MapClient } from "./map-client";
import { getSiteSettings } from "@/lib/services/settings";
import { FeatureDisabled } from "@/components/feature-disabled";
import Link from "next/link";
import { getMapMarkers } from "@/lib/services/map";

const title = "GTA 6 Interactive Map: Leonida Regions, Cities & Locations";

export const metadata: Metadata = {
  title,
  description: PUBLIC_TOOL_COPY["/map"],
  alternates: { canonical: "/map" },
  openGraph: {
    url: "/map",
    title,
    description: PUBLIC_TOOL_COPY["/map"],
    images: [
      {
        url: "/img/leonida-map-v2.jpg",
        alt: "Fan-made satellite-style preview of the Leonida map for GTA 6",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: PUBLIC_TOOL_COPY["/map"],
    images: ["/img/leonida-map-v2.jpg"],
  },
};

export default async function MapPage() {
  const settings = await getSiteSettings();
  if (!(settings.publicToolToggles ?? []).includes("map_tool")) {
    return (
      <SiteShell>
        <FeatureDisabled title="Interactive Map" />
      </SiteShell>
    );
  }
  return (
    <SiteShell>
      <link
        rel="preload"
        as="image"
        href="/maps/gtadb-yanis17/overview.webp"
        fetchPriority="high"
      />
      <MapClient markers={await getMapMarkers()} />
      <section className="container-site pb-10" aria-labelledby="map-questions">
        <h2 id="map-questions" className="font-display text-2xl font-bold">
          GTA 6 map: Leonida, Vice City and map size
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <article className="card-surface rounded-2xl p-5">
            <h3 className="text-lg font-bold">Where is GTA 6 set?</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              GTA VI is set in the state of Leonida, including Vice City.
              Rockstar&apos;s official destination guide names Vice City,
              Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia and Mount
              Kalaga. Those place names do not establish borders or the
              coordinates of our fan-map pins.
            </p>
            <p className="mt-3 text-sm">
              <a
                className="underline"
                href="https://www.rockstargames.com/VI/only-in-leonida"
                target="_blank"
                rel="noreferrer"
              >
                Rockstar&apos;s Only in Leonida guide
              </a>
              {" · "}
              <Link className="underline" href="/regions">
                Explore the six destinations
              </Link>
              {" · "}
              <Link className="underline" href="/guides/vice-city-map-guide">
                Read the Leonida destination guide
              </Link>
            </p>
          </article>
          <article className="card-surface rounded-2xl p-5">
            <h3 className="text-lg font-bold">
              What is the GTA 6 map size in km²?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We have not verified a primary-source measurement of the full
              playable area in square kilometres. We therefore do not present a
              km² total or a GTA V size ratio as confirmed. Neither the community
              reconstruction nor the planning illustration can establish either measurement.
            </p>
            <Link
              className="mt-3 inline-block text-sm underline"
              href="/news/map-size-comparison-gtav-rdr2"
            >
              Map-size evidence, estimates and comparison limits
            </Link>
          </article>
          <article className="card-surface rounded-2xl p-5">
            <h3 className="text-lg font-bold">
              Is this an official GTA 6 map?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This is an unofficial community reconstruction, using GTADB
              contributors’ map tiles and landmark data under CC BY 4.0.
              Proposed coordinates do not establish confirmed game geography,
              opening hours, rewards or availability. The original planning
              illustration remains a separate layer for older private pins.
            </p>
            <Link
              className="mt-3 inline-block text-sm underline"
              href="/editorial-policy"
            >
              How we review map evidence
            </Link>
          </article>
          <article className="card-surface rounded-2xl p-5">
            <h3 className="text-lg font-bold">
              How can I use the interactive map?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Search or filter the pins, select a pin to read its evidence
              status, and use the text list as an alternative to the map. Notes
              and marks are saved in your workspace, with account sync available
              when signed in. They record your own planning choices; they do not
              prove in-game discovery or completion. Check your dashboard sync
              status before clearing browser storage.
            </p>
          </article>
        </div>
      </section>
      <section className="container-site pb-10" aria-labelledby="map-guides">
        <h2 id="map-guides" className="font-display text-2xl font-bold">
          GTA 6 map guides
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The map above is the hub for everything map-related on Taish Gaming.
          Start with the destination guide, check what is known about the size,
          or browse the six regions.
        </p>
        <ul className="mt-5 grid gap-5 md:grid-cols-2">
          <li className="card-surface rounded-2xl p-5">
            <Link className="text-base font-bold underline" href="/news/gta-6-map-guide-leonida-regions-size">
              GTA 6 map guide: Leonida regions, size and locations
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Every named destination, what Rockstar confirmed, and what is still unconfirmed.
            </p>
          </li>
          <li className="card-surface rounded-2xl p-5">
            <Link className="text-base font-bold underline" href="/news/map-size-comparison-gtav-rdr2">
              GTA 6 map size compared with GTA 5 and Red Dead Redemption 2
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Why there is no official km² number yet, and what the estimates can and cannot prove.
            </p>
          </li>
          <li className="card-surface rounded-2xl p-5">
            <Link className="text-base font-bold underline" href="/regions">
              The six regions of Leonida
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia and Mount Kalaga, in Rockstar’s own words.
            </p>
          </li>
          <li className="card-surface rounded-2xl p-5">
            <Link className="text-base font-bold underline" href="/guides/vice-city-map-guide">
              Vice City map guide
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              How the named destinations relate to the available official evidence.
            </p>
          </li>
        </ul>
      </section>
      {/* RELATED ARTICLES — internal linking for SEO/discovery */}
      <RelatedArticles category="Map" title="Map Guides & Location Intel" />
      <section className="container-site pb-10" aria-labelledby="embed-map">
        <h2 id="embed-map" className="font-display text-2xl font-bold">
          Embed this map on your site
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Copy the code below to show the interactive map on your own page.
          A link back to Taish Gaming is appreciated.
        </p>
        <pre className="card-surface mt-5 overflow-x-auto rounded-2xl p-5 text-xs leading-relaxed">
          <code>
            {`<iframe src="https://www.taishgaming.com/embed/map" width="100%" height="600" style="border:0" loading="lazy" title="GTA 6 interactive map"></iframe>`}
          </code>
        </pre>
      </section>
    </SiteShell>
  );
}
