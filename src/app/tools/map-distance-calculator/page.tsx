import { SiteShell } from "@/components/shells";
import { MapDistanceCalculatorClient } from "./map-distance-calculator-client";
import { Route, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Map Distance Calculator — Travel Times Between Locations",
  description: "Estimate distances and travel times between GTA 6 map locations. Compare drive, boat, and off-road routes across Leonida and get the fastest vehicle recommendation.",
};

export default function MapDistanceCalculatorPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">Map Distance Calculator</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">
            <Route className="h-3 w-3" /> Exploration Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">MAP DISTANCE CALCULATOR</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick any two locations across Leonida to estimate the distance between them, compare drive and boat travel times, and see which vehicle gets you there fastest.
          </p>
        </div>

        <MapDistanceCalculatorClient />
      </div>
    </SiteShell>
  );
}
