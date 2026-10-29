import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { MoneyCalculatorClient } from "./money-calculator-client";
import { DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
export const metadata: Metadata = {
  openGraph: { url: "/tools/money-calculator" },
  title: "GTA 6 Money Calculator — Hours, Missions & Estimated Goal Date",
  description:
    "Estimate savings time from your own income and goal assumptions. Example inputs are illustrative, not verified GTA VI payouts or prices.",

  alternates: { canonical: "/tools/money-calculator" },
};

export default function MoneyCalculatorPage() {
  return (
    <SiteShell>
      <ToolStatusBanner status="simulator" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.taishgaming.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Tools",
                    item: "https://www.taishgaming.com/tools",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "GTA 6 Money Calculator \u2014 Hours, Missions & Estimated Goal Date",
                    item: "https://www.taishgaming.com/tools/money-calculator",
                  },
                ],
              },
              {
                "@type": "WebApplication",
                name: "GTA 6 Money Calculator \u2014 Hours, Missions & Estimated Goal Date",
                description:
                  "Estimate savings time from your own income and goal assumptions. Example inputs are illustrative, not verified GTA VI payouts or prices.",
                url: "https://www.taishgaming.com/tools/money-calculator",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ],
          }),
        }}
      />
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">
            Tools
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">Money Calculator</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-3">
            <DollarSign className="h-3 w-3" /> Financial Planning Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">Money Calculator</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Set your target savings goal for supercars, penthouses, or weapon
            arsenals and instantly compute the required missions, grinding
            hours, and real-world completion date.
          </p>
        </div>

        <MoneyCalculatorClient />
      </div>
    </SiteShell>
  );
}
