import type { Metadata } from "next";
import { MapClient } from "@/app/map/map-client";
import { getMapMarkers } from "@/lib/services/map";

/**
 * Public embeddable GTA 6 interactive map, served for the iframe code the
 * /map page hands out. Deliberately bare: no site shell, noindex so embeds
 * never pollute search.
 */
export const metadata: Metadata = {
  title: "GTA 6 Interactive Map",
  robots: { index: false, follow: false },
};

export default async function EmbedMapPage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <MapClient markers={await getMapMarkers()} />
    </main>
  );
}
