import Link from "next/link";
import { ArrowRight, Sparkles, Wrench } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All 32 Interactive Tools & Calculators — Taish Gaming",
  description:
    "Complete suite of 32 production-ready interactive tools for Grand Theft Auto VI: interactive maps, comparison duels, profit calculators, loadout builders, 100% tracker, achievements, activities, Easter eggs, businesses, money guides and more.",
  alternates: { canonical: "/tools" },
};

import { ALL_TOOLS } from "@/lib/tools-data";

const CATEGORIES = [
  "All Tools",
  "Maps & Exploration",
  "Databases & Compare",
  "Financial & Business",
  "Combat & Loadouts",
  "AI & Assistance",
  "Guides & Reference",
] as const;

export default function ToolsPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Taish Gaming Tools",
            description: "Interactive tools and calculators for Grand Theft Auto VI.",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "GTA 6 Money Calculator", item: "https://www.taishgaming.com/tools/money-calculator" },
              { "@type": "ListItem", position: 2, name: "GTA 6 Business Profit Calculator", item: "https://www.taishgaming.com/tools/business-profit-calculator" },
              { "@type": "ListItem", position: 3, name: "GTA 6 Money-Making Method Finder", item: "https://www.taishgaming.com/tools/money-maker" },
              { "@type": "ListItem", position: 4, name: "GTA 6 Loadout Builder", item: "https://www.taishgaming.com/tools/loadout-builder" },
              { "@type": "ListItem", position: 5, name: "GTA 6 Vehicle Upgrade Calculator", item: "https://www.taishgaming.com/tools/vehicle-upgrade-calculator" },
            ],
          }),
        }}
      />
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="card-carbon p-8 md:p-12 mb-10 border-primary/30 relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/10 dark:from-slate-900 dark:via-slate-950">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" /> Complete Utility Suite
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
              TAISH GAMING <span className="text-primary">TOOLBOX</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore all 15 fully interactive utilities engineered for Grand Theft Auto VI.
              From satellite map navigation and comparison duels to financial simulators, loadout builders, and grounded AI.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-12">
          {CATEGORIES.filter((c) => c !== "All Tools").map((cat) => {
            const catTools = ALL_TOOLS.filter((t) => t.category === cat);
            return (
              <section key={cat} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h2 className="font-display text-lg font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" /> {cat}
                  </h2>
                  <span className="text-xs font-mono text-muted-foreground">
                    {catTools.length} Utilities
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catTools.map((t) => {
                    const IconComponent = t.icon;
                    return (
                      <Link
                        key={t.id}
                        href={t.href}
                        className="card-carbon p-6 flex flex-col justify-between border border-border hover:border-primary/60 transition-all duration-200 group bg-card hover:bg-card hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="p-2.5 rounded-xl bg-muted text-primary group-hover:bg-primary group-hover:text-foreground transition-colors">
                              <IconComponent className="h-5 w-5" />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-background text-muted-foreground border border-border font-mono">
                              {t.badge}
                            </span>
                          </div>

                          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {t.name}
                          </h3>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {t.desc}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-accent group-hover:text-foreground transition-colors">
                          <span>Launch Tool</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Suggest / Contact Bar */}
        <div className="card-carbon p-6 md:p-8 mt-16 border-border flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/60">
          <div className="flex items-center gap-4">
            <span className="h-12 w-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
              <Wrench className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-foreground uppercase tracking-wider">
                Need a Custom Leonida Tool?
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our suite is continuously updated as new official Rockstar disclosures and mechanics drop.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="btn-secondary text-xs px-5 py-2.5 min-h-[44px] font-bold uppercase tracking-wider whitespace-nowrap"
          >
            Submit Feedback
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
