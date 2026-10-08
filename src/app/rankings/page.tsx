import Link from "next/link";
import { SiteShell } from "@/components/shells";
import { VEHICLE_RANKINGS, WEAPON_RANKINGS } from "@/lib/rankings";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Rankings — Best Vehicles & Weapons, Auto-Updated",
  description:
    "Auto-generated GTA 6 rankings: fastest cars, best handling, best off-road, best weaponized vehicles, highest DPS weapons, best pistols, SMGs, assault rifles and snipers — always computed from our live database.",
  alternates: { canonical: "/rankings" },
};

function RankingCard({ href, icon: Icon, title, description, badge }: { href: string; icon: LucideIcon; title: string; description: string; badge: string }) {
  return (
    <Link
      href={href}
      className="card-surface group flex flex-col gap-2 rounded-2xl border border-border p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent" aria-hidden="true"><Icon className="h-5 w-5" /></span>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary">
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

export default function RankingsIndexPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* HERO */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
            🏆 Auto-Generated Rankings
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">BEST OF RANKINGS</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Every ranking below is computed automatically from our vehicle and weapon database — the same CMS data
            that powers the comparison duels. When new GTA 6 content is added, these rankings update themselves.
          </p>
        </div>

        {/* VEHICLE RANKINGS */}
        <section aria-labelledby="veh-rankings" className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="veh-rankings" className="font-display text-xl font-black uppercase tracking-tight text-foreground">
              🚗 Vehicle Rankings
            </h2>
            <Link href="/compare/vehicles" className="text-xs font-bold text-accent hover:underline">
              Open Comparison Duel →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {VEHICLE_RANKINGS.map((r) => (
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
            <h2 id="wep-rankings" className="font-display text-xl font-black uppercase tracking-tight text-foreground">
              🔫 Weapon Rankings
            </h2>
            <Link href="/compare/weapons" className="text-xs font-bold text-accent hover:underline">
              Open Comparison Duel →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {WEAPON_RANKINGS.map((r) => (
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
