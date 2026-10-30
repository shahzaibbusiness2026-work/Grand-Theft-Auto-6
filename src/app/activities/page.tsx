import { SiteShell } from "@/components/shells";
import { ActivitiesClient } from "./activities-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: { url: "/activities" },
  title: "GTA 6 Activities & Hobbies",
  description:
    "Fan activity ideas and device-local planning notes. Playable GTA VI activities, rewards and locations have not been verified for this list.",
  alternates: { canonical: "/activities" },
  robots: { index: false, follow: true },
};

export default function ActivitiesPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
            Side Content
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">
            Activities &amp; Hobbies
          </h1>
          <p className="text-foreground/70 mt-3">
            Explore fan activity ideas and save the ones that interest you. This
            planning list does not establish playable GTA VI activities or
            completion requirements.
          </p>
        </div>
        <ActivitiesClient />
      </div>
    </SiteShell>
  );
}
