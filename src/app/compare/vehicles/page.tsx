import { SiteShell } from "@/components/shells";
import { CompareVehiclesClient } from "./compare-vehicles-client";
import { getMergedVehicles } from "@/lib/services/catalog";
import { getComparisonWeights } from "@/lib/services/comparison";
import { Trophy } from "lucide-react";

export const metadata = {
  title: { absolute: "GTA 6 Vehicle Comparison Tool | Compare Cars & Stats" },
  description: "Compare GTA 6 vehicle entries side by side, including known details and clearly labelled pre-release estimates for speed, handling, acceleration and value.",
  alternates: { canonical: "/compare/vehicles" },
  openGraph: {
    title: "GTA 6 Vehicle Comparison Tool | Compare Cars & Stats",
    description: "Compare GTA 6 vehicle entries side by side, including known details and clearly labelled pre-release estimates for speed, handling, acceleration and value.",
    images: ["/img/hero-dark.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Vehicle Comparison Tool | Compare Cars & Stats",
    description: "Compare GTA 6 vehicle entries side by side, including known details and clearly labelled pre-release estimates for speed, handling, acceleration and value.",
    images: ["/img/hero-dark.jpg"],
  },
};

export default async function CompareVehiclesPage() {
  // Live Supabase catalog (admin edits win) + CMS-configured score weights.
  const [vehicles, weights] = await Promise.all([getMergedVehicles(), getComparisonWeights()]);

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-accent mb-3">
            <Trophy className="h-3 w-3" /> Vehicle Comparison Duel
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
            COMPARE <span className="text-primary">GTA 6 VEHICLES</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Select 2 to 4 GTA 6 vehicle entries to compare known details and clearly labelled pre-release estimates.
          </p>
        </div>

        <CompareVehiclesClient vehicles={vehicles} weights={weights.vehicle} />
      </div>
    </SiteShell>
  );
}
