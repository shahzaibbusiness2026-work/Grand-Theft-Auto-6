import { SiteShell } from "@/components/shells";
import { VehicleUpgradeCalculatorClient } from "./vehicle-upgrade-calculator-client";
import { Wrench, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Vehicle Upgrade Calculator — Tuning Costs & Performance Gains",
  description:
    "Calculate total tuning costs and estimated performance gains for your GTA 6 ride — engine, turbo, armor, brakes and cosmetic mods priced out before you visit Los Santos Customs.",
};

export default function VehicleUpgradeCalculatorPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">Vehicle Upgrade Calculator</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A86A]/40 bg-[#C9A86A]/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#C9A86A] mb-3">
            <Wrench className="h-3 w-3" /> Performance Tuning Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">VEHICLE UPGRADE CALCULATOR</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick your ride, tick off the mods, and instantly see the total build cost plus the
            estimated performance gain before you roll into the tuning shop.
          </p>
        </div>

        <VehicleUpgradeCalculatorClient />
      </div>
    </SiteShell>
  );
}
