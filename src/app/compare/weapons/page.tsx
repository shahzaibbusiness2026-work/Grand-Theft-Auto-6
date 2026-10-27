import { SiteShell } from "@/components/shells";
import { EvidenceCatalog } from "@/components/evidence-catalog";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";

import { Crosshair } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "GTA 6 Weapon Comparison Tool | Compare Weapons & Evidence",
  },
  description:
    "Compare up to four editorial weapon identifications with reviewed field-specific evidence. Missing statistics remain unverified.",
  alternates: { canonical: "/compare/weapons" },
  openGraph: {
    url: "/compare/weapons",
    title: "GTA 6 Weapon Comparison Tool | Compare Weapons & Evidence",
    description:
      "Compare up to four editorial weapon identifications with reviewed field-specific evidence. Missing statistics remain unverified.",
    images: ["/img/hero-dark.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Weapon Comparison Tool | Compare Weapons & Evidence",
    description:
      "Compare up to four editorial weapon identifications with reviewed field-specific evidence. Missing statistics remain unverified.",
    images: ["/img/hero-dark.jpg"],
  },
};

export const revalidate = 3600;

export default async function CompareWeaponsPage() {
  // Live Supabase catalog (admin edits win) + CMS-configured score weights.
  const entries = await getEvidenceCatalog("weapons");

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary mb-3">
            <Crosshair className="h-3 w-3" /> Armory Evidence Comparison
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
            COMPARE <span className="text-primary">GTA 6 WEAPONS</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Select up to four weapon identifications and inspect their reviewed
            evidence side by side. Unsupported statistics and winners are
            withheld.
          </p>
        </div>

        <EvidenceCatalog kind="weapons" entries={entries} compare />
      </div>
    </SiteShell>
  );
}
