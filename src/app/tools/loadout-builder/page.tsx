import { SiteShell } from "@/components/shells";
import { LoadoutClient } from "./loadout-client";
import { Crosshair, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Tactical Loadout Builder & Armory Scoring — GTA 6 Atlas",
  description:
    "Assemble and simulate custom GTA 6 weapon loadouts for heists, street wars, and recon operations. Real-time firepower, mobility, and stealth ratings with offline saving.",
};

export default function LoadoutBuilderPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary mb-3">
            <Crosshair className="h-3 w-3" /> Tactical Armory Builder
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            GTA 6 <span className="bg-gradient-to-r from-primary via-accent to-amber-400 bg-clip-text text-transparent">LOADOUT BUILDER</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Engineer your tactical weapon loadouts for Leonida heists, gang warfare, and covert wet operations.
            Analyze real-time firepower, mobility trade-offs, and save custom builds to your personal armory.
          </p>
        </div>

        <LoadoutClient />
      </div>
    </SiteShell>
  );
}
