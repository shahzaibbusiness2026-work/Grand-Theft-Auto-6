import { SiteShell } from "@/components/shells";
import { BusinessIncomeCalculatorClient } from "./business-income-calculator-client";
import { Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Business Income Calculator — ROI & Break-Even Planner",
  description: "Calculate daily and weekly business income, total investment, break-even days, and 30-day ROI for GTA 6 businesses — nightclub, chop shop, warehouse, and more.",
};

export default function BusinessIncomeCalculatorPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">Business Income Calculator</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A86A]/40 bg-[#C9A86A]/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#C9A86A] mb-3">
            <Briefcase className="h-3 w-3" /> Financial Planning Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">BUSINESS INCOME CALCULATOR</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick a business, choose an upgrade tier, and set your daily playtime to instantly see estimated passive income, total investment, break-even time, and 30-day ROI.
          </p>
        </div>

        <BusinessIncomeCalculatorClient />
      </div>
    </SiteShell>
  );
}
