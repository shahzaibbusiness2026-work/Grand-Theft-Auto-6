import { SiteShell } from "@/components/shells";
import { AchievementsClient } from "./achievements-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    openGraph: { url: "/achievements" },
  title: "GTA 6 Achievements & Trophies Tracker",
  description: "Pre-release data: the expected GTA 6 trophy and achievement list with an interactive tracker. Story, exploration, combat, collectible and hidden trophies — progress saves on your device.",
  alternates: { canonical: "/achievements" },
};

export default function AchievementsPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Trackers</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Achievements &amp; Trophies</h1>
          <p className="text-foreground/70 mt-3">The expected trophy list for Leonida, built from pre-release data — story milestones, exploration, combat, collectibles and the hidden ones. Tick them off as you plan your hunt; the list will be corrected against Rockstar’s real list at launch.</p>
        </div>
        <AchievementsClient />
      </div>
    </SiteShell>
  );
}
