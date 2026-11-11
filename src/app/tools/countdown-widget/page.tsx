import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { CountdownWidgetClient } from "./countdown-widget-client";
import { TimezoneNoteClient } from "./timezone-note-client";
import { Code2, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/page-metadata";

export const metadata: Metadata = {
    openGraph: pageOpenGraph("/tools/countdown-widget"),
  title: "GTA 6 Countdown: Release Time in Your Zone",
  description: "GTA 6 launches 19 November 2026 on PS5 and Xbox, preload from 10 November. Live countdown in your timezone, local launch time and a free embed.",

  alternates: { canonical: "/tools/countdown-widget" },
};

export default function CountdownWidgetPage() {
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
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://www.taishgaming.com/" },
                  { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.taishgaming.com/tools" },
                  { "@type": "ListItem", position: 3, name: "GTA 6 Release Time & Countdown", item: "https://www.taishgaming.com/tools/countdown-widget" },
                ],
              }
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
          <span className="text-foreground font-bold">Countdown Widget</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-gold-light mb-3">
            <Code2 className="h-3 w-3" /> Free Embed Widget
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">RELEASE TIME &amp; COUNTDOWN</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            GTA 6 launches November 19, 2026 on PlayStation 5 and Xbox Series X|S,
            at local midnight in your region. Digital pre-loading opens November 10:
            at midnight local time on PS5, and at 12 a.m. GMT worldwide on Xbox Series X|S
            (November 9 evening in the US). The pre-load file needs up to 212 GB
            depending on your device. The live countdown below tracks launch day,
            and the widget is free to embed on your site or stream. The timer counts down to local midnight on 19 November 2026 in your timezone and shows the pre-load date alongside it. Pick a size below to copy the free embed code for your own page — it shows the same live countdown there.
          </p>
          <TimezoneNoteClient />
        </div>

        <CountdownWidgetClient />
      </div>
    </SiteShell>
  );
}
