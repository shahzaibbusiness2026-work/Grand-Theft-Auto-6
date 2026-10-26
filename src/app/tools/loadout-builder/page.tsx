import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { LoadoutClient } from "./loadout-client";
import { Crosshair, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
export const metadata: Metadata = {
  title: "GTA 6 Tactical Loadout Builder & Armory Scoring",
  description:
    "Assemble and simulate custom GTA 6 weapon loadouts for heists, street wars, and recon operations. Real-time firepower, mobility, and stealth ratings with offline saving.",

  alternates: { canonical: "/tools/loadout-builder" },
};

export default function LoadoutBuilderPage() {
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
                  { "@type": "ListItem", position: 3, name: "GTA 6 Tactical Loadout Builder & Armory Scoring \u2014 Taish Gaming", item: "https://www.taishgaming.com/tools/loadout-builder" },
                ],
              },
              {
                "@type": "WebApplication",
                name: "GTA 6 Tactical Loadout Builder & Armory Scoring \u2014 Taish Gaming",
                description: "Assemble and simulate custom GTA 6 weapon loadouts for heists, street wars, and recon operations. Real-time firepower, mobility, and stealth ratings with offline saving.",
                url: "https://www.taishgaming.com/tools/loadout-builder",
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
          <span className="text-foreground font-bold">Loadout Builder</span>
        </nav>

        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary mb-3">
            <Crosshair className="h-3 w-3" /> Tactical Armory Builder
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">LOADOUT BUILDER</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Engineer your tactical weapon loadouts for Leonida heists, gang warfare, and covert wet operations.
            Analyze real-time firepower, mobility trade-offs, and save custom builds to your personal armory.
          </p>
        </div>

        <LoadoutClient />
      </div>
    </SiteShell>
  );
}
