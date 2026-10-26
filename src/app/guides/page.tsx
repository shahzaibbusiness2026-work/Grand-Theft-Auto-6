import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { GuidesClient } from "./guides-client";
import { getPublicGuides } from "@/lib/services/guides";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GTA 6 Guides | Pre-Release Gameplay, Missions & Systems",
  description:
    "Pre-release GTA 6 guides and analysis — money systems, weapons, missions, maps and characters based on official footage and reporting, before launch.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "GTA 6 Guides | Pre-Release Gameplay, Missions & Systems",
    description:
      "Pre-release GTA 6 guides and analysis — money systems, weapons, missions, maps and characters based on official footage and reporting, before launch.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Guides | Pre-Release Gameplay, Missions & Systems",
    description:
      "Pre-release GTA 6 guides and analysis — money systems, weapons, missions, maps and characters based on official footage and reporting, before launch.",
  },
};

export default async function GuidesPage() {
  // Live guides from Supabase; empty array falls back to the static set client-side.
  let guides = [] as Awaited<ReturnType<typeof getPublicGuides>>;
  try {
    guides = await getPublicGuides();
  } catch {
    // Static fallback renders
  }

  return (
    <AppShell>
      <GuidesClient guides={guides} />
    </AppShell>
  );
}
