import Link from "next/link";
import { SiteShell } from "@/components/shells";
import { CompareVehiclesClient } from "./compare-vehicles-client";
import { getMergedVehicles } from "@/lib/services/catalog";
import { getComparisonWeights } from "@/lib/services/comparison";

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
      <div className="dark bg-[#070b14]">
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-border">
          <img
            src="/img/hero-dark.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm font-bold text-white/70">
              <Link href="/" className="hover:text-white">Home</Link>
              <span aria-hidden="true">›</span>
              <Link href="/vehicles" className="hover:text-white">Vehicles</Link>
              <span aria-hidden="true">›</span>
              <span className="text-white">Compare</span>
            </nav>
            <h1 className="font-display text-5xl sm:text-6xl font-black leading-none tracking-tight text-white">
              GTA <span className="bg-gradient-to-r from-[#FF2E9A] to-violet-500 bg-clip-text text-transparent">6</span> Vehicle <span className="text-[#FF2E9A]">Comparison</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-white/80">
              Compare GTA 6 vehicle entries with known details, clearly labelled pre-release estimates, charts
              and analysis to find the right ride for your Leonida journey.
            </p>
          </div>
        </div>

        <CompareVehiclesClient vehicles={vehicles} weights={weights.vehicle} />
      </div>
      </div>
    </SiteShell>
  );
}
