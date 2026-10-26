import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { WantedLevelGuideClient } from "./wanted-level-guide-client";
import { Siren, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
export const metadata: Metadata = {
    openGraph: { url: "/tools/wanted-level-guide" },
  title: "GTA 6 Wanted Level Guide — Police Response & Escape Tips",
  description: "Interactive guide to GTA 6's 1-5 star wanted levels: police units, helicopters, roadblocks, spike strips, estimated evade times, and escape tips for every level.",

  alternates: { canonical: "/tools/wanted-level-guide" },
};

export default function WantedLevelGuidePage() {
  return (
        <SiteShell>
          <ToolStatusBanner status="postlaunch" />
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
                  { "@type": "ListItem", position: 3, name: "GTA 6 Wanted Level Guide \u2014 Police Response & Escape Tips", item: "https://www.taishgaming.com/tools/wanted-level-guide" },
                ],
              },
              {
                "@type": "WebApplication",
                name: "GTA 6 Wanted Level Guide \u2014 Police Response & Escape Tips",
                description: "Interactive guide to GTA 6's 1-5 star wanted levels: police units, helicopters, roadblocks, spike strips, estimated evade times, and escape tips for every level.",
                url: "https://www.taishgaming.com/tools/wanted-level-guide",
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
          <span className="text-foreground font-bold">Wanted Level Guide</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary mb-3">
            <Siren className="h-3 w-3" /> Combat Survival Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">WANTED LEVEL GUIDE</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Select any star level to see the police response, units deployed, estimated evade time, and the best escape tactics — from a single patrol car up to full FIB pursuit.
          </p>
        </div>

        <WantedLevelGuideClient />
      </div>
    </SiteShell>
  );
}
