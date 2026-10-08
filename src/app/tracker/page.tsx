import { SiteShell } from "@/components/shells";
import { TrackerClient } from "./tracker-client";
import { getTrackerCategories } from "@/lib/services/tracker";
import { Trophy, CheckCircle2, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100% Completion Tracker & Checklist — GTA 6 Atlas",
  description:
    "Interactive 100% completion checklist for Grand Theft Auto VI (Leonida). Track story missions, submerged caches, stranger encounters, hobbies, and achievements with local auto-save.",
  alternates: { canonical: "/tracker" },
  };

export default async function TrackerPage() {
  // Admin-configured categories (site_settings.completion_tracker_config)
  // drive which checklist categories the public tracker shows.
  const trackerConfig = await getTrackerCategories();

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
            <Trophy className="h-3 w-3" /> 100% Game Completion
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
            LEONIDA <span className="text-primary">COMPLETION TRACKER</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Track your road to 100% completion across all 11 core categories in Grand Theft Auto VI.
            Mark completed objectives, record field notes, and export your offline progress backup anytime.
          </p>
        </div>

        <TrackerClient config={trackerConfig} />
      </div>
    </SiteShell>
  );
}
