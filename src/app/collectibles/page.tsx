import { SiteShell } from "@/components/shells";
import { CollectiblesClient } from "./collectibles-client";
import { Sparkles, Compass } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collectibles Finder & Checklist — GTA 6 Atlas",
  description:
    "Interactive GTA 6 Collectibles Finder across Leonida. Track Hidden Packages, Stunt Jumps, Rebel Radio Transmitters, Wildlife Photos, and Easter Eggs with coordinate guides.",
};

export default function CollectiblesPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary mb-3">
            <Compass className="h-3 w-3" /> Leonida Collectibles Database
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            COLLECTIBLES <span className="bg-gradient-to-r from-primary via-accent to-amber-400 bg-clip-text text-transparent">FINDER & GUIDE</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Locate every hidden contraband package, stunt ramp, pirate radio mast, and rare wildlife species across the State of Leonida.
            Filter by district, check off collected items, and view coordinate guides.
          </p>
        </div>

        <CollectiblesClient />
      </div>
    </SiteShell>
  );
}
