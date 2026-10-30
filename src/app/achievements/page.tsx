import { SiteShell } from "@/components/shells";
import { AchievementsClient } from "./achievements-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: { url: "/achievements" },
  title: "GTA 6 Achievements & Trophies Tracker",
  description: "Fan-made trophy checklist concept for GTA VI. Rockstar has not published an official trophy or achievement list.",
  alternates: { canonical: "/achievements" },
  robots: { index: false, follow: true },
};

export default function AchievementsPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Trackers</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Achievements &amp; Trophies</h1>
          <p className="text-foreground/70 mt-3">This is a fan-made checklist concept, not a leaked or expected official list. Rockstar has not published GTA VI trophies or achievements; individual checklist entries are unverified.</p>
        </div>
        <AchievementsClient />
      </div>
    </SiteShell>
  );
}
