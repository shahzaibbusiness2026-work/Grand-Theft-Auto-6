import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { GaragePlannerClient } from "./garage-planner-client";
import { Warehouse, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
export const metadata: Metadata = {
    openGraph: { url: "/tools/garage-planner" },
  title: "GTA 6 Garage Planner — Organize Your Vehicle Collection",
  description: "Plan your GTA 6 garage space. Assign vehicles to properties, track slots used, and see your collection's total value.",

  alternates: { canonical: "/tools/garage-planner" },
};

export default function GaragePlannerPage() {
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
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://www.taishgaming.com/" },
                  { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.taishgaming.com/tools" },
                  { "@type": "ListItem", position: 3, name: "GTA 6 Garage Planner \u2014 Organize Your Vehicle Collection", item: "https://www.taishgaming.com/tools/garage-planner" },
                ],
              },
              {
                "@type": "WebApplication",
                name: "GTA 6 Garage Planner \u2014 Organize Your Vehicle Collection",
                description: "Plan your GTA 6 garage space. Assign vehicles to properties, track slots used, and see your collection's total value.",
                url: "https://www.taishgaming.com/tools/garage-planner",
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
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">Garage Planner</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-cyan-400 mb-3">
            <Warehouse className="h-3 w-3" /> Collection Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">GARAGE PLANNER</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Plan your GTA 6 garage space. Assign vehicles to properties, track slots used across your safehouses, and see your collection&apos;s total estimated value.
          </p>
        </div>

        <GaragePlannerClient />
      </div>
    </SiteShell>
  );
}
