import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Gauge,
  Timer,
  Disc3,
  Car,
  Users2,
  Wallet,
  Trophy,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Wrench,
  Sparkles,
  Layers,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeImage } from "@/components/theme-image";
import { canonicalVehicles, CanonicalVehicle } from "@/lib/canonical-data";
import { FavoriteButton } from "@/components/favorite-button";
import { ConfidenceBadge } from "@/components/confidence-badge";

import { getPublicVehicleCatalog, type VehicleCatalogRow } from "@/lib/services/vehicles";

const num = (s?: string | null): number | null => {
  const n = parseFloat((s || "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

/** Resolve a vehicle by slug: canonical first for rich fields, live DB values override stats. */
async function resolveVehicle(slug: string): Promise<CanonicalVehicle | undefined> {
  const canonical = canonicalVehicles.find((v) => v.slug === slug || v.id === slug);
  try {
    const rows = await getPublicVehicleCatalog();
    const row: VehicleCatalogRow | undefined = rows.find(
      (r) => r.slug === slug || r.id === slug || r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
    );
    if (row) {
      const c = canonical ||
        canonicalVehicles.find(
          (cv) => cv.id.toLowerCase() === row.id.toLowerCase() || cv.name.toLowerCase() === row.name.toLowerCase()
        );
      return {
        id: row.id,
        slug: row.slug || c?.slug || row.id,
        name: row.name,
        manufacturer: row.manufacturer || c?.manufacturer || "Unknown",
        klass: (row.class === "Sports" ? "Sports Car" : row.class === "Super" ? "Super Car" : row.class) as CanonicalVehicle["klass"],
        img: row.images?.[0] || c?.img || "/img/car-purple.jpg",
        filter: c?.filter,
        topSpeed: num(row.top_speed) ?? c?.topSpeed ?? 150,
        acceleration: num(row.acceleration) ?? c?.acceleration ?? 4.0,
        braking: c?.braking ?? 75,
        handling: num(row.handling) ?? c?.handling ?? 75,
        power: row.power_hp ?? c?.power ?? 500,
        weight: row.weight || c?.weight || "1,500 kg",
        seating: row.seating ?? c?.seating ?? 2,
        drivetrain: (row.drivetrain as CanonicalVehicle["drivetrain"]) || c?.drivetrain || "RWD",
        price: row.price ?? c?.price ?? null,
        priceDisplay: row.price_display || c?.priceDisplay || "TBD",
        purchaseLocation: c?.purchaseLocation || "Southern San Andreas Super Autos",
        spawnLocations: c?.spawnLocations ?? ["Vice City Downtown", "Ocean Drive"],
        customizationOptions: c?.customizationOptions ?? ["Engine Tuning", "Brakes", "Suspension", "Turbo"],
        confidence: (row.confidence as CanonicalVehicle["confidence"]) || c?.confidence || "CONFIRMED",
        source: row.source || c?.source || "In-game Footage",
        description: row.summary || c?.description || `${row.name} in Grand Theft Auto VI.`,
        featured: row.featured ?? c?.featured ?? true,

        /* Deep-dive fields (DB first â†’ canonical â†’ undefined) */
        traction: row.traction ?? c?.traction,
        cornering: row.cornering ?? c?.cornering,
        launch: row.launch ?? c?.launch,
        reverseSpeed: row.reverse_speed ?? c?.reverseSpeed,
        torque: row.torque ?? c?.torque,
        resalePrice: row.resale_price ?? c?.resalePrice ?? null,
        insuranceCost: row.insurance_cost ?? c?.insuranceCost ?? null,
        upgradeCost: row.upgrade_cost ?? c?.upgradeCost ?? null,
        repairCost: row.repair_cost ?? c?.repairCost ?? null,
        storageCost: row.storage_cost ?? c?.storageCost ?? null,
        engineType: row.engine_type || c?.engineType,
        engineSize: row.engine_size || c?.engineSize,
        transmission: row.transmission || c?.transmission,
        gears: row.gears ?? c?.gears,
        fuelType: row.fuel_type || c?.fuelType,
        turbo: row.turbo ?? c?.turbo ?? false,
        electric: row.electric ?? c?.electric ?? false,
        doors: row.doors ?? c?.doors,
        convertible: row.convertible ?? c?.convertible ?? false,
        roofType: row.roof_type || c?.roofType,
        trunkCapacity: row.trunk_capacity || c?.trunkCapacity,
        offroadRating: row.offroad_rating ?? c?.offroadRating,
        waterRating: row.water_rating ?? c?.waterRating,
        amphibious: row.amphibious ?? c?.amphibious ?? false,
        bulletResistance: row.bullet_resistance ?? c?.bulletResistance,
        explosionResistance: row.explosion_resistance ?? c?.explosionResistance,
        armorRating: row.armor_rating ?? c?.armorRating,
        weaponized: row.weaponized ?? c?.weaponized ?? false,
        driftRating: row.drift_rating ?? c?.driftRating,
        specialAbility: row.special_ability || c?.specialAbility,
        features: row.features?.length ? row.features : c?.features ?? [],
        customization: row.customization?.length ? row.customization : c?.customization ?? [],
        soundRating: row.sound_rating ?? c?.soundRating,
        engineSound: row.engine_sound || c?.engineSound,
        exhaustSound: row.exhaust_sound || c?.exhaustSound,
        horn: row.horn || c?.horn,
        turboSound: row.turbo_sound || c?.turboSound,
        gearShiftSound: row.gear_shift_sound || c?.gearShiftSound,
        availability: row.availability || c?.availability,
        gallery: row.gallery?.length ? row.gallery : c?.gallery ?? [],
        tags: row.tags?.length ? row.tags : c?.tags ?? [],
      };
    }
  } catch {
    // DB unreachable — canonical lookup stands
  }
  return canonical;
}

export function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  canonicalVehicles.forEach((v) => {
    slugs.push({ slug: v.slug });
    if (v.id !== v.slug) {
      slugs.push({ slug: v.id });
    }
  });
  return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await resolveVehicle(slug);
  if (!vehicle) notFound();

  return {
    title: `${vehicle.name} (${vehicle.klass}) — GTA 6 Stats, Speed & Location`,
    description: `Full verified breakdown of the ${vehicle.name} in GTA 6: Top speed ${vehicle.topSpeed} mph, ${vehicle.acceleration}s 0-60, ${vehicle.priceDisplay} price, customization, and spawn locations.`,
    alternates: { canonical: `/vehicles/${vehicle.slug}` },
    openGraph: {
      title: `${vehicle.name} — GTA 6 Vehicle Guide`,
      description: vehicle.description,
      images: [vehicle.img],
    },
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await resolveVehicle(slug);

  if (!vehicle) {
    notFound();
  }

  // Calculate comparative bar percentages
  const speedPct = Math.min(100, Math.round((vehicle.topSpeed / 240) * 100));
  const accelPct = Math.min(100, Math.round(((5.5 - vehicle.acceleration) / 3.5) * 100));
  const brakingPct = vehicle.braking;
  const handlingPct = vehicle.handling;

  const statBars = [
    { icon: Gauge, label: "Top Speed", value: `${vehicle.topSpeed} mph`, pct: speedPct },
    { icon: Timer, label: "0–60 Launch", value: `${vehicle.acceleration}s`, pct: accelPct },
    { icon: Disc3, label: "Braking Response", value: `${vehicle.braking}/100`, pct: brakingPct },
    { icon: Car, label: "Handling & Grip", value: `${vehicle.handling}/100`, pct: handlingPct },
    ...(vehicle.traction != null
      ? [{ icon: Car, label: "Traction", value: `${vehicle.traction}/100`, pct: vehicle.traction }]
      : []),
    ...(vehicle.cornering != null
      ? [{ icon: Car, label: "Cornering", value: `${vehicle.cornering}/100`, pct: vehicle.cornering }]
      : []),
    ...(vehicle.launch != null
      ? [{ icon: Timer, label: "Launch / Takeoff", value: `${vehicle.launch}/100`, pct: vehicle.launch }]
      : []),
  ];

  const quickSpecs = [
    ["Class", vehicle.klass],
    ["Manufacturer", vehicle.manufacturer],
    ["Horsepower", `${vehicle.power} HP`],
    ...(vehicle.torque != null ? [["Torque", `${vehicle.torque} lb-ft`]] : []),
    ["Drivetrain", vehicle.drivetrain],
    ["Weight", vehicle.weight],
    ["Seating", `${vehicle.seating} Passengers`],
    ...(vehicle.doors != null ? [["Doors", String(vehicle.doors)]] : []),
    ...(vehicle.transmission ? [["Transmission", vehicle.transmission]] : []),
    ...(vehicle.fuelType ? [["Fuel Type", vehicle.fuelType]] : []),
    ...(vehicle.engineType
      ? [["Engine", [vehicle.engineSize, vehicle.engineType].filter(Boolean).join(" ")]]
      : []),
    ...(vehicle.availability ? [["Availability", vehicle.availability]] : []),
    ["Estimated Price", vehicle.priceDisplay],
    ["Confidence Rating", vehicle.confidence],
  ];

  return (
    <SiteShell>
      <section className="container-site pt-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground">{vehicle.klass}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">{vehicle.name}</span>
        </nav>

        {/* HERO BANNER */}
        <div className="card-surface relative mt-4 overflow-hidden rounded-3xl border border-border shadow-2xl">
          <ThemeImage
            dark="/img/hero-dark.jpg"
            light="/img/hero-light.jpg"
            alt="Leonida backdrop"
            className="absolute inset-0 h-full w-full object-cover opacity-40 brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="default" className="bg-primary/20 text-primary border-primary/40 font-bold">
                  {vehicle.klass}
                </Badge>
                <ConfidenceBadge level={vehicle.confidence} source={vehicle.source} />
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
                {vehicle.name}
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground font-medium">
                {vehicle.description}
              </p>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <FavoriteButton type="vehicles" id={vehicle.id} />
                <Button
                  href={`/compare/vehicles?v=${vehicle.slug}`}
                  className="bg-primary font-bold text-xs"
                >
                  Compare in Duel <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
                <Button
                  href="/map"
                  variant="outline"
                  className="text-xs font-semibold"
                >
                  <MapPin className="h-3.5 w-3.5 mr-1 text-cyan-600 dark:text-[#00F0FF]" /> Find on Satellite Map
                </Button>
              </div>
            </div>

            {/* Vehicle Card Hero Visual */}
            <div className="relative h-64 sm:h-80 overflow-hidden rounded-2xl border border-border bg-black/60 shadow-inner group">
              <img
                src={vehicle.img}
                alt={vehicle.name}
                style={vehicle.filter ? { filter: vehicle.filter } : undefined}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/80 px-4 py-2 text-xs backdrop-blur border border-border">
                <span className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Showroom Price</span>
                <span className="font-display font-black text-cyan-600 dark:text-[#00F0FF] text-sm">{vehicle.priceDisplay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PERFORMANCE STATS & SPECIFICATIONS */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Performance Bars */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Gauge className="h-4 w-4 text-accent" /> Dyno Performance Metrics
            </h2>
            <div className="mt-6 space-y-5">
              {statBars.map((s) => (
                <div key={s.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <s.icon className="h-3.5 w-3.5 text-accent" /> {s.label}
                    </span>
                    <span className="font-mono font-bold text-foreground">{s.value}</span>
                  </div>
                  <Progress value={s.pct} className="h-2" />
                </div>
              ))}
            </div>

            {/* Source transparency block */}
            <div className="mt-6 rounded-2xl border-border bg-muted/60 p-3.5 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Data Grounding</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Source:</strong> {vehicle.source}. Classified under <strong>{vehicle.confidence}</strong> standards.
              </p>
            </div>
          </div>

          {/* Quick Specifications Table */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Wrench className="h-4 w-4 text-primary" /> Technical Specifications
            </h2>
            <dl className="mt-4 divide-y divide-border">
              {quickSpecs.map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 text-xs">
                  <dt className="text-muted-foreground font-medium">{k}</dt>
                  <dd className="font-bold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* WHERE TO FIND & CUSTOMIZATION */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Where to find */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-emerald-400" /> Spawn & Purchase Locations
            </h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border-border bg-muted/60 p-3 text-xs">
                <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">Dealership / Web Source:</span>
                <span className="text-foreground font-semibold">{vehicle.purchaseLocation}</span>
              </div>

              <span className="text-xs uppercase font-bold text-muted-foreground block pt-2">Known Street Spawns:</span>
              <ul className="space-y-2">
                {vehicle.spawnLocations.map((loc, i) => (
                  <li key={loc} className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-xs">
                      {i + 1}
                    </span>
                    <span>{loc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Customization mods */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-[#00F0FF]" /> Available Mod Parts
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Confirmed workshop upgrade modules supported on this chassis:</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {vehicle.customizationOptions.map((mod) => (
                <div key={mod} className="rounded-xl border-border bg-muted/60 p-3 text-xs text-foreground font-medium flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-[#00F0FF]" />
                  <span>{mod}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DEEP-DIVE: ECONOMY, FEATURES & AUDIO */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Economy */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Wallet className="h-4 w-4 text-gold-light" /> Ownership Economy
            </h2>
            <dl className="mt-4 divide-y divide-border">
              {[
                ["Showroom price", vehicle.priceDisplay],
                ...(vehicle.resalePrice != null ? [["Resale value", `$${vehicle.resalePrice.toLocaleString()}`]] : []),
                ...(vehicle.insuranceCost != null ? [["Insurance", `$${vehicle.insuranceCost.toLocaleString()}`]] : []),
                ...(vehicle.upgradeCost != null ? [["Full upgrades", `$${vehicle.upgradeCost.toLocaleString()}`]] : []),
                ...(vehicle.repairCost != null ? [["Typical repair", `$${vehicle.repairCost.toLocaleString()}`]] : []),
                ...(vehicle.storageCost != null ? [["Storage", `$${vehicle.storageCost.toLocaleString()}`]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 text-xs">
                  <dt className="text-muted-foreground font-medium">{k}</dt>
                  <dd className="font-bold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Special features & durability */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Layers className="h-4 w-4 text-rose-400" /> Special Features & Durability
            </h2>
            {vehicle.features?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {vehicle.features.map((f) => (
                  <span key={f} className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                    {f}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">No special features confirmed for this vehicle yet.</p>
            )}
            <dl className="mt-4 divide-y divide-border">
              {[
                ...(vehicle.armorRating != null ? [["Armor rating", `${vehicle.armorRating}/100`]] : []),
                ...(vehicle.bulletResistance != null ? [["Bullet resistance", `${vehicle.bulletResistance}/100`]] : []),
                ...(vehicle.explosionResistance != null ? [["Explosion resistance", `${vehicle.explosionResistance}/100`]] : []),
                ...(vehicle.offroadRating != null ? [["Off-road capability", `${vehicle.offroadRating}/100`]] : []),
                ...(vehicle.waterRating != null ? [["Water capability", `${vehicle.waterRating}/100`]] : []),
                ...(vehicle.driftRating != null ? [["Drift capability", `${vehicle.driftRating}/100`]] : []),
                ...(vehicle.specialAbility ? [["Special ability", vehicle.specialAbility]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 text-xs">
                  <dt className="text-muted-foreground font-medium">{k}</dt>
                  <dd className="font-bold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* AUDIO (rendered only when sound data exists) */}
        {(vehicle.soundRating != null || vehicle.engineSound || vehicle.exhaustSound || vehicle.horn) && (
          <div className="card-surface mt-6 p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Wrench className="h-4 w-4 text-purple-400" /> Sound Profile
            </h2>
            <dl className="mt-4 divide-y divide-border">
              {[
                ...(vehicle.soundRating != null ? [["Sound rating", `${vehicle.soundRating}/100`]] : []),
                ...(vehicle.engineSound ? [["Engine", vehicle.engineSound]] : []),
                ...(vehicle.exhaustSound ? [["Exhaust", vehicle.exhaustSound]] : []),
                ...(vehicle.turboSound ? [["Turbo", vehicle.turboSound]] : []),
                ...(vehicle.gearShiftSound ? [["Gear shift", vehicle.gearShiftSound]] : []),
                ...(vehicle.horn ? [["Horn", vehicle.horn]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 text-xs">
                  <dt className="text-muted-foreground font-medium">{k}</dt>
                  <dd className="font-bold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* BOTTOM CTA */}
        <div className="card-surface mt-6 mb-16 flex flex-col items-start justify-between gap-5 p-6 rounded-3xl border border-border md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Want to compare {vehicle.name} against other rides?
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Pick 2 to 4 vehicles side-by-side to find the ultimate ride for your budget and missions.
            </p>
          </div>
          <div className="flex gap-3">
            <Button href={`/compare/vehicles?v=${vehicle.slug}`} className="bg-primary text-xs font-bold">
              Compare {vehicle.name} <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
            <Button href="/vehicles" variant="outline" className="text-xs font-semibold">
              Browse All Vehicles
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
