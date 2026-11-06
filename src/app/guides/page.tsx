import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { GuidesClient } from "./guides-client";
import { getPublicGuides } from "@/lib/services/guides";
import { serializeJsonLd } from "@/lib/utils";
import { itemListJsonLd } from "@/lib/page-metadata";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "GTA 6 Guides: Map, Characters & Release",
  description:
    "Explore GTA 6 map evidence, Leonida destinations, character backgrounds and release planning, with sources and clear limits on unverified gameplay claims.",
  alternates: { canonical: "/guides" },
  openGraph: { type: "website", url: "/guides",
    title: "GTA 6 Guides: Map, Characters & Release",
    description:
      "Source-linked map, character and release guides, with official facts separated from unverified gameplay claims.",
    images: [{ url: "/img/hero-dark.jpg", alt: "Taish Gaming — Leonida skyline" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/hero-dark.jpg"],
    title: "GTA 6 Guides: Map, Characters & Release",
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
      {guides.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(
              itemListJsonLd(
                "GTA 6 Guides",
                "Source-linked GTA 6 guides from Taish Gaming.",
                guides
                  .filter((g) => g.slug)
                  .map((g) => ({
                    name: g.title,
                    url: `https://www.taishgaming.com/guides/${g.slug}`,
                  })),
              ),
            ),
          }}
        />
      )}
      <GuidesClient guides={guides} />
    </AppShell>
  );
}
