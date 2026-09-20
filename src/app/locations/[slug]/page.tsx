import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Clock,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Car,
  Crosshair,
  Flag,
  Navigation,
  Sparkles,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { canonicalLocations } from "@/lib/canonical-data";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { FavoriteButton } from "@/components/favorite-button";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return canonicalLocations.map((l) => ({
    slug: l.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const loc = canonicalLocations.find((l) => l.slug === slug);

  if (!loc) {
    return {
      title: "Location Not Found — GTA 6 Atlas",
    };
  }

  return {
    title: `${loc.name} (${loc.district}) — Point of Interest Dossier | GTA 6 Atlas`,
    description: `Official intel briefing and satellite map coordinates for ${loc.name} in ${loc.district}, State of Leonida. Threat level: ${loc.threatLevel}.`,
  };
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const loc = canonicalLocations.find((l) => l.slug === slug);

  if (!loc) {
    notFound();
  }

  const nearbyLocations = canonicalLocations
    .filter((l) => l.id !== loc.id && l.district === loc.district)
    .slice(0, 3);

  const threatColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "High":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "Restricted Area":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      default:
        return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/locations" className="hover:text-primary transition-colors">
            Locations
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white truncate max-w-xs">{loc.name}</span>
        </nav>

        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent transition-colors font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Locations
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dossier Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Hero */}
            <div className="card-carbon p-6 md:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                    {loc.category}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${threatColor(
                      loc.threatLevel
                    )}`}
                  >
                    Threat: {loc.threatLevel}
                  </span>
                  <ConfidenceBadge confidence={loc.confidence} source={loc.source} />
                </div>
                <FavoriteButton type="locations" id={loc.id} />
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {loc.name}
              </h1>

              <div className="flex items-center gap-2 text-sm text-accent font-semibold">
                <MapPin className="h-4 w-4" />
                <span>{loc.district}, State of Leonida</span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                {loc.desc}
              </p>
            </div>

            {/* Photo / Visual */}
            <div className="card-carbon overflow-hidden">
              <div className="relative h-72 sm:h-96 w-full bg-slate-950">
                <img src={loc.img} alt={loc.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800">
                  <span className="font-mono text-slate-300">
                    Map Grid: Top {loc.top} / Left {loc.left}
                  </span>
                  <Link
                    href={`/map?poi=${loc.id}`}
                    className="btn-primary text-xs px-3 py-1.5 font-bold flex items-center gap-1.5"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Fly to Live Pin
                  </Link>
                </div>
              </div>
            </div>

            {/* Operating Intel & Associated Assets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-carbon p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Clock className="h-4 w-4 text-accent" /> Hours of Operation
                </div>
                <p className="text-sm font-semibold text-white font-mono">{loc.hours}</p>
              </div>

              <div className="card-carbon p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ShieldAlert className="h-4 w-4 text-primary" /> Security & Heat Rating
                </div>
                <p className="text-sm font-semibold text-white font-mono">
                  {loc.threatLevel} (Response time &lt; 90s)
                </p>
              </div>
            </div>

            {/* Related Vehicles & Armory */}
            {((loc.relatedVehicles?.length || 0) > 0 || (loc.relatedWeapons?.length || 0) > 0) && (
              <div className="card-carbon p-6 space-y-4">
                <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                  Associated Field Assets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(loc.relatedVehicles?.length || 0) > 0 && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                        <Car className="h-4 w-4" /> Spawning Vehicles
                      </div>
                      <ul className="text-xs text-slate-200 font-mono space-y-1">
                        {loc.relatedVehicles?.map((v) => (
                          <li key={v} className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {v}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(loc.relatedWeapons?.length || 0) > 0 && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                        <Crosshair className="h-4 w-4" /> Available Armory
                      </div>
                      <ul className="text-xs text-slate-200 font-mono space-y-1">
                        {loc.relatedWeapons?.map((w) => (
                          <li key={w} className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Quick Action Map Launcher */}
            <div className="card-carbon p-6 space-y-4 border-accent/30 bg-accent/5">
              <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                Tactical Navigation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Open the interactive satellite map focused on {loc.name}. Synchronize coordinates and add custom field notes.
              </p>
              <Link
                href={`/map?poi=${loc.id}`}
                className="btn-accent w-full py-2.5 text-xs flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
              >
                <Navigation className="h-4 w-4" /> Open Interactive Map
              </Link>
            </div>

            {/* Nearby District POIs */}
            <div className="card-carbon p-6 space-y-4">
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Nearby in {loc.district}
              </h4>
              {nearbyLocations.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No other confirmed locations in this specific sector yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {nearbyLocations.map((item) => (
                    <Link
                      key={item.id}
                      href={`/locations/${item.slug}`}
                      className="block p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group"
                    >
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                        {item.category}
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-accent mt-1 flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" /> {item.district}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
