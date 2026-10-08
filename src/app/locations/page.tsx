import { SiteShell } from "@/components/shells";
import { LocationsClient } from "./locations-client";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import { canonicalLocations, type CanonicalLocation } from "@/lib/canonical-data";
import { getLocations, type LocationRecord } from "@/lib/services/locations";

export const metadata: Metadata = {
  title: "Leonida Locations & Points of Interest — GTA 6 Atlas",
  description:
    "Explore every confirmed location, landmark, gun shop, safehouse, and secret outpost across Vice City and the State of Leonida. Verified coordinates and satellite map sync.",
};

type DbLocation = LocationRecord & {
  slug?: string;
  category?: string;
  hours?: string;
  threat_level?: string;
  img?: string;
  confidence?: string;
  source?: string;
};

/** Map a DB location row onto the CanonicalLocation shape the client renders. */
function dbToCanonical(l: DbLocation, match?: CanonicalLocation): CanonicalLocation {
  const coordMatch = /top\s+([\d.]+%?),\s*left\s+([\d.]+%?)/.exec(l.coordinates || "");
  return {
    id: l.id,
    slug: l.slug || match?.slug || l.id,
    name: l.name,
    district: l.district || match?.district || "Vice City Metro",
    category: (l.category as CanonicalLocation["category"]) || match?.category || "Point of Interest",
    desc: l.description || match?.desc || "",
    top: coordMatch?.[1] || match?.top || "50%",
    left: coordMatch?.[2] || match?.left || "50%",
    hours: l.hours || match?.hours || "Unknown",
    threatLevel: (l.threat_level as CanonicalLocation["threatLevel"]) || match?.threatLevel || "Low",
    confidence: (l.confidence as CanonicalLocation["confidence"]) || match?.confidence || "REPORTED",
    source: l.source || match?.source || "Atlas Admin",
    img: l.img || match?.img || "/img/map-dark.svg",
    verified: l.verification === "verified",
  };
}

export default async function LocationsPage() {
  // Live Supabase data first; canonical static entries fill anything not yet in the DB.
  let locations: CanonicalLocation[] = canonicalLocations;
  try {
    const dbLocations = (await getLocations()) as DbLocation[];
    if (dbLocations && dbLocations.length > 0) {
      const dbIds = new Set(dbLocations.map((l) => l.id.toLowerCase()));
      const dbNames = new Set(dbLocations.map((l) => l.name.toLowerCase()));
      const dbMapped = dbLocations.map((l) =>
        dbToCanonical(
          l,
          canonicalLocations.find(
            (c) => c.id.toLowerCase() === l.id.toLowerCase() || c.name.toLowerCase() === l.name.toLowerCase()
          )
        )
      );
      const remaining = canonicalLocations.filter(
        (c) => !dbIds.has(c.id.toLowerCase()) && !dbNames.has(c.name.toLowerCase())
      );
      locations = [...dbMapped, ...remaining];
    }
  } catch {
    // Supabase unreachable — canonical data still renders
  }

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent mb-3">
            <MapPin className="h-3 w-3" /> State of Leonida Atlas
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            LEONIDA <span className="text-primary">LOCATIONS & POIS</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Directory of confirmed landmarks, nightlife venues, gun shops, luxury estates, and underground facilities across Vice City, Port Gellhorn, and the Keys.
          </p>
        </div>

        <LocationsClient initialLocations={locations} />
      </div>
    </SiteShell>
  );
}
