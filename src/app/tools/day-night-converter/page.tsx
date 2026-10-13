import { SiteShell } from "@/components/shells";
import { DayNightConverterClient } from "./day-night-converter-client";
import { SunMoon, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Day/Night Time Converter — Real Time to Game Time",
  description:
    "Convert between real-world minutes and GTA 6 in-game hours. See exactly what time it will be in Leonida after your session, when the next sunrise or sunset hits, and track the sun with a live day/night indicator.",
};

export default function DayNightConverterPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
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
            Time moves fast in Leonida — one in-game hour passes every 2 real-world minutes. Plan your heists, night patrols, and golden-hour screenshots by converting between real minutes and game time.
          </p>
        </div>

        <DayNightConverterClient />
      </div>
    </SiteShell>
  );
}
