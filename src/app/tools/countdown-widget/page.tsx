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
  title: "GTA 6 Release Date & Launch Timeline",
  description: "GTA 6 launched 19 November 2026 on PS5 and Xbox at local midnight, with pre-loading from 10 November. Launch timeline, time zones and a free embed widget.",

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
                  { "@type": "ListItem", position: 3, name: "GTA 6 Release Date & Launch Timeline", item: "https://www.taishgaming.com/tools/countdown-widget" },
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
            GTA 6 <span className="text-primary">RELEASE DATE &amp; LAUNCH TIMELINE</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            GTA 6 launched on 19 November 2026 on PlayStation 5 and Xbox Series X|S,
            at local midnight in every region. Digital pre-loading opened on 10 November:
            at midnight local time on PS5, and at 12 a.m. GMT worldwide on Xbox Series X|S
            (9 November evening in the US). The pre-load file needs up to 212 GB
            depending on your device. The widget below reached zero at launch and now
            shows the game is out — and it is still free to embed on your site or stream
            as a launch-time reference. Pick a size below to copy the embed code.
          </p>
          <TimezoneNoteClient />
        </div>

        <CountdownWidgetClient />
      </div>
    </SiteShell>
  );
}
