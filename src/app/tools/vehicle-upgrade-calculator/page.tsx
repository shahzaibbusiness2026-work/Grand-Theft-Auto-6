import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { VehicleUpgradeCalculatorClient } from "./vehicle-upgrade-calculator-client";
import { Wrench, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
import { PUBLIC_TOOL_COPY } from "@/lib/public-tool-copy";
const title = "GTA 6 Upgrade Budget Simulator";
const description = PUBLIC_TOOL_COPY["/tools/vehicle-upgrade-calculator"];
export const metadata: Metadata = {
    openGraph: { url: "/tools/vehicle-upgrade-calculator" },
  title,
  description,

  alternates: { canonical: "/tools/vehicle-upgrade-calculator" },
};

export default function VehicleUpgradeCalculatorPage() {
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
                  { "@type": "ListItem", position: 3, name: title, item: "https://www.taishgaming.com/tools/vehicle-upgrade-calculator" },
                ],
              },
              {
                "@type": "WebApplication",
                name: title,
                description,
                url: "https://www.taishgaming.com/tools/vehicle-upgrade-calculator",
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
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">Vehicle Upgrade Calculator</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A86A]/40 bg-[#C9A86A]/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#C9A86A] mb-3">
            <Wrench className="h-3 w-3" /> Performance Tuning Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">VEHICLE UPGRADE CALCULATOR</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        </div>

        <VehicleUpgradeCalculatorClient />
      </div>
    </SiteShell>
  );
}
