import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { BusinessCalculatorClient } from "./business-calculator-client";
import { Building2, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
export const metadata: Metadata = {
  openGraph: { url: "/tools/business-profit-calculator" },
  title: "Business Profit & ROI Scenario Calculator",
  description:
    "Model net profit, losses and break-even time with editable assumptions. Example values are not verified GTA VI business data.",

  alternates: { canonical: "/tools/business-profit-calculator" },
};

export default function BusinessProfitCalculatorPage() {
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
                    name: "Business Profit & ROI Scenario Calculator",
                    item: "https://www.taishgaming.com/tools/business-profit-calculator",
                  },
                ],
              },
              {
                "@type": "WebApplication",
                name: "Business Profit & ROI Scenario Calculator",
                description:
                  "Model net profit, losses and break-even time with editable assumptions. Example values are not verified GTA VI business data.",
                url: "https://www.taishgaming.com/tools/business-profit-calculator",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ],
          }),
        }}
      />
      <div className="container-site py-8">
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
            Business Profit Calculator
          </span>
        </nav>

        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/40 bg-[#00F0FF]/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#00F0FF] mb-3">
            <Building2 className="h-3 w-3" /> Enterprise Cashflow Engine
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            BUSINESS PROFIT &{" "}
            <span className="text-primary">ROI CALCULATOR</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Model income, operating costs, losses and capital recovery using
            your own assumptions. These examples are not verified GTA VI
            businesses.
          </p>
        </div>

        <BusinessCalculatorClient />
      </div>
    </SiteShell>
  );
}
