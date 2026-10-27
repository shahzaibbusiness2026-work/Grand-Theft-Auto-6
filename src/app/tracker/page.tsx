import { SiteShell } from "@/components/shells";
import { TrackerClient } from "./tracker-client";
import { getSiteSettings } from "@/lib/services/settings";
import { FeatureDisabled } from "@/components/feature-disabled";
import { getTrackerCategories } from "@/lib/services/tracker";
import { Trophy } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  openGraph: { url: "/tracker" },
  title: "100% Completion Tracker & Checklist",
  description:
    "A preview of Taish Gaming's completion tracker. Verified GTA VI requirements will be added when they can be checked; no game-completion rewards are currently asserted.",
  alternates: { canonical: "/tracker" },
};

export default async function TrackerPage() {
  const settings = await getSiteSettings();
  if (!(settings.publicToolToggles ?? []).includes("track_tool")) {
    return (
      <SiteShell>
        <FeatureDisabled title="Completion Tracker" />
      </SiteShell>
    );
  }
  // Admin-configured categories (site_settings.completion_tracker_config)
  // drive which checklist categories the public tracker shows.
  const trackerConfig = await getTrackerCategories();

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-gold-dark dark:text-gold-light mb-3">
            <Trophy className="h-3 w-3" /> 100% Game Completion
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
            LEONIDA <span className="text-primary">COMPLETION TRACKER</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            GTA VI completion requirements and rewards have not been verified
            for this tracker. We have withdrawn illustrative mission and
            achievement entries. Your saved local progress is retained; reviewed
            requirements will be added when evidence is available.
          </p>
        </div>

        <TrackerClient config={trackerConfig} />
      </div>
    </SiteShell>
  );
}
