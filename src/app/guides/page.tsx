import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { GuidesClient } from "./guides-client";
import { getPublicGuides } from "@/lib/services/guides";
import { serializeJsonLd } from "@/lib/utils";
import { itemListJsonLd } from "@/lib/page-metadata";

export const revalidate = 300;

const title = "GTA 6 Guides: Controls, Walkthroughs & Locations";
const description = "Find GTA 6 guides for PS5 and Xbox controls, your first session, weapon and vehicle pickups, the Leonida map and 100% completion.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guides" },
  openGraph: { type: "website", url: "/guides",
    title,
    description,
    images: [{ url: "/img/hero-vice-skyline-hd.jpg", alt: "Taish Gaming — Leonida skyline" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/hero-vice-skyline-hd.jpg"],
    title,
    description,
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
