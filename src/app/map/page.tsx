import { PUBLIC_TOOL_COPY } from "@/lib/public-tool-copy";
import { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { RelatedArticles } from "@/components/related-articles";
import { MapClient } from "./map-client";
import { getSiteSettings } from "@/lib/services/settings";
import { FeatureDisabled } from "@/components/feature-disabled";
import Link from "next/link";

const title = "GTA 6 Map: Interactive Leonida & Vice City";

export const metadata: Metadata = {
  title,
  description: PUBLIC_TOOL_COPY["/map"],
  alternates: { canonical: "/map" },
  openGraph: {
    url: "/map",
    title,
    description: PUBLIC_TOOL_COPY["/map"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: PUBLIC_TOOL_COPY["/map"],
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
      <MapClient />
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
              <a className="underline" href="https://www.rockstargames.com/VI/only-in-leonida" target="_blank" rel="noreferrer">
                Rockstar&apos;s Only in Leonida guide
              </a>{" · "}
              <Link className="underline" href="/regions">Explore the six destinations</Link>
              {" · "}<Link className="underline" href="/guides/vice-city-map-guide">Read the Leonida destination guide</Link>
            </p>
          </article>
          <article className="card-surface rounded-2xl p-5">
            <h3 className="text-lg font-bold">What is the GTA 6 map size in km²?</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We have not verified a primary-source measurement of the full
              playable area in square kilometres. We therefore do not present
              a km² total or a GTA V size ratio as confirmed. The illustration
              on this page cannot establish either measurement.
            </p>
            <Link className="mt-3 inline-block text-sm underline" href="/news/map-size-comparison-gtav-rdr2">
              Map-size evidence, estimates and comparison limits
            </Link>
          </article>
          <article className="card-surface rounded-2xl p-5">
            <h3 className="text-lg font-bold">Is this an official GTA 6 map?</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This is an unofficial, interactive fan illustration. Its pins
              are provisional concepts. Placement, opening hours, rewards,
              item availability and gameplay mechanics have not passed
              field-specific source review. An appearance in a trailer does
              not verify all of those details.
            </p>
            <Link className="mt-3 inline-block text-sm underline" href="/editorial-policy">
              How we review map evidence
            </Link>
          </article>
          <article className="card-surface rounded-2xl p-5">
            <h3 className="text-lg font-bold">How can I use the interactive map?</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Search or filter the pins, select a pin to read its evidence
              status, and use the text list as an alternative to the map.
              Notes and marks are saved on your device. They record your own
              planning choices; they do not prove in-game discovery or
              completion. Clearing browser storage removes those local records.
            </p>
          </article>
        </div>
      </section>
      {/* RELATED ARTICLES — internal linking for SEO/discovery */}
      <RelatedArticles category="Map" title="Map Guides & Location Intel" />
    </SiteShell>
  );
}
