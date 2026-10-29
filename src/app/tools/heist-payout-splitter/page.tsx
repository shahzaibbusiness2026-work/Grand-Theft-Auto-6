import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { HeistPayoutSplitterClient } from "./heist-payout-splitter-client";
import { Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
import { PUBLIC_TOOL_COPY } from "@/lib/public-tool-copy";
const title = "GTA 6 Heist Split Calculator: Custom Inputs";
const description = PUBLIC_TOOL_COPY["/tools/heist-payout-splitter"];
export const metadata: Metadata = {
    openGraph: { url: "/tools/heist-payout-splitter" },
  title,
  description,

  alternates: { canonical: "/tools/heist-payout-splitter" },
};

export default function HeistPayoutSplitterPage() {
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
                  { "@type": "ListItem", position: 3, name: title, item: "https://www.taishgaming.com/tools/heist-payout-splitter" },
                ],
              },
              {
                "@type": "WebApplication",
                name: title,
                description,
                url: "https://www.taishgaming.com/tools/heist-payout-splitter",
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
          <span className="text-foreground font-bold">Heist Payout Splitter</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">
            <Users className="h-3 w-3" /> Crew Payout Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">HEIST PAYOUT SPLITTER</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        </div>

        <HeistPayoutSplitterClient />
      </div>
    </SiteShell>
  );
}
