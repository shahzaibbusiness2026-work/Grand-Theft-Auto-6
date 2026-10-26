import { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { RelatedArticles } from "@/components/related-articles";
import { MapClient } from "./map-client";
import { getSiteSettings } from "@/lib/services/settings";
import { FeatureDisabled } from "@/components/feature-disabled";

export const metadata: Metadata = {
  title: "GTA 6 Interactive Map | Full Leonida & Vice City Satellite Atlas",
  description:
    "Explore the fan-made Leonida and Vice City map: points of interest spotted in official footage, with evidence labels showing what is confirmed and what is still uncertain.",
  alternates: { canonical: "/map" },
  openGraph: { url: "/map",
    title: "GTA 6 Interactive Map | Full Leonida & Vice City Satellite Atlas",
    description:
      "Explore the fan-made Leonida and Vice City map: points of interest spotted in official footage, with evidence labels showing what is confirmed and what is still uncertain.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Interactive Map | Full Leonida & Vice City Satellite Atlas",
    description:
      "Explore the fan-made Leonida and Vice City map: points of interest spotted in official footage, with evidence labels showing what is confirmed and what is still uncertain.",
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
      {/* RELATED ARTICLES — internal linking for SEO/discovery */}
      <RelatedArticles category="Map" title="Map Guides & Location Intel" />
    </SiteShell>
  );
}
