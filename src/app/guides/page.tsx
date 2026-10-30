import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { GuidesClient } from "./guides-client";
import { getPublicGuides } from "@/lib/services/guides";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "GTA 6 Guides: Map, Characters & Release Planning",
  description:
    "Explore GTA 6 map evidence, Leonida destinations, character backgrounds and release planning, with sources and clear limits on unverified gameplay claims.",
  alternates: { canonical: "/guides" },
  openGraph: { type: "website", url: "/guides",
    title: "GTA 6 Guides: Map, Characters & Release Planning",
    description:
      "Source-linked map, character and release guides, with official facts separated from unverified gameplay claims.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Guides: Map, Characters & Release Planning",
    description:
      "Source-linked map, character and release guides, with official facts separated from unverified gameplay claims.",
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
