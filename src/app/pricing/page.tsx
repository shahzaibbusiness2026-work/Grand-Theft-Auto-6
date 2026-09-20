import { SiteShell } from "@/components/shells";
import { PricingClient } from "./pricing-client";
import { Crown, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vice City Pro Membership — Plans & Pricing | GTA 6 Atlas",
  description:
    "Upgrade to Vice City Pro for unlimited grounded Ask GTA 6 AI queries, 4-way comparison duels, cloud completion backups, and ad-free access.",
};

export default function PricingPage() {
  return (
    <SiteShell>
      <div className="container-site py-12">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary mb-2">
            <Crown className="h-3.5 w-3.5 text-amber-400" /> Membership Tiers
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            UNLOCK <span className="bg-gradient-to-r from-primary via-accent to-amber-400 bg-clip-text text-transparent">VICE CITY PRO</span>
          </h1>
          <p className="text-sm text-slate-300">
            Get the ultimate competitive edge in Grand Theft Auto VI with 4-way comparisons, unlimited AI research queries, and cloud backup synchronization.
          </p>
        </div>

        <PricingClient />
      </div>
    </SiteShell>
  );
}
