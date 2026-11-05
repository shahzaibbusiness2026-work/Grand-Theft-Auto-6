import { PUBLIC_TOOL_COPY } from "@/lib/public-tool-copy";
import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { DayNightConverterClient } from "./day-night-converter-client";
import { SunMoon, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ToolStatusBanner } from "@/components/tool-status-banner";
export const metadata: Metadata = {
  openGraph: { url: "/tools/day-night-converter" },
  title: "GTA 6 Day/Night Converter (Hypothetical)",
  description: PUBLIC_TOOL_COPY["/tools/day-night-converter"],

  alternates: { canonical: "/tools/day-night-converter" },
};

export default function DayNightConverterPage() {
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
                    name: "GTA 6 Day/Night Time Converter \u2014 Real Time to Game Time",
                    item: "https://www.taishgaming.com/tools/day-night-converter",
                  },
                ],
              },
              {
                "@type": "WebApplication",
                name: "GTA 6 Day/Night Time Converter \u2014 Real Time to Game Time",
                description: PUBLIC_TOOL_COPY["/tools/day-night-converter"],
                url: "https://www.taishgaming.com/tools/day-night-converter",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Why does “wait” wrap past midnight?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "This model uses a 24-hour loop: 23:00 to 06:00 spans seven model hours. Real minutes depend on the editable ratio. This is not a verified GTA VI clock rate.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I pause the clock?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "This calculator models elapsed time and does not track a game session. GTA VI pause and clock behavior have not been verified here.",
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
          <span className="text-foreground font-bold">Day/Night Converter</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
            <SunMoon className="h-3 w-3 text-gold-light" /> Exploration Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">DAY/NIGHT CONVERTER</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            GTA VI’s clock rate is unverified. Explore a hypothetical day-night
            model with an editable ratio; two real minutes per game hour is an
            example input, not a confirmed mechanic.
          </p>
        </div>

        <DayNightConverterClient />

        <section className="mt-10 max-w-2xl" aria-labelledby="embed-converter">
          <h2 id="embed-converter" className="font-display text-2xl font-bold">
            Embed this converter on your site
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Copy the code below to show the converter on your own page. A link back to Taish Gaming is appreciated.
          </p>
          <pre className="card-surface mt-5 overflow-x-auto rounded-2xl p-5 text-xs leading-relaxed">
            <code>
              {`<iframe src="https://www.taishgaming.com/embed/day-night" width="100%" height="600" style="border:0" loading="lazy" title="GTA 6 day/night converter"></iframe>`}
            </code>
          </pre>
        </section>
      </div>
    </SiteShell>
  );
}
