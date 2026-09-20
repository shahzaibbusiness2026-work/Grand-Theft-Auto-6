import { SiteShell } from "@/components/shells";
import { MoneyMakerClient } from "./money-maker-client";
import { DollarSign, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Money-Making Method Finder & Grinding Strategies — GTA 6 Atlas",
  description:
    "Intelligent GTA 6 money-making route recommender. Discover the highest-paying heists, passive nightclub operations, and vehicle salvage strategies ranked by cash per hour.",
};

export default function MoneyMakerPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">
            <DollarSign className="h-3 w-3" /> Financial Advisory Engine
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            MONEY-MAKING <span className="bg-gradient-to-r from-emerald-400 via-primary to-accent bg-clip-text text-transparent">METHOD FINDER</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Find the most profitable solo and co-op cash methods across Leonida. Filter by starting capital, squad size, and risk appetite to maximize your hourly earnings.
          </p>
        </div>

        <MoneyMakerClient />
      </div>
    </SiteShell>
  );
}
