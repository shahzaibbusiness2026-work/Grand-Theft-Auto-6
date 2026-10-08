import { SiteShell } from "@/components/shells";
import { ThemeImage } from "@/components/theme-image";
import { MissionsClient } from "./missions-client";
import { Sparkles, Flag, Target, Trophy } from "lucide-react";
import type { Metadata } from "next";
import { canonicalMissions, type CanonicalMission } from "@/lib/canonical-data";
import { getMissions, type MissionRecord } from "@/lib/services/missions";

export const metadata: Metadata = {
  title: "GTA 6 Missions & Contracts Database — Story, Heists & Walkthroughs",
  description: "Comprehensive verified database of GTA 6 story missions, contracts, and heists. Filter by operative (Lucia, Jason), rewards, difficulty, and chapter.",
};

type DbMission = MissionRecord & {
  slug?: string;
  mission_type?: string;
  difficulty?: string;
  duration?: string;
  district?: string;
  cash_reward_display?: string;
  other_rewards?: string[];
  requirements?: string[];
  confidence?: string;
};

/** Map a DB mission row onto the CanonicalMission shape the client renders. */
function dbToCanonical(m: DbMission, match?: CanonicalMission): CanonicalMission {
  const objectives = (m.objectives || "").split("\n").map((s) => s.trim()).filter(Boolean);
  return {
    id: m.id,
    slug: m.slug || match?.slug || m.id,
    title: m.name,
    type: (m.mission_type as CanonicalMission["type"]) || match?.type || "Main Story",
    character: (m.protagonist as CanonicalMission["character"]) || match?.character || "Both",
    difficulty: (m.difficulty as CanonicalMission["difficulty"]) || match?.difficulty || "Medium",
    duration: m.duration || match?.duration || "15-20 min",
    district: m.district || match?.district || "Vice City",
    cashReward: match?.cashReward ?? null,
    cashRewardDisplay: m.cash_reward_display || match?.cashRewardDisplay || "TBD",
    otherRewards: m.other_rewards || match?.otherRewards || [],
    requirements: m.requirements || match?.requirements || [],
    objectives: objectives.length > 0 ? objectives : match?.objectives || [],
    choices: match?.choices || [],
    outcomes: match?.outcomes || [],
    unlocks: match?.unlocks || [],
    relatedMissions: match?.relatedMissions || [],
    confidence: (m.confidence as CanonicalMission["confidence"]) || match?.confidence || "REPORTED",
    source: match?.source || "Atlas Admin",
    description: m.description || match?.description || "",
    guideTips: match?.guideTips || [],
    img: match?.img || "/img/hero-dark.jpg",
  };
}

export default async function MissionsPage() {
  // Live Supabase data first; canonical static entries fill anything not yet in the DB.
  let missions: CanonicalMission[] = canonicalMissions;
  try {
    const dbMissions = (await getMissions()) as DbMission[];
    if (dbMissions && dbMissions.length > 0) {
      const dbIds = new Set(dbMissions.map((m) => m.id.toLowerCase()));
      const dbNames = new Set(dbMissions.map((m) => m.name.toLowerCase()));
      const dbMapped = dbMissions.map((m) =>
        dbToCanonical(
          m,
          canonicalMissions.find(
            (c) => c.id.toLowerCase() === m.id.toLowerCase() || c.title.toLowerCase() === m.name.toLowerCase()
          )
        )
      );
      const remaining = canonicalMissions.filter(
        (c) => !dbIds.has(c.id.toLowerCase()) && !dbNames.has(c.title.toLowerCase())
      );
      missions = [...dbMapped, ...remaining];
    }
  } catch {
    // Supabase unreachable — canonical data still renders
  }

  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-site pt-6">
        <div className="card-surface relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <ThemeImage
            dark="/img/hero-dark.jpg"
            light="/img/boat.jpg"
            alt="Leonida Missions"
            className="absolute right-0 top-0 h-full w-full object-cover lg:w-2/3 opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
          <div className="relative px-6 py-12 sm:px-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent mb-3">
              <Flag className="h-3 w-3" /> Campaign & Heists Archive
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-white">
              LEONIDA <span className="bg-gradient-to-r from-primary via-accent to-amber-400 bg-clip-text text-transparent">MISSIONS & HEISTS</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Browse confirmed story chapters, multi-approach bank heists, cartel side contracts, and dynamic stranger encounters across Vice City and beyond.
            </p>
          </div>
        </div>

        {/* Global Live Stats Counter */}
        <div className="card-surface -mt-6 relative mx-4 sm:mx-6 grid grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border sm:grid-cols-4 rounded-2xl shadow-xl border border-border">
          {[
            ["8+", "Story Arcs & Heists"],
            ["100%", "Verified Grounding"],
            ["Lucia & Jason", "Dual Protagonists"],
            ["$480K+", "Top Vault Score"],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col items-center gap-1 px-4 py-5 text-center">
              <span className="font-display text-xl sm:text-2xl font-black text-accent">{v}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE MISSIONS FINDER */}
      <section className="container-site py-7">
        <MissionsClient initialMissions={missions} />
      </section>
    </SiteShell>
  );
}
