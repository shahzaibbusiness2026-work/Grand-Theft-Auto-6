import Link from "next/link";
import { SiteShell } from "@/components/shells";
import { VEHICLE_RANKINGS, WEAPON_RANKINGS, getLiveRankingSlugs } from "@/lib/rankings";
import { getMergedVehicles, getMergedWeapons } from "@/lib/services/catalog";
import { Trophy, Car, Crosshair } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Rankings — Best Vehicles & Weapons, Auto-Updated",
  description:
    "Auto-generated GTA 6 rankings: fastest cars, best handling, best off-road, highest DPS weapons, best pistols, SMGs, assault rifles and snipers — always computed from our live database.",
  alternates: { canonical: "/rankings" },
  robots: { index: false, follow: true },
};

function RankingCard({ href, icon: Icon, title, description, badge }: { href: string; icon: LucideIcon; title: string; description: string; badge: string }) {
  return (
    <Link
      href={href}
      className="card-surface group flex flex-col gap-2 rounded-2xl border border-border p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent" aria-hidden="true"><Icon className="h-5 w-5" /></span>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-primary">
          {badge}
        </span>
      </div>
      <h2 className="font-display text-base font-black uppercase leading-tight text-foreground group-hover:text-accent">
        {title}
      </h2>
      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
    </Link>
  );
}

export default async function RankingsIndexPage() {
  // Only rankings with entries are linked: an empty ranking is a 404 page,
  // so listing it would send visitors into a dead end.
  const [vehicles, weapons] = await Promise.all([getMergedVehicles(), getMergedWeapons()]);
  const liveSlugs = new Set(getLiveRankingSlugs(vehicles, weapons));
  const liveVehicleRankings = VEHICLE_RANKINGS.filter((r) => liveSlugs.has(r.slug));
  const liveWeaponRankings = WEAPON_RANKINGS.filter((r) => liveSlugs.has(r.slug));
  const hiddenCount =
    VEHICLE_RANKINGS.length + WEAPON_RANKINGS.length - liveVehicleRankings.length - liveWeaponRankings.length;

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* HERO */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-gold-dark dark:text-gold-light mb-3">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> Auto-Generated Rankings
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">BEST OF RANKINGS</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Every ranking below is computed automatically from our vehicle and weapon database — the same CMS data
            that powers the comparison duels. When new GTA 6 content is added, these rankings update themselves.
            {hiddenCount > 0 && (
              <>
                {" "}
                {hiddenCount} ranking{hiddenCount > 1 ? "s are" : " is"} hidden for now because no confirmed
                entry exists yet — {hiddenCount > 1 ? "they" : "it"} will appear automatically once the database
                has one.
              </>
            )}
          </p>
        </div>

        {/* VEHICLE RANKINGS */}
        <section aria-labelledby="veh-rankings" className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="veh-rankings" className="flex items-center gap-2 font-display text-xl font-black uppercase tracking-tight text-foreground">
              <Car className="h-5 w-5 text-accent" aria-hidden="true" /> Vehicle Rankings
            </h2>
            <Link href="/compare/vehicles" className="text-xs font-bold text-accent hover:underline">
              Open Comparison Duel →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {liveVehicleRankings.map((r) => (
              <RankingCard
                key={r.slug}
                href={`/rankings/${r.slug}`}
                icon={r.icon}
                title={r.title}
                description={r.description}
                badge="Vehicles"
              />
            ))}
          </div>
        </section>

        {/* WEAPON RANKINGS */}
        <section aria-labelledby="wep-rankings">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="wep-rankings" className="flex items-center gap-2 font-display text-xl font-black uppercase tracking-tight text-foreground">
              <Crosshair className="h-5 w-5 text-accent" aria-hidden="true" /> Weapon Rankings
            </h2>
            <Link href="/compare/weapons" className="text-xs font-bold text-accent hover:underline">
              Open Comparison Duel →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {liveWeaponRankings.map((r) => (
              <RankingCard
                key={r.slug}
                href={`/rankings/${r.slug}`}
                icon={r.icon}
                title={r.title}
                description={r.description}
                badge="Weapons"
              />
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
