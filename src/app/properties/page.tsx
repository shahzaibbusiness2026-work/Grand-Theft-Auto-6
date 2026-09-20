import { SiteShell } from "@/components/shells";
import { PropertiesClient } from "./properties-client";
import { Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Real Estate & Property Database — GTA 6 Atlas",
  description:
    "Explore, compare, and calculate returns on all confirmed safehouses, nightclubs, luxury penthouses, chop shops, and marinos in Grand Theft Auto VI.",
};

export default function PropertiesPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3">
            <Building2 className="h-3 w-3" /> Leonida Real Estate Exchange
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            PROPERTIES & <span className="bg-gradient-to-r from-amber-400 via-primary to-accent bg-clip-text text-transparent">BUSINESSES</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Browse and compare confirmed safehouses, commercial warehouses, chop shops, and nightclubs.
            Analyze passive hourly yields, garage sizes, and side-by-side specs.
          </p>
        </div>

        <PropertiesClient />
      </div>
    </SiteShell>
  );
}
