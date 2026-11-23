import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { CommunityMapWorkspace } from "@/components/community-map-workspace";
import { getSiteSettings } from "@/lib/services/settings";
import { FeatureDisabled } from "@/components/feature-disabled";
import { pageOpenGraph } from "@/lib/page-metadata";
import { getMapMarkers } from "@/lib/services/map";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  openGraph: pageOpenGraph("/map-explorer"),
  title: "Interactive Map Explorer",
  description:
    "Search the unofficial Leonida atlas, inspect provisional community pins and keep private GTA VI planning notes.",
  alternates: { canonical: "/map-explorer" },
};

export default async function MapExplorerPage() {
  const settings = await getSiteSettings();
  if (!(settings.publicToolToggles ?? []).includes("map_tool")) {
    return (
      <AppShell>
        <FeatureDisabled title="Map Explorer" />
      </AppShell>
    );
  }
  return (
    <AppShell>
      {/* SEO: single H1 for the page, visually hidden (map UI fills the viewport). */}
      <h1 className="sr-only">
        GTA 6 Interactive Map Explorer — Leonida & Vice City
      </h1>
      <div className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10 overflow-x-clip">
        <CommunityMapWorkspace markers={await getMapMarkers()} />
      </div>
    </AppShell>
  );
}
