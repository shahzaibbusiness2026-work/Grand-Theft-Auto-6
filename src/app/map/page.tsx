import { PUBLIC_TOOL_COPY } from "@/lib/public-tool-copy";
import { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { RelatedArticles } from "@/components/related-articles";
import { MapClient } from "./map-client";
import { getSiteSettings } from "@/lib/services/settings";
import { FeatureDisabled } from "@/components/feature-disabled";

export const metadata: Metadata = {
  title: "GTA 6 Fan Map | Leonida Concepts & Local Notes",
  description: PUBLIC_TOOL_COPY["/map"],
  alternates: { canonical: "/map" },
  openGraph: {
    url: "/map",
    title: "GTA 6 Fan Map | Leonida Concepts & Local Notes",
    description: PUBLIC_TOOL_COPY["/map"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Fan Map | Leonida Concepts & Local Notes",
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
      {/* RELATED ARTICLES — internal linking for SEO/discovery */}
      <RelatedArticles category="Map" title="Map Guides & Location Intel" />
    </SiteShell>
  );
}
