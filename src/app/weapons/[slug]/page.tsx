import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Crosshair,
  ShieldCheck,
  ArrowRight,
  Zap,
  Flame,
  Target,
  Clock,
  Layers,
  Sparkles,
  MapPin,
  Wrench,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { canonicalWeapons, CanonicalWeapon } from "@/lib/canonical-data";
import { FavoriteButton } from "@/components/favorite-button";
import { ConfidenceBadge } from "@/components/confidence-badge";

export function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  canonicalWeapons.forEach((w) => {
    slugs.push({ slug: w.slug });
    if (w.id !== w.slug) {
      slugs.push({ slug: w.id });
    }
  });
  return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const weapon = canonicalWeapons.find((w) => w.slug === slug || w.id === slug);
  if (!weapon) return { title: "Weapon Not Found — GTA 6 Atlas" };

  return {
    title: `${weapon.name} (${weapon.klass}) — GTA 6 Stats, Attachments & Locations`,
    description: `Complete verified breakdown of the ${weapon.name} in GTA 6: Damage ${weapon.damage}, Fire rate ${weapon.fireRate}, Accuracy ${weapon.accuracy}, Price ${weapon.priceDisplay}, attachments, and drop locations.`,
    openGraph: {
      title: `${weapon.name} — GTA 6 Weapon Guide`,
      description: weapon.description,
      images: [weapon.img],
    },
  };
}

export default async function WeaponDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const weapon =
    canonicalWeapons.find((w) => w.slug === slug || w.id === slug) ??
    canonicalWeapons[0];

  if (!weapon) {
    notFound();
  }

  const statBars = [
    { label: "Damage Impact", value: `${weapon.damage}/100`, pct: weapon.damage },
    { label: "Cycle Fire Rate", value: `${weapon.fireRate}/100`, pct: weapon.fireRate },
    { label: "Accuracy Cone", value: `${weapon.accuracy}/100`, pct: weapon.accuracy },
    { label: "Effective Range", value: `${weapon.range}/100`, pct: weapon.range },
    { label: "Handling & Draw", value: `${weapon.handling}/100`, pct: weapon.handling },
  ];

  const quickSpecs = [
    ["Weapon Class", weapon.klass],
    ["Caliber / Ammo", weapon.ammoType],
    ["Standard Magazine", `${weapon.magazineSize} Rounds`],
    ["Tactical Reload", weapon.reloadTime],
    ["Retail Ammu-Nation Price", weapon.priceDisplay],
    ["Rarity Tier", weapon.rarity],
    ["Confidence Rating", weapon.confidence],
  ];

  const similar = canonicalWeapons.filter((w) => w.id !== weapon.id && w.klass === weapon.klass).slice(0, 3);

  return (
    <SiteShell>
      <section className="container-site pt-6 pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/weapons" className="hover:text-primary transition-colors">Weapons</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground">{weapon.klass}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">{weapon.name}</span>
        </nav>

        {/* HERO BANNER */}
        <div className="card-surface relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10" />

          <div className="relative grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="bg-primary/20 text-primary border-primary/40 font-bold">
                  {weapon.klass}
                </Badge>
                <ConfidenceBadge level={weapon.confidence} source={weapon.source} />
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                {weapon.name}
              </h1>

              <p className="text-sm leading-relaxed text-slate-300">
                {weapon.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <FavoriteButton type="weapons" id={weapon.id} />
                <Button href={`/compare/weapons?w=${weapon.slug}`} className="bg-gradient-to-r from-primary to-accent text-xs font-bold">
                  Compare in Duel <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
                <Button href="/weapons" variant="outline" className="text-xs font-semibold">
                  Browse All Weapons
                </Button>
              </div>
            </div>

            {/* Weapon Visual Showcase */}
            <div className="relative h-64 sm:h-72 rounded-2xl border border-primary/30 bg-gradient-to-br from-[#0c0517] via-black/80 to-[#150a1d] p-6 flex items-center justify-center shadow-inner group">
              <img
                src={weapon.img}
                alt={weapon.name}
                className="max-h-52 w-full object-contain mix-blend-lighten brightness-125 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/80 px-4 py-2 text-xs backdrop-blur border border-white/10">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Purchase Price</span>
                <span className="font-mono font-black text-[#00F0FF] text-sm">{weapon.priceDisplay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BALLISTIC STATS & SPECS */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Stat Bars */}
          <div className="card-surface p-6 rounded-3xl border border-white/10">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <Crosshair className="h-4 w-4 text-accent" /> Ballistic Combat Ratings
            </h2>
            <div className="mt-6 space-y-4">
              {statBars.map((s) => (
                <div key={s.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{s.label}</span>
                    <span className="font-mono font-bold text-white">{s.value}</span>
                  </div>
                  <Progress value={s.pct} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-3.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400 mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Source Citation</span>
              </div>
              <p className="text-[11px] text-slate-400">
                <strong>Source:</strong> {weapon.source}. Confidence level: <strong>{weapon.confidence}</strong>.
              </p>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="card-surface p-6 rounded-3xl border border-white/10">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <Wrench className="h-4 w-4 text-primary" /> Caliber & Mechanics Specs
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

        {/* ATTACHMENTS & LOCATIONS */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Attachments */}
          <div className="card-surface p-6 rounded-3xl border border-white/10">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4 text-[#00F0FF]" /> Supported Attachments & Upgrades
            </h2>
            <p className="text-xs text-slate-400 mt-1">Modular upgrades compatible with this firearm:</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {weapon.attachments.map((att) => (
                <div key={att} className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-slate-200 font-medium flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF]" />
                  <span>{att}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Where to find */}
          <div className="card-surface p-6 rounded-3xl border border-white/10">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <MapPin className="h-4 w-4 text-emerald-400" /> Acquisition & Drop Locations
            </h2>
            <ul className="mt-4 space-y-2.5">
              {weapon.locations.map((loc, i) => (
                <li key={loc} className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/40 p-3 text-xs text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-[10px]">
                    {i + 1}
                  </span>
                  <span>{loc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
