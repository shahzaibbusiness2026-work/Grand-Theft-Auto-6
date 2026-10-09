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
  Wallet,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { canonicalWeapons, CanonicalWeapon } from "@/lib/canonical-data";
import { FavoriteButton } from "@/components/favorite-button";
import { ConfidenceBadge } from "@/components/confidence-badge";

import { getPublicWeapons } from "@/lib/services/queries";

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

/** Build a CanonicalWeapon from a DB row when no canonical match exists (DB stats win). */
function dbWeaponToCanonical(dbMatch: NonNullable<Awaited<ReturnType<typeof getPublicWeapons>>>[number]): CanonicalWeapon {
  const priceMatch = /\$\d[\d,]*/.exec(dbMatch.notes || "");
  const rarityMatch = /Rarity:\s*(\w+)/.exec(dbMatch.notes || "");
  return {
    id: dbMatch.id,
    slug: dbMatch.slug || dbMatch.id,
    name: dbMatch.name,
    klass: (dbMatch.category as CanonicalWeapon["klass"]) || "Pistol",
    damage: parseInt(dbMatch.damage || "", 10) || 50,
    fireRate: parseInt(dbMatch.rateOfFire || "", 10) || 50,
    accuracy: parseInt(dbMatch.range || "", 10) || 50,
    range: parseInt(dbMatch.range || "", 10) || 50,
    handling: 50,
    reloadTime: "2.5s",
    magazineSize: parseInt(dbMatch.magazineSize || "15", 10) || 15,
    ammoType: dbMatch.ammunition || "9mm Standard",
    price: dbMatch.price ?? null,
    priceDisplay: dbMatch.priceDisplay || priceMatch?.[0] || "TBD",
    rarity: (rarityMatch?.[1] as CanonicalWeapon["rarity"]) || "Common",
    locations: [dbMatch.acquisitionMethod || "Ammu-Nation"],
    attachments: dbMatch.attachments || [],
    confidence: dbMatch.verification === "verified" ? "CONFIRMED" : "SPECULATION",
    source: dbMatch.notes || "In-game Database",
    description: dbMatch.notes || `${dbMatch.name} in Grand Theft Auto VI.`,
    img: dbMatch.image || "/img/hero-dark.jpg",
    // Deep-dive fields
    reload: dbMatch.reload ?? undefined,
    ammoCapacity: dbMatch.ammoCapacity ?? undefined,
    recoil: dbMatch.recoil ?? undefined,
    mobility: dbMatch.mobility ?? undefined,
    projectileSpeed: dbMatch.projectileSpeed ?? undefined,
    headshotMultiplier: dbMatch.headshotMultiplier ?? undefined,
    damageFalloff: dbMatch.damageFalloff ?? undefined,
    fireMode: dbMatch.fireMode || undefined,
    features: dbMatch.features || [],
    ammoCost: dbMatch.ammoCost ?? null,
    upgradeCost: dbMatch.upgradeCost ?? null,
    manufacturer: dbMatch.manufacturer || undefined,
    availability: dbMatch.availability || undefined,
    featured: dbMatch.featured ?? false,
    gallery: dbMatch.gallery || [],
    tags: dbMatch.tags || [],
    customization: dbMatch.customization || [],
  };
}

/**
 * Merge CMS deep-dive fields (and price/image) from the live DB row onto a
 * canonical-matched weapon so admin edits are visible on the detail page.
 */
