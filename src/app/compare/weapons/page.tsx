import { SiteShell } from "@/components/shells";
import { CompareWeaponsClient } from "./compare-weapons-client";
import { getMergedWeapons } from "@/lib/services/catalog";
import { getComparisonWeights } from "@/lib/services/comparison";
import { Crosshair, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weapon Comparison Duel (2–4 Firearms) — GTA 6 Atlas",
  description: "Interactive head-to-head GTA 6 firearm comparison tool. Duel 2 to 4 weapons across DPS, bullet velocity, recoil, effective range, and magazine capacity.",
  alternates: { canonical: "/compare/weapons" },
};

export default async function CompareWeaponsPage() {
  // Live Supabase catalog (admin edits win) + CMS-configured score weights.
  const [weapons, weights] = await Promise.all([getMergedWeapons(), getComparisonWeights()]);

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary mb-3">
            <Crosshair className="h-3 w-3" /> Armory Stat Comparison
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
            COMPARE <span className="text-primary">GTA 6 WEAPONS</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Select 2 to 4 confirmed firearms to compare side-by-side DPS, recoil patterns, reload timings, ammo capacities, and tactical verdicts.
          </p>
        </div>

        <CompareWeaponsClient weapons={weapons} weights={weights.weapon} />
      </div>
    </SiteShell>
  );
}
