import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, ChevronRight } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { getMergedVehicles, getMergedWeapons } from "@/lib/services/catalog";
import { getComparisonWeights } from "@/lib/services/comparison";
import { getRankingDef } from "@/lib/rankings";
import {
  computeVehicleScore,
  computeWeaponScore,
  getVehicleBestFor,
  type BestForTag,
  type VehicleScoreWeights,
  type WeaponScoreWeights,
} from "@/lib/scoring";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const match = getRankingDef(slug);
  if (!match) return { title: "Ranking not found — GTA 6 Atlas" };
  return {
    title: `${match.def.title} — GTA 6 Atlas`,
    description: match.def.description,
    alternates: { canonical: `/rankings/${match.def.slug}` },
    openGraph: { title: match.def.title, description: match.def.description },
  };
}

interface RankingRow {
  name: string;
  slug: string;
  img: string;
  klass: string;
  manufacturer?: string;
  priceDisplay?: string;
  metric: number;
  score: number;
  display: string;
  bestFor: BestForTag[];
}

export default async function RankingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const match = getRankingDef(slug);
  if (!match) notFound();

  const weights = await getComparisonWeights();

  let rows: RankingRow[] = [];
  if (match.type === "vehicle") {
    const def = match.def;
    const vehicles = await getMergedVehicles();
    const candidates: (Omit<RankingRow, "metric"> & { metric: number | null })[] = vehicles.map((v) => ({
      name: v.name,
      slug: v.slug,
      img: v.img,
      klass: v.klass,
      manufacturer: v.manufacturer,
      priceDisplay: v.priceDisplay,
      metric: def.value(v),
      score: computeVehicleScore(v, weights.vehicle),
      display: def.format(v),
      bestFor: getVehicleBestFor(v),
    }));
    rows = candidates.filter((r): r is Omit<RankingRow, "metric"> & { metric: number } => r.metric != null);
  } else {
    const def = match.def;
    const weapons = await getMergedWeapons();
    const candidates: (Omit<RankingRow, "metric"> & { metric: number | null })[] = weapons.map((w) => ({
      name: w.name,
      slug: w.slug,
      img: w.img,
      klass: w.klass,
      manufacturer: w.manufacturer,
      priceDisplay: w.priceDisplay,
      metric: def.value(w),
      score: computeWeaponScore(w, weights.weapon),
      display: def.format(w),
      bestFor: [],
    }));
    rows = candidates.filter((r): r is Omit<RankingRow, "metric"> & { metric: number } => r.metric != null);
  }

  const lowerIsBetter = "lowerIsBetter" in match.def ? match.def.lowerIsBetter : false;
  rows.sort((a, b) => (lowerIsBetter ? a.metric - b.metric : b.metric - a.metric));
  const top = rows.slice(0, 12);
  const typeLabel = match.type === "vehicle" ? "Vehicles" : "Weapons";

  if (top.length === 0) notFound();

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* HERO */}
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/rankings" className="hover:text-accent">Rankings</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-foreground">{match.def.title}</span>
          </nav>
          <div className="flex items-start gap-3">
            <span className="text-4xl" aria-hidden="true">{match.def.emoji}</span>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground leading-tight">
                {match.def.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{match.def.description}</p>
            </div>
          </div>
          <div className="mt-4 inline-flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              Ranked by <span className="font-black text-foreground">{match.def.metricLabel}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              Live database • {top.length} entries
            </span>
          </div>
        </div>

        {/* RANKING LIST */}
        <ol className="space-y-3">
          {top.map((row, i) => {
            const href = match.type === "vehicle" ? `/vehicles/${row.slug}` : `/weapons/${row.slug}`;
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
            return (
              <li key={`${row.slug}-${i}`}>
                <Link
                  href={href}
                  className="card-surface group flex items-center gap-4 rounded-2xl border border-border p-4 transition-all hover:border-accent/50"
                >
                  <span
                    className={
                      "font-display text-xl font-black w-12 text-center shrink-0 " +
                      (i < 3 ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground")
                    }
                  >
                    {medal}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={row.img}
                    alt={row.name}
                    className="h-16 w-24 shrink-0 rounded-xl border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-base font-black uppercase text-foreground truncate group-hover:text-accent">
                      {row.name}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      {row.klass}
                      {row.manufacturer ? ` • ${row.manufacturer}` : ""}
                      {row.priceDisplay ? ` • ${row.priceDisplay}` : ""}
                    </p>
                    {row.bestFor.length > 0 && (
                      <div className="mt-1.5 hidden sm:flex flex-wrap gap-1">
                        {row.bestFor.slice(0, 2).map((t) => (
                          <span
                            key={t.label}
                            className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-accent"
                          >
                            {t.emoji} {t.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block font-mono font-black text-lg text-accent">{row.display}</span>
                    <span className="flex items-center gap-1 justify-end text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Trophy className="h-2.5 w-2.5" /> {row.score}/100
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>

        {/* CROSS LINKS */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={match.type === "vehicle" ? "/compare/vehicles" : "/compare/weapons"}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2 text-xs font-bold text-foreground hover:text-accent transition-colors"
          >
            ⚔️ Duel these in the Comparison Tool
          </Link>
          <Link
            href="/rankings"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2 text-xs font-bold text-foreground hover:text-accent transition-colors"
          >
            🏆 All {typeLabel} Rankings
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
