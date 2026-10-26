import { SiteShell } from "@/components/shells";
import { CompareWeaponsClient } from "./compare-weapons-client";
import { getMergedWeapons } from "@/lib/services/catalog";
import { getComparisonWeights } from "@/lib/services/comparison";
import { Crosshair } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "GTA 6 Weapon Comparison Tool | Compare Weapons & Stats" },
  description: "Compare GTA 6 weapon entries side by side with evidence labels and clearly marked pre-release estimates for damage, fire rate, range and handling.",
  alternates: { canonical: "/compare/weapons" },
  openGraph: { url: "/compare/weapons",
    title: "GTA 6 Weapon Comparison Tool | Compare Weapons & Stats",
    description: "Compare GTA 6 weapon entries side by side with evidence labels and clearly marked pre-release estimates for damage, fire rate, range and handling.",
    images: ["/img/hero-dark.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Weapon Comparison Tool | Compare Weapons & Stats",
    description: "Compare GTA 6 weapon entries side by side with evidence labels and clearly marked pre-release estimates for damage, fire rate, range and handling.",
    images: ["/img/hero-dark.jpg"],
  },
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
            Select 2 to 4 GTA 6 weapon entries to compare clearly labelled pre-release estimates and known characteristics.
          </p>
        </div>

        <CompareWeaponsClient weapons={weapons} weights={weights.weapon} />
      </div>
    </SiteShell>
  );
}
