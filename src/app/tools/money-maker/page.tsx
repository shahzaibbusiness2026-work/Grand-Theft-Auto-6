import { pageOpenGraph } from "@/lib/page-metadata";
﻿import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { MoneyMakerClient } from "./money-maker-client";
import { DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
export const metadata: Metadata = {
  openGraph: pageOpenGraph("/tools/money-maker"),
  robots: { index: true, follow: true },
  title: "GTA 6 Earnings Calculator: Compare Profit per Hour",
  description:
    "Compare two GTA 6 earning runs using your own payouts, costs and time. See how travel and setup affect your net profit per hour.",

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
                    name: "GTA 6 Earnings Calculator",
                    item: "https://www.taishgaming.com/tools/money-maker",
                  },
                ],
              }
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
            Earnings Calculator
          </span>
        </nav>

        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">
            <DollarSign className="h-3 w-3" /> Illustrative arithmetic
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">Earnings Calculator</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Enter the payout, costs and total time for two runs. The calculator shows which one earns more per hour using your numbers.
          </p>
        </div>

        <MoneyMakerClient />
        <section className="mt-8 max-w-3xl space-y-3">
          <h2 className="text-xl font-bold">How to compare two GTA 6 earning runs</h2>
          <p>Time the full run, including preparation, travel and any wait before you can start again. Subtract what you spent during the run. If the payout varies, record a few runs and use their average rather than your best result.</p>
          <p>With the example inputs, a $30,000 payout minus $5,000 in costs over 30 minutes comes to $50,000 per hour. A $50,000 payout minus $10,000 in costs over 60 minutes comes to $40,000 per hour. The smaller payout wins here because the run takes half as long.</p>
          <p>For ideas to measure, see the <Link href="/guides/make-money-fast" className="underline">GTA 6 economy guide</Link>. To see how many runs you need to reach a target, use the <Link href="/tools/money-calculator" className="underline">money and savings calculator</Link>.</p>
        </section>
      </div>
    </SiteShell>
  );
}
