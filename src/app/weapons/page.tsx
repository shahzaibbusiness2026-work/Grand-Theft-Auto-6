export { metadata } from "./metadata";

// Cache the rendered catalog for 1 hour: the weapon database changes
// infrequently, and per-request SSR was making navigation feel broken
// (15s+ waits on every visit).
export const revalidate = 3600;

import { Crosshair, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { ThemeImage } from "@/components/theme-image";
import { EvidenceCatalog } from "@/components/evidence-catalog";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import { RelatedArticles } from "@/components/related-articles";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";

export default async function WeaponsPage() {
  // Live Supabase data first (admin edits win); canonical static entries fill the rest.
  const weapons = await getEvidenceCatalog("weapons");

  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-site pt-6">
        <div className="card-surface relative overflow-hidden rounded-3xl border border-border shadow-sm">
          <ThemeImage
            dark="/img/hero-dark.jpg"
            light="/img/hero-light.jpg"
            alt="Vice City Arsenal"
            className="absolute inset-0 h-full w-full object-cover opacity-80 dark:opacity-60 brightness-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative px-6 py-8 sm:py-12 sm:px-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-accent mb-3">
              <Crosshair className="h-3 w-3" /> Ballistics & Hardware Catalog
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
              Leonida Armory
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-[15px]">
              Explore provisional weapon identifications and inspect the
              evidence for each field. Performance, prices and availability stay
              unverified until supported by reviewed sources.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                href="/compare/weapons"
                className="bg-primary font-bold text-xs text-primary-foreground hover:bg-primary-hover min-h-[44px]"
              >
                Compare Weapons (2-4) <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                href="/tools/loadout-builder"
                variant="outline"
                className="text-xs font-semibold min-h-[44px]"
              >
                Open Loadout Builder
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WEAPONS CATALOG */}
      <section className="container-site py-7">
        <SectionErrorBoundary fallbackTitle="Could not load weapons. Please try refreshing.">
          <EvidenceCatalog kind="weapons" entries={weapons} />
        </SectionErrorBoundary>
      </section>

      {/* RELATED ARTICLES — internal linking for SEO/discovery */}
      <RelatedArticles category="Weapons" title="Weapon Guides & News" />
    </SiteShell>
  );
}
