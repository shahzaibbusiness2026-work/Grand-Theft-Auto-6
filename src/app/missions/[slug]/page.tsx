import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Flag,
  Target,
  Clock,
  Coins,
  ShieldCheck,
  Users,
  CheckCircle2,
  Sparkles,
  MapPin,
  Car,
  Crosshair,
  ArrowRight,
  Lightbulb,
  Split,
  Unlock,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeImage } from "@/components/theme-image";
import { canonicalMissions, canonicalLocations, canonicalVehicles, canonicalWeapons } from "@/lib/canonical-data";
import { ConfidenceBadge } from "@/components/confidence-badge";

export function generateStaticParams() {
  return canonicalMissions.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mission = canonicalMissions.find((m) => m.slug === slug || m.id === slug);
  if (!mission) return { title: "Mission Not Found — GTA 6 Atlas" };

  return {
    title: `${mission.title} — GTA 6 Mission Guide & Walkthrough`,
    description: `Full mission guide for '${mission.title}' in GTA 6: Objectives, choices & outcomes, rewards (${mission.cashRewardDisplay}), character requirements, and strategic tips.`,
    openGraph: {
      title: `${mission.title} — Walkthrough & Rewards`,
      description: mission.description,
      images: [mission.img],
    },
  };
}

export default async function MissionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mission =
    canonicalMissions.find((m) => m.slug === slug || m.id === slug) ??
    canonicalMissions[0];

  if (!mission) {
    notFound();
  }

  // Find related entities
  const relatedLocation = canonicalLocations.find((l) =>
    l.district.toLowerCase().includes(mission.district.toLowerCase()) ||
    l.name.toLowerCase().includes(mission.district.toLowerCase())
  );

  return (
    <SiteShell>
      <section className="container-site pt-6 pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/missions" className="hover:text-primary transition-colors">Missions</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground">{mission.type}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">{mission.title}</span>
        </nav>

        {/* HERO BANNER */}
        <div className="card-surface relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-10">
          <div className="absolute right-0 top-0 h-full w-full lg:w-2/3 opacity-40">
            <img src={mission.img} alt={mission.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          </div>

          <div className="relative max-w-xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="bg-primary/20 text-primary border-primary/40 font-bold">
                {mission.type}
              </Badge>
              <ConfidenceBadge level={mission.confidence} source={mission.source} />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white leading-tight">
              {mission.title}
            </h1>

            <p className="text-sm leading-relaxed text-slate-300">
              {mission.description}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="rounded-2xl border border-white/10 bg-black/50 p-3 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Operative</span>
                <span className="font-display text-sm font-black text-accent">{mission.character}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 p-3 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Cash Payout</span>
                <span className="font-mono text-sm font-black text-amber-400">{mission.cashRewardDisplay}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 p-3 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Duration</span>
                <span className="font-display text-sm font-black text-white">{mission.duration}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 p-3 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Difficulty</span>
                <span className="font-display text-sm font-black text-[#00F0FF]">{mission.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MISSION OBJECTIVES & CHOICES */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Objectives Checklist */}
          <div className="card-surface p-6 rounded-3xl border border-white/10">
            <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <Target className="h-4 w-4 text-accent" /> Key Objectives
            </h2>
            <ul className="mt-4 space-y-3">
              {mission.objectives.map((obj, i) => (
                <li key={obj} className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/40 p-3 text-xs text-slate-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 font-bold text-amber-400 text-[10px]">
                    {i + 1}
                  </span>
                  <span className="font-medium pt-0.5">{obj}</span>
                </li>
              ))}
            </ul>

            {/* Tactical Guide Tips */}
            {mission.guideTips.length > 0 && (
              <div className="mt-6 rounded-2xl border border-[#00F0FF]/30 bg-[#00F0FF]/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00F0FF] uppercase">
                  <Lightbulb className="h-4 w-4" /> Tactical Pro-Tip
                </div>
                {mission.guideTips.map((tip, idx) => (
                  <p key={idx} className="text-xs text-slate-200 leading-relaxed font-medium">
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Branching Choices & Unlocks */}
          <div className="space-y-6">
            {/* Choices */}
            <div className="card-surface p-6 rounded-3xl border border-white/10">
              <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
                <Split className="h-4 w-4 text-amber-400" /> Approaches & Branching Choices
              </h2>
              <div className="mt-4 space-y-2.5">
                {mission.choices.map((c, i) => (
                  <div key={c} className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-slate-300">
                    <span className="block text-[10px] uppercase font-bold text-amber-400 mb-1">
                      Approach #{i + 1}:
                    </span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards & Unlocks */}
            <div className="card-surface p-6 rounded-3xl border border-white/10">
              <h2 className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-2 text-white">
                <Unlock className="h-4 w-4 text-emerald-400" /> Rewards & Permanent Unlocks
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {mission.otherRewards.map((r) => (
                  <span key={r} className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{r}</span>
                  </span>
                ))}
                {mission.unlocks.map((u) => (
                  <span key={u} className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Unlocks: {u}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED INTEL & MAP LINK */}
        {relatedLocation && (
          <div className="mt-8 card-surface p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={relatedLocation.img} alt={relatedLocation.name} className="h-16 w-20 rounded-2xl object-cover border border-white/10" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Mission District & Hotspot</span>
                <h3 className="font-display text-lg font-bold text-white">{relatedLocation.name}</h3>
                <p className="text-xs text-slate-300">{relatedLocation.district} &bull; Threat Level: {relatedLocation.threatLevel}</p>
              </div>
            </div>

            <Button href={`/map?poi=${relatedLocation.id}`} className="bg-gradient-to-r from-primary to-accent font-bold text-xs">
              <MapPin className="h-3.5 w-3.5 mr-1 text-[#00F0FF]" /> Open on Satellite Radar
            </Button>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
