import { SiteShell } from "@/components/shells";
import { MoneyCalculatorClient } from "./money-calculator-client";
import { DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Money Calculator — Hours, Missions & Estimated Goal Date",
  description: "Calculate how many missions, hours, and playing days you need to afford any supercar, luxury penthouse, or business in GTA 6.",
};

export default function MoneyCalculatorPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">Money Calculator</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">
            <DollarSign className="h-3 w-3" /> Financial Planning Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">MONEY CALCULATOR</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Set your target savings goal for supercars, penthouses, or weapon arsenals and instantly compute the required missions, grinding hours, and real-world completion date.
          </p>
        </div>

        <MoneyCalculatorClient />
      </div>
    </SiteShell>
  );
}
