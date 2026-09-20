"use client";

import { AppShell } from "@/components/app-shell";
import { SatelliteInteractiveMap } from "@/components/satellite-interactive-map";

export default function MapExplorerPage() {
  return (
    <AppShell>
      <div className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <SatelliteInteractiveMap />
      </div>
    </AppShell>
  );
}
