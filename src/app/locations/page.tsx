import { SiteShell } from "@/components/shells";
import { LocationsClient } from "./locations-client";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leonida Locations & Points of Interest — GTA 6 Atlas",
  description:
    "Explore every confirmed location, landmark, gun shop, safehouse, and secret outpost across Vice City and the State of Leonida. Verified coordinates and satellite map sync.",
};

export default function LocationsPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent mb-3">
            <MapPin className="h-3 w-3" /> State of Leonida Atlas
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            LEONIDA <span className="bg-gradient-to-r from-accent via-primary to-amber-400 bg-clip-text text-transparent">LOCATIONS & POIS</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Directory of confirmed landmarks, nightlife venues, gun shops, luxury estates, and underground facilities across Vice City, Port Gellhorn, and the Keys.
          </p>
        </div>

        <LocationsClient />
      </div>
    </SiteShell>
  );
}
