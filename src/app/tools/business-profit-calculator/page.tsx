import { SiteShell } from "@/components/shells";
import { BusinessCalculatorClient } from "./business-calculator-client";
import { Building2, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Business Profit & ROI Calculator — Nightclub, Chop Shop & Warehouse",
  description: "Calculate break-even hours, passive daily income, and annual return on investment (ROI) across GTA 6 commercial businesses and properties.",
};

export default function BusinessProfitCalculatorPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-bold">Business Profit Calculator</span>
        </nav>

        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/40 bg-[#00F0FF]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#00F0FF] mb-3">
            <Building2 className="h-3 w-3" /> Enterprise Cashflow Engine
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            BUSINESS PROFIT & <span className="bg-gradient-to-r from-[#00F0FF] via-purple-500 to-accent bg-clip-text text-transparent">ROI CALCULATOR</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            Model passive hourly income, operating overhead, and capital recovery timelines. Compare any two Vice City commercial acquisitions side-by-side.
          </p>
        </div>

        <BusinessCalculatorClient />
      </div>
    </SiteShell>
  );
}
