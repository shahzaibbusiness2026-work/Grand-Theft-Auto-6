import { SiteShell } from "@/components/shells";
import { CollectiblesClient } from "./collectibles-client";
import { Sparkles, Compass } from "lucide-react";
import type { Metadata } from "next";
import { canonicalCollectibles, type CanonicalCollectible } from "@/lib/canonical-data";
import { getPublicCollectibles, type CollectibleRecord } from "@/lib/services/collectibles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collectibles Finder & Checklist — GTA 6 Atlas",
  description:
    "Interactive GTA 6 Collectibles Finder across Leonida. Track Hidden Packages, Stunt Jumps, Rebel Radio Transmitters, Wildlife Photos, and Easter Eggs with coordinate guides.",
};

/** Map a DB collectible row onto the CanonicalCollectible shape the client renders. */
function dbToCanonical(c: CollectibleRecord, match?: CanonicalCollectible): CanonicalCollectible {
  return {
    id: c.id,
    slug: c.slug || match?.slug || c.id,
    title: c.title,
    category: (c.category as CanonicalCollectible["category"]) || match?.category || "Hidden Packages",
    district: c.district || match?.district || "Vice City",
    reward: c.reward || match?.reward || "Unknown",
    requirements: c.requirements || match?.requirements || "N/A",
    description: c.description || match?.description || "",
    guideTip: c.guide_tip || match?.guideTip || "",
    coordinates: { top: c.coord_top || match?.coordinates.top || "50%", left: c.coord_left || match?.coordinates.left || "50%" },
    confidence: (c.confidence as CanonicalCollectible["confidence"]) || match?.confidence || "REPORTED",
    source: c.source || match?.source || "Atlas Admin",
    img: c.img || match?.img || "/img/treasure.svg",
  };
}

export default async function CollectiblesPage() {
  // Live Supabase collectibles first; canonical static entries fill the rest.
  let collectibles: CanonicalCollectible[] = canonicalCollectibles;
  try {
    const dbItems = await getPublicCollectibles();
    if (dbItems && dbItems.length > 0) {
      const dbIds = new Set(dbItems.map((c) => c.id.toLowerCase()));
      const dbTitles = new Set(dbItems.map((c) => c.title.toLowerCase()));
      const dbMapped = dbItems.map((c) =>
        dbToCanonical(
          c,
          canonicalCollectibles.find(
            (x) => x.id.toLowerCase() === c.id.toLowerCase() || x.title.toLowerCase() === c.title.toLowerCase()
          )
        )
      );
      const remaining = canonicalCollectibles.filter(
        (c) => !dbIds.has(c.id.toLowerCase()) && !dbTitles.has(c.title.toLowerCase())
      );
      collectibles = [...dbMapped, ...remaining];
    }
  } catch {
    // Supabase unreachable — canonical data still renders
  }

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary mb-3">
            <Compass className="h-3 w-3" /> Leonida Collectibles Database
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
            COLLECTIBLES <span className="text-primary">FINDER & GUIDE</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Locate every hidden contraband package, stunt ramp, pirate radio mast, and rare wildlife species across the State of Leonida.
            Filter by district, check off collected items, and view coordinate guides.
          </p>
        </div>

        <CollectiblesClient initialCollectibles={collectibles} />
      </div>
    </SiteShell>
  );
}
