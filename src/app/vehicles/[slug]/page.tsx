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
  const vehicle = canonicalVehicles.find((v) => v.slug === slug || v.id === slug);
  if (!vehicle) return { title: "Vehicle Not Found — GTA 6 Atlas" };

  return {
    title: `${vehicle.name} (${vehicle.klass}) — GTA 6 Stats, Speed & Location`,
    description: `Full verified breakdown of the ${vehicle.name} in GTA 6: Top speed ${vehicle.topSpeed} mph, ${vehicle.acceleration}s 0-60, ${vehicle.priceDisplay} price, customization, and spawn locations.`,
    openGraph: {
      title: `${vehicle.name} — GTA 6 Vehicle Guide`,
      description: vehicle.description,
      images: [vehicle.img],
    },
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle =
    canonicalVehicles.find((v) => v.slug === slug || v.id === slug) ??
    canonicalVehicles[0];

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
  ];

  const quickSpecs = [
    ["Class", vehicle.klass],
    ["Manufacturer", vehicle.manufacturer],
    ["Horsepower", `${vehicle.power} HP`],
    ["Drivetrain", vehicle.drivetrain],
    ["Weight", vehicle.weight],
    ["Seating", `${vehicle.seating} Passengers`],
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
        <div className="card-surface relative mt-4 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
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

              <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                {vehicle.name}
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300 font-medium">
                {vehicle.description}
              </p>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <FavoriteButton type="vehicles" id={vehicle.id} />
                <Button
                  href={`/compare/vehicles?v=${vehicle.slug}`}
                  className="bg-gradient-to-r from-primary to-accent font-bold text-xs"
                >
                  Compare in Duel <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
                <Button
                  href="/map"
                  variant="outline"
                  className="text-xs font-semibold"
                >
                  <MapPin className="h-3.5 w-3.5 mr-1 text-[#00F0FF]" /> Find on Satellite Map
                </Button>
              </div>
            </div>

            {/* Vehicle Card Hero Visual */}
            <div className="relative h-64 sm:h-80 overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-inner group">
              <img
                src={vehicle.img}
                alt={vehicle.name}
                style={vehicle.filter ? { filter: vehicle.filter } : undefined}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/80 px-4 py-2 text-xs backdrop-blur border border-white/10">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Showroom Price</span>
                <span className="font-display font-black text-[#00F0FF] text-sm">{vehicle.priceDisplay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PERFORMANCE STATS & SPECIFICATIONS */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Performance Bars */}
          <div className="card-surface p-6 rounded-3xl border border-white/10">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <Gauge className="h-4 w-4 text-accent" /> Dyno Performance Metrics
            </h2>
            <div className="mt-6 space-y-5">
              {statBars.map((s) => (
                <div key={s.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <s.icon className="h-3.5 w-3.5 text-accent" /> {s.label}
                    </span>
                    <span className="font-mono font-bold text-white">{s.value}</span>
                  </div>
                  <Progress value={s.pct} className="h-2" />
                </div>
              ))}
            </div>

            {/* Source transparency block */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-3.5 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Data Grounding</span>
              </div>
              <p className="text-[11px] text-slate-400">
                <strong>Source:</strong> {vehicle.source}. Classified under <strong>{vehicle.confidence}</strong> standards.
              </p>
            </div>
          </div>

          {/* Quick Specifications Table */}
          <div className="card-surface p-6 rounded-3xl border border-white/10">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <Wrench className="h-4 w-4 text-primary" /> Technical Specifications
            </h2>
            <dl className="mt-4 divide-y divide-white/10">
              {quickSpecs.map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 text-xs">
                  <dt className="text-slate-400 font-medium">{k}</dt>
                  <dd className="font-bold text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* WHERE TO FIND & CUSTOMIZATION */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Where to find */}
          <div className="card-surface p-6 rounded-3xl border border-white/10">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <MapPin className="h-4 w-4 text-emerald-400" /> Spawn & Purchase Locations
            </h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Dealership / Web Source:</span>
                <span className="text-slate-200 font-semibold">{vehicle.purchaseLocation}</span>
              </div>

              <span className="text-[10px] uppercase font-bold text-slate-400 block pt-2">Known Street Spawns:</span>
              <ul className="space-y-2">
                {vehicle.spawnLocations.map((loc, i) => (
                  <li key={loc} className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span>{loc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Customization mods */}
          <div className="card-surface p-6 rounded-3xl border border-white/10">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4 text-[#00F0FF]" /> Available Mod Parts
            </h2>
            <p className="text-xs text-slate-400 mt-1">Confirmed workshop upgrade modules supported on this chassis:</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {vehicle.customizationOptions.map((mod) => (
                <div key={mod} className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-slate-200 font-medium flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF]" />
                  <span>{mod}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="card-surface mt-6 mb-16 flex flex-col items-start justify-between gap-5 p-6 rounded-3xl border border-white/10 md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Want to compare {vehicle.name} against other rides?
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Pick 2 to 4 vehicles side-by-side to find the ultimate ride for your budget and missions.
            </p>
          </div>
          <div className="flex gap-3">
            <Button href={`/compare/vehicles?v=${vehicle.slug}`} className="bg-gradient-to-r from-primary to-accent text-xs font-bold">
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