function mergeDbDeepDive(weapon: CanonicalWeapon, dbMatch: NonNullable<Awaited<ReturnType<typeof getPublicWeapons>>>[number]): CanonicalWeapon {
  return {
    ...weapon,
    price: dbMatch.price ?? weapon.price,
    priceDisplay: dbMatch.priceDisplay || weapon.priceDisplay,
    img: dbMatch.image || weapon.img,
    reload: dbMatch.reload ?? weapon.reload,
    ammoCapacity: dbMatch.ammoCapacity ?? weapon.ammoCapacity,
    recoil: dbMatch.recoil ?? weapon.recoil,
    mobility: dbMatch.mobility ?? weapon.mobility,
    projectileSpeed: dbMatch.projectileSpeed ?? weapon.projectileSpeed,
    headshotMultiplier: dbMatch.headshotMultiplier ?? weapon.headshotMultiplier,
    damageFalloff: dbMatch.damageFalloff ?? weapon.damageFalloff,
    fireMode: dbMatch.fireMode || weapon.fireMode,
    features: dbMatch.features?.length ? dbMatch.features : weapon.features,
    ammoCost: dbMatch.ammoCost ?? weapon.ammoCost,
    upgradeCost: dbMatch.upgradeCost ?? weapon.upgradeCost,
    manufacturer: dbMatch.manufacturer || weapon.manufacturer,
    availability: dbMatch.availability || weapon.availability,
    featured: dbMatch.featured ?? weapon.featured,
    gallery: dbMatch.gallery?.length ? dbMatch.gallery : weapon.gallery,
    tags: dbMatch.tags?.length ? dbMatch.tags : weapon.tags,
    customization: dbMatch.customization?.length ? dbMatch.customization : weapon.customization,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let weapon = canonicalWeapons.find((w) => w.slug === slug || w.id === slug);
  if (!weapon) {
    const dbWeapons = await getPublicWeapons();
    const dbMatch = dbWeapons.find((w) => w.id === slug || w.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
    if (dbMatch) {
      weapon = dbWeaponToCanonical(dbMatch);
    }
  }
  if (!weapon) notFound();

  return {
    title: `${weapon.name} (${weapon.klass}) — GTA 6 Stats, Attachments & Locations`,
    description: `Complete verified breakdown of the ${weapon.name} in GTA 6: Damage ${weapon.damage}, Fire rate ${weapon.fireRate}, Accuracy ${weapon.accuracy}, Price ${weapon.priceDisplay}, attachments, and drop locations.`,
    alternates: { canonical: `/weapons/${weapon.slug}` },
    openGraph: {
      title: `${weapon.name} — GTA 6 Weapon Guide`,
      description: weapon.description,
      images: [weapon.img],
    },
  };
}

export default async function WeaponDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let weapon = canonicalWeapons.find((w) => w.slug === slug || w.id === slug);
  const dbWeapons = await getPublicWeapons().catch(() => []);
  const dbRow = dbWeapons.find(
    (w) => w.id === slug || w.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );
  if (!weapon && dbRow) {
    weapon = dbWeaponToCanonical(dbRow);
  }
  // CMS edits (deep-dive fields, price, image) override the canonical base.
  if (weapon && dbRow) {
    weapon = mergeDbDeepDive(weapon, dbRow);
  }

  if (!weapon) {
    notFound();
  }

  const dpsIndex = Math.round((weapon.damage * weapon.fireRate) / 100);
  const statBars = [
    { label: "Damage Impact", value: `${weapon.damage}/100`, pct: weapon.damage },
    { label: "DPS Index (Damage Ã— Fire Rate)", value: `${dpsIndex}`, pct: dpsIndex },
    { label: "Cycle Fire Rate", value: `${weapon.fireRate}/100`, pct: weapon.fireRate },
    { label: "Accuracy Cone", value: `${weapon.accuracy}/100`, pct: weapon.accuracy },
    { label: "Effective Range", value: `${weapon.range}/100`, pct: weapon.range },
    ...(weapon.reload != null
      ? [{ label: "Reload Speed", value: `${weapon.reload}/100`, pct: weapon.reload }]
      : []),
    { label: "Handling & Draw", value: `${weapon.handling}/100`, pct: weapon.handling },
    ...(weapon.mobility != null
      ? [{ label: "Mobility", value: `${weapon.mobility}/100`, pct: weapon.mobility }]
      : []),
    ...(weapon.recoil != null
      ? [{ label: "Recoil Control", value: `${weapon.recoil}/100`, pct: weapon.recoil }]
      : []),
  ];

  const quickSpecs = [
    ["Weapon Class", weapon.klass],
    ...(weapon.manufacturer ? [["Manufacturer", weapon.manufacturer]] : []),
    ...(weapon.fireMode ? [["Fire Mode", weapon.fireMode]] : []),
    ["Caliber / Ammo", weapon.ammoType],
    ["Standard Magazine", `${weapon.magazineSize} Rounds`],
    ...(weapon.ammoCapacity != null ? [["Reserve Ammo", `${weapon.ammoCapacity} Rounds`]] : []),
    ["Tactical Reload", weapon.reloadTime],
    ...(weapon.headshotMultiplier != null ? [["Headshot Multiplier", `Ã—${weapon.headshotMultiplier}`]] : []),
    ...(weapon.availability ? [["Availability", weapon.availability]] : []),
    ["Retail Ammu-Nation Price", weapon.priceDisplay],
    ["Rarity Tier", weapon.rarity],
    ["Confidence Rating", weapon.confidence],
  ];

  const similar = canonicalWeapons.filter((w) => w.id !== weapon.id && w.klass === weapon.klass).slice(0, 3);

  return (
    <SiteShell>
      <section className="container-site pt-6 pb-10">
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
        <div className="card-surface relative overflow-hidden rounded-3xl border border-border shadow-2xl p-6 sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10" />

          <div className="relative grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="bg-primary/20 text-primary border-primary/40 font-bold">
                  {weapon.klass}
                </Badge>
                <ConfidenceBadge level={weapon.confidence} source={weapon.source} />
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
                {weapon.name}
              </h1>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {weapon.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <FavoriteButton type="weapons" id={weapon.id} />
                <Button href={`/compare/weapons?w=${weapon.slug}`} className="bg-primary text-xs font-bold">
                  Compare in Duel <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
                <Button href="/weapons" variant="outline" className="text-xs font-semibold">
                  Browse All Weapons
                </Button>
              </div>
            </div>

            {/* Weapon Visual Showcase */}
            <div className="relative h-64 sm:h-72 rounded-2xl border border-primary/30 bg-gradient-to-br from-card dark:from-[#0c0517] via-black/80 to-[#150a1d] p-6 flex items-center justify-center shadow-inner group">
              <img loading="lazy"
                src={weapon.img}
                alt={weapon.name}
                className="max-h-52 w-full object-contain mix-blend-lighten brightness-125 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/80 px-4 py-2 text-xs backdrop-blur border border-border">
                <span className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Purchase Price</span>
                <span className="font-mono font-black text-cyan-600 dark:text-[#00F0FF] text-sm">{weapon.priceDisplay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BALLISTIC STATS & SPECS */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Stat Bars */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Crosshair className="h-4 w-4 text-accent" /> Ballistic Combat Ratings
            </h2>
            <div className="mt-6 space-y-4">
              {statBars.map((s) => (
                <div key={s.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-mono font-bold text-foreground">{s.value}</span>
                  </div>
                  <Progress value={s.pct} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border-border bg-muted/60 p-3.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Source Citation</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Source:</strong> {weapon.source}. Confidence level: <strong>{weapon.confidence}</strong>.
              </p>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Wrench className="h-4 w-4 text-primary" /> Caliber & Mechanics Specs
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

        {/* ATTACHMENTS & LOCATIONS */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Attachments */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-[#00F0FF]" /> Supported Attachments & Upgrades
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Modular upgrades compatible with this firearm:</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {weapon.attachments.map((att) => (
                <div key={att} className="rounded-xl border-border bg-muted/60 p-3 text-xs text-foreground font-medium flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-[#00F0FF]" />
                  <span>{att}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Where to find */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-emerald-400" /> Acquisition & Drop Locations
            </h2>
            <ul className="mt-4 space-y-2.5">
              {weapon.locations.map((loc, i) => (
                <li key={loc} className="flex items-center gap-3 rounded-xl border-border bg-muted/60 p-3 text-xs text-muted-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-xs">
                    {i + 1}
                  </span>
                  <span>{loc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* DEEP-DIVE: FEATURES, ECONOMY & CUSTOMIZATION */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Layers className="h-4 w-4 text-rose-400" /> Special Traits
            </h2>
            {weapon.features?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {weapon.features.map((f) => (
                  <span key={f} className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                    {f}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">No special traits confirmed for this weapon yet.</p>
            )}
            <dl className="mt-4 divide-y divide-border">
              {[
                ...(weapon.damageFalloff != null ? [["Damage falloff resistance", `${weapon.damageFalloff}/100`]] : []),
                ...(weapon.projectileSpeed != null ? [["Projectile speed", `${weapon.projectileSpeed}/100`]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 text-xs">
                  <dt className="text-muted-foreground font-medium">{k}</dt>
                  <dd className="font-bold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card-surface p-6 rounded-3xl border border-border">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Wallet className="h-4 w-4 text-gold-light" /> Weapon Economy
            </h2>
            <dl className="mt-4 divide-y divide-border">
              {[
                ["Purchase price", weapon.priceDisplay],
                ...(weapon.ammoCost != null ? [["Ammunition cost", `$${weapon.ammoCost.toLocaleString()}`]] : []),
                ...(weapon.upgradeCost != null ? [["Full upgrades", `$${weapon.upgradeCost.toLocaleString()}`]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 text-xs">
                  <dt className="text-muted-foreground font-medium">{k}</dt>
                  <dd className="font-bold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            {weapon.customization?.length ? (
              <>
                <p className="mt-4 text-xs uppercase font-bold text-muted-foreground">Supported Modifications</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {weapon.customization.map((c) => (
                    <span key={c} className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                      {c}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
