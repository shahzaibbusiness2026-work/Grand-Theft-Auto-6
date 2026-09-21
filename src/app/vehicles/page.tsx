export { metadata } from './metadata';

import Link from "next/link";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { ThemeImage } from "@/components/theme-image";
import { VehiclesClient } from "./vehicles-client";
import { getPublicVehicles } from "@/lib/services/queries";
import type { CanonicalVehicle } from "@/lib/canonical-data";
import { canonicalVehicles } from "@/lib/canonical-data";

export default async function VehiclesPage() {
  // Try to get vehicles from Supabase; fall back to canonical static data
  let vehicles: CanonicalVehicle[] = canonicalVehicles;
  try {
    const dbVehicles = await getPublicVehicles();

    if (dbVehicles && dbVehicles.length > 0) {
      // Map admin vehicles to CanonicalVehicle shape
      vehicles = dbVehicles.map((v) => {
        const canonicalMatch = canonicalVehicles.find(
          (cv) => cv.id === v.id || cv.name.toLowerCase() === v.name.toLowerCase()
        );
        return {
          id: v.id,
          slug: canonicalMatch?.slug || v.id,
          name: v.name,
          manufacturer: v.manufacturer || canonicalMatch?.manufacturer || "Unknown",
          klass: (canonicalMatch?.klass || (v.class === "Sports" ? "Sports Car" : "Super Car")) as CanonicalVehicle["klass"],
          img: canonicalMatch?.img || (v.images?.[0] ?? "/img/car-purple.jpg"),
          filter: canonicalMatch?.filter,
          topSpeed: canonicalMatch?.topSpeed ?? (parseFloat(v.topSpeed || "150") || 150),
          acceleration: canonicalMatch?.acceleration ?? (parseFloat(v.acceleration || "4.0") || 4.0),
          braking: canonicalMatch?.braking ?? 75,
          handling: canonicalMatch?.handling ?? (parseFloat(v.handling || "75") || 75),
          power: canonicalMatch?.power ?? 500,
          weight: v.weight || canonicalMatch?.weight || "1,500 kg",
          seating: canonicalMatch?.seating ?? 2,
          drivetrain: canonicalMatch?.drivetrain ?? "RWD",
          price: canonicalMatch?.price ?? null,
          priceDisplay: canonicalMatch?.priceDisplay ?? "TBD",
          purchaseLocation: canonicalMatch?.purchaseLocation ?? "Southern San Andreas Super Autos",
          spawnLocations: canonicalMatch?.spawnLocations ?? ["Vice City Downtown", "Ocean Drive"],
          customizationOptions: canonicalMatch?.customizationOptions ?? ["Engine Tuning", "Brakes", "Suspension", "Turbo"],
          confidence: v.verification === "verified" ? "CONFIRMED" : "SPECULATION",
          source: v.sources?.[0]?.title || canonicalMatch?.source || "In-game Footage",
          description: v.summary || canonicalMatch?.description || `${v.name} in Grand Theft Auto VI.`,

          featured: canonicalMatch?.featured,
        };
      });

    }
  } catch {
    // Use canonical static data as fallback
  }

  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-site pt-12 sm:pt-16">
        <div className="card-surface relative overflow-hidden rounded-3xl border-border/80 shadow-2xl">
          <ThemeImage
            dark="/img/car-purple.jpg"
            light="/img/car-pink.jpg"
            alt="Super car"
            className="absolute right-0 top-0 h-full w-full object-cover object-[70%_60%] lg:w-2/3 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
          <div className="relative px-6 py-12 sm:px-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
              <Sparkles className="h-3 w-3" /> Confirmed Roster
            </div>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
              Massive Vehicle <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Showcase</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Browse cars, bikes, boats, planes, and helicopters confirmed for the state of Leonida. Filter by class, compare top speeds, or save favorites to your garage.
            </p>
          </div>
        </div>

        {/* Global Live Stats Counter */}
        <div className="card-surface -mt-6 relative mx-4 sm:mx-6 grid grid-cols-2 divide-border/80 sm:grid-cols-4 sm:divide-x rounded-2xl shadow-xl">
          {[
            [`${vehicles.length}+`, "Total Confirmed"],
            ["120+", "Sports & Supercars"],
            ["80+", "Motorcycles & Dirt"],
            ["50+", "Boats, Jets & Heli"],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col items-center gap-1 px-4 py-5 text-center">
              <span className="font-display text-2xl sm:text-3xl font-black text-accent">{v}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE CLIENT FILTER & VEHICLE ROSTER */}
      <section className="container-site py-12">
        <VehiclesClient initialVehicles={vehicles} />
      </section>

      {/* CTA BANNER */}
      <section className="container-site pb-16">
        <div className="card-surface relative overflow-hidden rounded-3xl border-border/80">
          <ThemeImage
            dark="/img/car-purple.jpg"
            light="/img/car-pink.jpg"
            alt="Dream ride"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
          <div className="relative flex flex-col gap-5 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">PLAYER GARAGE</span>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-foreground">
                Want to duel any two rides head-to-head?
              </h3>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                Open our Interactive Vehicle Comparison Duel to inspect horsepower curves, braking deltas, and 0-60 launch times.
              </p>
            </div>
            <Button href="/vehicles/compare" className="shrink-0 font-bold bg-gradient-to-r from-primary to-accent">
              Open Comparison Duel <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
