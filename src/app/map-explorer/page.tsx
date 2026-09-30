import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { SatelliteInteractiveMap } from "@/components/satellite-interactive-map";

export const metadata: Metadata = {
  title: "Interactive Map Explorer",
  description:
    "Explore the full interactive GTA 6 map of Vice City and Leonida — markers, collectibles, activities and verified locations.",
  alternates: { canonical: "/map-explorer" },
};

export default function MapExplorerPage() {
  return (
    <AppShell>
      <div className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <SatelliteInteractiveMap />
      </div>
    </AppShell>
  );
}
