import { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { MapClient } from "./map-client";

export const metadata: Metadata = {
  title: "GTA 6 Interactive Map | Full Leonida & Vice City Satellite Atlas",
  description:
    "Explore the entire 4K satellite map of Leonida and Vice City. Verified points of interest, hidden caches, stunt jumps, weapon drops, garages, and safehouses.",
  alternates: { canonical: "/map" },
};

export default function MapPage() {
  return (
    <SiteShell>
      <MapClient />
    </SiteShell>
  );
}
