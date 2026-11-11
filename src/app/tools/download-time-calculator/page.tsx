import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { DownloadTimeCalculatorClient } from "./download-time-calculator-client";
import { Download, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/page-metadata";

export const metadata: Metadata = {
  openGraph: pageOpenGraph("/tools/download-time-calculator"),
  title: "GTA 6 Download Time Calculator",
  description:
    "How long will the GTA 6 pre-load take? Enter your download speed and game size to estimate ideal and realistic download times, plus the free space to keep.",
  alternates: { canonical: "/tools/download-time-calculator" },
};

export default function DownloadTimeCalculatorPage() {
  return (
    <SiteShell>
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
                    name: "GTA 6 Download Time Calculator",
                    item: "https://www.taishgaming.com/tools/download-time-calculator",
                  },
                ],
              }
            ],
          }),
        }}
      />
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="transition-colors hover:text-primary">
            Tools
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-bold text-foreground">
            Download Time Calculator
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <Download className="h-3 w-3 text-gold-light" /> Launch Prep
            Utility
          </div>
          <h1 className="font-display text-3xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            GTA 6 <span className="text-primary">DOWNLOAD TIME CALCULATOR</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The GTA 6 pre-load file is up to 212 GB (Rockstar, November 3,
            2026). Enter your sustained download speed to see how long it
            takes — and how much free space to keep. The math is simple: the file size in megabits divided by your sustained speed. Use your real sustained speed, not the advertised maximum, for a realistic estimate — and keep extra free space beyond the 212 GB for updates.
          </p>
        </div>

        <DownloadTimeCalculatorClient />
      </div>
    </SiteShell>
  );
}
