import { pageOpenGraph } from "@/lib/page-metadata";
﻿import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { MoneyCalculatorClient } from "./money-calculator-client";
import { DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
export const metadata: Metadata = {
  openGraph: pageOpenGraph("/tools/money-calculator"),
  title: "GTA 6 Money Calculator: Hours & Goal Date",
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
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Are these payout values guaranteed?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No. Every preset is an illustrative savings target. Income, prices and playing time are your assumptions, not verified GTA VI payouts or purchase prices. A zero earning rate cannot reach a higher goal.",
                    },
                  },
                ],
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
            hours, and real-world completion date. Pick a goal preset or enter your own target, set your earning rate, and the calculator shows the missions and grinding hours needed plus the real-world date you would reach it. The goal amounts are examples you choose — verified GTA VI prices, payouts and required play time are not available.
          </p>
        </div>

        <MoneyCalculatorClient />

        {/* Worked example + assumptions (illustrative figures only) */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="card-surface p-6 rounded-3xl border border-border space-y-3">
            <h2 className="font-display text-base font-bold text-foreground">
              Worked example
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Using the tool&apos;s starting figures — $50,000 saved, a
              $2,850,000 goal, $35,000 per mission, $120,000 per hour and 2.5
              hours a day — here is what the calculator does with them. Every
              figure is an example you can change; none of them is a verified
              GTA VI price or payout.
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>
                Remaining to save: $2,850,000 − $50,000 ={" "}
                <strong className="text-foreground">$2,800,000</strong>.
              </li>
              <li>
                Missions needed: $2,800,000 ÷ $35,000 ={" "}
                <strong className="text-foreground">80 missions</strong>.
              </li>
              <li>
                Hours needed: $2,800,000 ÷ $120,000 ={" "}
                <strong className="text-foreground">23.3 hours</strong>.
              </li>
              <li>
                Playing days: 23.3 ÷ 2.5 ={" "}
                <strong className="text-foreground">9.3 days</strong> — so the
                goal date lands 10 calendar days after you start.
              </li>
            </ul>
          </div>
          <div className="card-surface p-6 rounded-3xl border border-border space-y-3">
            <h2 className="font-display text-base font-bold text-foreground">
              Assumptions &amp; limits
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>
                Your earning rate is assumed constant — no mission variance,
                no expenses and no in-game fees or taxes.
              </li>
              <li>
                It assumes you play every day at the hours you set. A day off
                pushes the goal date back by a day.
              </li>
              <li>
                It does not account for story-gated unlocks, one-time payouts
                or money you spend along the way.
              </li>
              <li>
                Verified GTA VI prices, payouts and required play time are not
                available — the calculator plans from your assumptions, it does
                not predict the game economy.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
