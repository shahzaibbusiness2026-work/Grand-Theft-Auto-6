import { SiteShell } from "@/components/shells";
import { ActivitiesClient } from "./activities-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Activities & Hobbies — Tahzaib Gaming",
  description: "Every activity in GTA 6: hunting, fishing, mini-golf, diving, racing and more across Leonida. Confirmed and expected activities with an interactive checklist.",
  alternates: { canonical: "/activities" },
};

export default function ActivitiesPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Side Content</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Activities &amp; Hobbies</h1>
          <p className="text-foreground/70 mt-3">When you&apos;re not running heists, Leonida keeps you busy. Hunting in Kalaga, fishing in the Keys, mini-golf with Cal — everything to do between missions.</p>
        </div>
        <ActivitiesClient />
      </div>
    </SiteShell>
  );
}
