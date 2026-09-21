export { metadata } from './metadata';

import { Crosshair, ArrowRight, Trophy, Flame } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { ThemeImage } from "@/components/theme-image";
import { WeaponsClient } from "./weapons-client";
import { getPublicWeapons } from "@/lib/services/queries";
import type { CanonicalWeapon } from "@/lib/canonical-data";
import { canonicalWeapons } from "@/lib/canonical-data";

export default async function WeaponsPage() {
  let weapons: CanonicalWeapon[] = canonicalWeapons;
  try {
    const dbWeapons = await getPublicWeapons();

    if (dbWeapons && dbWeapons.length > 0) {
      weapons = dbWeapons.map((w) => {
        const canonicalMatch = canonicalWeapons.find((cw) => cw.id === w.id || cw.name.toLowerCase() === w.name.toLowerCase());
        return {
          id: w.id,
          slug: canonicalMatch?.slug || w.id,
          name: w.name,
          klass: (w.category as CanonicalWeapon["klass"]) || canonicalMatch?.klass || "Pistol",
          damage: canonicalMatch?.damage ?? 50,
          fireRate: canonicalMatch?.fireRate ?? 50,
          accuracy: canonicalMatch?.accuracy ?? 50,
          range: canonicalMatch?.range ?? 50,
          handling: canonicalMatch?.handling ?? 50,
          reloadTime: canonicalMatch?.reloadTime ?? "2.5s",
          magazineSize: parseInt(w.magazineSize || "15", 10) || 15,
          ammoType: w.ammunition || canonicalMatch?.ammoType || "9mm Standard",
          price: canonicalMatch?.price ?? null,
          priceDisplay: canonicalMatch?.priceDisplay ?? "TBD",
          rarity: canonicalMatch?.rarity || "Common",
          locations: canonicalMatch?.locations || [w.acquisitionMethod || "Ammu-Nation"],
          attachments: canonicalMatch?.attachments || [],
          confidence: w.verification === "verified" ? "CONFIRMED" : "SPECULATION",
          source: w.notes || canonicalMatch?.source || "In-game Database",
          description: w.notes || canonicalMatch?.description || `${w.name} in Grand Theft Auto VI.`,
          img: canonicalMatch?.img || "/img/hero-dark.jpg",
        };
      });
    }
  } catch {
    // fallback to canonicalWeapons
  }

  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-site pt-8">
        <div className="card-surface relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <ThemeImage
            dark="/img/hero-dark.jpg"
            light="/img/hero-light.jpg"
            alt="Vice City Arsenal"
            className="absolute inset-0 h-full w-full object-cover opacity-60 brightness-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="relative px-6 py-12 sm:px-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent mb-3">
              <Crosshair className="h-3 w-3" /> Ballistics & Hardware Catalog
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-white">
              LEONIDA <span className="bg-gradient-to-r from-primary via-accent to-rose-400 bg-clip-text text-transparent">ARMORY</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
              Verified damage ratings, cycle rates, recoil patterns, attachments, and street drop locations for the entire GTA 6 weapon roster.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/compare/weapons" className="bg-gradient-to-r from-primary to-accent font-bold text-xs">
                Compare Weapons (2-4) <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button href="/tools/loadout-builder" variant="outline" className="text-xs font-semibold">
                Open Loadout Builder
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WEAPONS CATALOG */}
      <section className="container-site py-10">
        <WeaponsClient initialWeapons={weapons} />
      </section>
    </SiteShell>
  );
}

