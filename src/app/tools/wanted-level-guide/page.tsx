import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { WantedLevelGuideClient } from "./wanted-level-guide-client";
import { Siren, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
import { PUBLIC_TOOL_COPY } from "@/lib/public-tool-copy";
const title = "GTA 6 Wanted Levels: Evidence Status";
const description = PUBLIC_TOOL_COPY["/tools/wanted-level-guide"];
export const metadata: Metadata = {
  robots: { index: false, follow: true },
    openGraph: { url: "/tools/wanted-level-guide" },
  title,
  description,

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
                  { "@type": "ListItem", position: 3, name: title, item: "https://www.taishgaming.com/tools/wanted-level-guide" },
                ],
              },
              {
                "@type": "WebApplication",
                name: title,
                description,
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
          <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        </div>

        <WantedLevelGuideClient />
      </div>
    </SiteShell>
  );
}
