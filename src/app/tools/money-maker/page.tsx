import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { MoneyMakerClient } from "./money-maker-client";
import { DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
export const metadata: Metadata = {
  openGraph: { url: "/tools/money-maker" },
  robots: { index: false, follow: true },
  title: "Illustrative Money-Making Scenario Comparator",
  description:
    "Compare net hourly returns using your own payout, cost and duration assumptions. No verified GTA VI economy data is supplied.",

  alternates: { canonical: "/tools/money-maker" },
};

export default function MoneyMakerPage() {
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
                    name: "Money-Making Method Finder & Grinding Strategies \u2014 Taish Gaming",
                    item: "https://www.taishgaming.com/tools/money-maker",
                  },
                ],
              },
              {
                "@type": "WebApplication",
                name: "Money-Making Method Finder & Grinding Strategies \u2014 Taish Gaming",
                description:
                  "Compare net hourly returns using your own payout, cost and duration assumptions. No verified GTA VI economy data is supplied.",
                url: "https://www.taishgaming.com/tools/money-maker",
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
          <span className="text-foreground font-bold">
            Money-Making Method Finder
          </span>
        </nav>

        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">
            <DollarSign className="h-3 w-3" /> Illustrative arithmetic
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            MONEY-MAKING <span className="text-primary">METHOD FINDER</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Compare two editable scenarios using payout, costs and total run
            time. The examples do not represent confirmed GTA VI activities.
          </p>
        </div>

        <MoneyMakerClient />
      </div>
    </SiteShell>
  );
}
