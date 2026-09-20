import { SiteShell } from "@/components/shells";
import { CompareVehiclesClient } from "@/app/compare/vehicles/compare-vehicles-client";
import { Trophy } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle Comparison Duel (2–4 Rides) — GTA 6 Atlas",
  description: "Interactive head-to-head GTA 6 vehicle comparison tool. Duel 2 to 4 rides across top speed, acceleration, handling, braking, and showroom price.",
};

export default function VehiclesComparePage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent mb-3">
            <Trophy className="h-3 w-3" /> Vehicle Comparison Duel
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            COMPARE <span className="bg-gradient-to-r from-primary via-accent to-amber-400 bg-clip-text text-transparent">GTA 6 VEHICLES</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Select any 2, 3, or 4 confirmed rides to compare side-by-side performance dyno metrics, braking deltas, horsepower, and value recommendations.
          </p>
        </div>

        <CompareVehiclesClient />
      </div>
    </SiteShell>
  );
}
