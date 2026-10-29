import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { SatelliteInteractiveMap } from "@/components/satellite-interactive-map";
import { getSiteSettings } from "@/lib/services/settings";
import { FeatureDisabled } from "@/components/feature-disabled";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  openGraph: { url: "/map-explorer" },
  title: "Interactive Map Explorer",
  description:
    "Explore the full interactive GTA 6 map of Vice City and Leonida — markers, collectibles, activities and trailer-spotted locations.",
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
        <SatelliteInteractiveMap />
      </div>
    </AppShell>
  );
}
