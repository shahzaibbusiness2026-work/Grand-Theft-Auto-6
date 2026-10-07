import { SiteShell } from "@/components/shells";
import { PropertiesClient } from "./properties-client";
import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import { canonicalProperties, type CanonicalProperty } from "@/lib/canonical-data";
import { getPublicProperties, type PropertyRecord } from "@/lib/services/properties";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GTA 6 Real Estate & Property Database — GTA 6 Atlas",
  description:
    "Explore, compare, and calculate returns on all confirmed safehouses, nightclubs, luxury penthouses, chop shops, and marinos in Grand Theft Auto VI.",
};

/** Map a DB property row onto the CanonicalProperty shape the client renders. */
function dbToCanonical(p: PropertyRecord, match?: CanonicalProperty): CanonicalProperty {
  return {
    id: p.id,
    slug: p.slug || match?.slug || p.id,
    name: p.name,
    district: p.district || match?.district || "Vice City",
    type: (p.type as CanonicalProperty["type"]) || match?.type || "Safehouse",
    price: p.price ?? match?.price ?? null,
    priceDisplay: p.price_display || match?.priceDisplay || "TBD",
    garageCapacity: p.garage_capacity ?? match?.garageCapacity ?? 0,
    passiveIncomePerHour: p.passive_income_per_hour ?? match?.passiveIncomePerHour ?? null,
    passiveIncomeDisplay: p.passive_income_display || match?.passiveIncomeDisplay || "None",
    features: p.features || match?.features || [],
    upgrades: p.upgrades || match?.upgrades || [],
    requirements: p.requirements || match?.requirements || [],
    confidence: (p.confidence as CanonicalProperty["confidence"]) || match?.confidence || "REPORTED",
    source: p.source || match?.source || "Atlas Admin",
    desc: p.description || match?.desc || "",
    img: p.img || match?.img || "/img/hero-dark.jpg",
    mapCoords: match?.mapCoords || { top: "50%", left: "50%" },
  };
}

export default async function PropertiesPage() {
  // Live Supabase properties first; canonical static entries fill the rest.
  let properties: CanonicalProperty[] = canonicalProperties;
  try {
    const dbProps = await getPublicProperties();
    if (dbProps && dbProps.length > 0) {
      const dbIds = new Set(dbProps.map((p) => p.id.toLowerCase()));
      const dbNames = new Set(dbProps.map((p) => p.name.toLowerCase()));
      const dbMapped = dbProps.map((p) =>
        dbToCanonical(
          p,
          canonicalProperties.find(
            (c) => c.id.toLowerCase() === p.id.toLowerCase() || c.name.toLowerCase() === p.name.toLowerCase()
          )
        )
      );
      const remaining = canonicalProperties.filter(
        (c) => !dbIds.has(c.id.toLowerCase()) && !dbNames.has(c.name.toLowerCase())
      );
      properties = [...dbMapped, ...remaining];
    }
  } catch {
    // Supabase unreachable — canonical data still renders
  }

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3">
            <Building2 className="h-3 w-3" /> Leonida Real Estate Exchange
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            PROPERTIES & <span className="bg-gradient-to-r from-amber-400 via-primary to-accent bg-clip-text text-transparent">BUSINESSES</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Browse and compare confirmed safehouses, commercial warehouses, chop shops, and nightclubs.
            Analyze passive hourly yields, garage sizes, and side-by-side specs.
          </p>
        </div>

        <PropertiesClient initialProperties={properties} />
      </div>
    </SiteShell>
  );
}
