import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Car,
  DollarSign,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Navigation,
  Clock,
  Layers,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { canonicalProperties } from "@/lib/canonical-data";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { FavoriteButton } from "@/components/favorite-button";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return canonicalProperties.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const prop = canonicalProperties.find((p) => p.slug === slug);

  if (!prop) {
    return {
      title: "Property Not Found — GTA 6 Atlas",
    };
  }

  return {
    title: `${prop.name} (${prop.type}) — Property Dossier | GTA 6 Atlas`,
    description: `Official real estate breakdown for ${prop.name} in ${prop.district}. Price: ${prop.priceDisplay}, Garage: ${prop.garageCapacity} vehicles, Passive Income: ${prop.passiveIncomeDisplay}.`,
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const prop = canonicalProperties.find((p) => p.slug === slug);

  if (!prop) {
    notFound();
  }

  const related = canonicalProperties
    .filter((p) => p.id !== prop.id)
    .slice(0, 3);

  const hourly = prop.passiveIncomePerHour || 0;
  const dailyIncome = hourly * 24;
  const weeklyIncome = dailyIncome * 7;
  const breakEvenDays = prop.price && hourly > 0 ? Math.ceil(prop.price / dailyIncome) : null;

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/properties" className="hover:text-primary transition-colors">
            Properties
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white truncate max-w-xs">{prop.name}</span>
        </nav>

        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent transition-colors font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Properties
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card-carbon p-6 md:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                    {prop.type}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-accent" /> {prop.district}
                  </span>
                  <ConfidenceBadge confidence={prop.confidence} source={prop.source} />
                </div>
                <FavoriteButton type="properties" id={prop.id} />
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {prop.name}
              </h1>

              <div className="font-display text-2xl sm:text-3xl font-black text-amber-400">
                {prop.priceDisplay}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                {prop.desc}
              </p>
            </div>

            {/* Photo / Visual */}
            <div className="card-carbon overflow-hidden">
              <div className="relative h-72 sm:h-96 w-full bg-slate-950">
                <img src={prop.img} alt={prop.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800">
                  <span className="font-mono text-slate-300">
                    Map Location: Top {prop.mapCoords.top} / Left {prop.mapCoords.left}
                  </span>
                  <Link
                    href={`/map?poi=poi-ocean-drive`}
                    className="btn-primary text-xs px-3 py-1.5 font-bold flex items-center gap-1.5"
                  >
                    <Navigation className="h-3.5 w-3.5" /> View Satellite Map
                  </Link>
                </div>
              </div>
            </div>

            {/* Financial ROI Calculator Box */}
            {hourly > 0 ? (
              <div className="card-carbon p-6 space-y-4 border-emerald-500/30 bg-emerald-950/10">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                  <TrendingUp className="h-4 w-4" /> Passive Revenue & ROI Breakdown
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Per Hour
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      ${hourly.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Daily (24h)
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      ${dailyIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Weekly (7d)
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      ${weeklyIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Break-Even
                    </span>
                    <span className="text-base font-black text-amber-400">
                      {breakEvenDays ? `${breakEvenDays} Days` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-carbon p-6 space-y-2 border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Residential / Private Safehouse
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  This property is an exclusive private residence or story safehouse with zero operational overhead and maximum vehicle staging security.
                </p>
              </div>
            )}

            {/* Features & Available Upgrades */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="card-carbon p-6 space-y-3">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" /> Included Features
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {prop.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-carbon p-6 space-y-3">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" /> Available Upgrades
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {prop.upgrades.map((u) => (
                    <li key={u} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Quick Specs Box */}
            <div className="card-carbon p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                Property Summary
              </h3>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Price:</span>
                  <span className="font-bold text-amber-400">{prop.priceDisplay}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Garage:</span>
                  <span className="font-bold text-white">{prop.garageCapacity} Vehicles</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">District:</span>
                  <span className="text-accent font-semibold">{prop.district}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Classification:</span>
                  <span className="text-white font-semibold">{prop.confidence}</span>
                </div>
              </div>

              <Link
                href="/tools/business-profit-calculator"
                className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
              >
                <TrendingUp className="h-4 w-4" /> Open Profit Calculator
              </Link>
            </div>

            {/* Other Properties */}
            <div className="card-carbon p-6 space-y-4">
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Other Real Estate
              </h4>
              <div className="space-y-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/properties/${item.slug}`}
                    className="block p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group"
                  >
                    <div className="text-[10px] uppercase font-bold text-primary mb-0.5">
                      {item.type}
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-amber-400 font-mono mt-1">
                      {item.priceDisplay}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
