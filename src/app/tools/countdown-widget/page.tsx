import { SiteShell } from "@/components/shells";
import { CountdownWidgetClient } from "./countdown-widget-client";
import { Code2, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Countdown Widget — Embed on Your Site",
  description: "Get a free embeddable GTA 6 launch countdown widget for your website or stream overlay. Copy-paste ready.",
};

export default function CountdownWidgetPage() {
  return (
    <SiteShell>
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
            GTA 6 <span className="text-primary">COUNTDOWN WIDGET</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick a size, preview the live countdown below, then copy the embed code and paste it into your website or stream overlay. Free for everyone.
          </p>
        </div>

        <CountdownWidgetClient />
      </div>
    </SiteShell>
  );
}
