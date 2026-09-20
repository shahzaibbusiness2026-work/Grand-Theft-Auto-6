"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Zap, Car, MapPin, Sparkles, ArrowRight, Quote } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { characters, Character } from "@/lib/data";
import { CharacterDetailModal } from "@/components/character-detail-modal";

const PROTAGONISTS = [
  {
    id: "lucia",
    name: "Lucia Caminos",
    role: "Lead Protagonist",
    alias: "The Mastermind",
    quote: "The only way we're gonna get through this is by sticking together, being a team.",
    voiceActor: "Manni L. Perez (Confirmed / Casting)",
    origin: "Vice City Metro / Leonida Penitentiary",
    specialty: "High-stakes Armed Robberies & Infiltration",
    perk: "Tactical Reflexes (Bullet Time) & Lockpicking",
    vehicle: "Bravado Banshee (Modified)",
    img: "/img/char-lucia.jpg",
    accentColor: "from-pink-600 via-purple-600 to-rose-500",
    borderGlow: "border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.15)]",
    tagColor: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  },
  {
    id: "jason",
    name: "Jason Duval",
    role: "Co-Protagonist",
    alias: "The Enforcer",
    quote: "Trust. That's what it comes down to. You and me against the whole damn state.",
    voiceActor: "Gregory Connors (Confirmed / Speculated)",
    origin: "Port Gellhorn & Keys Smuggling Routes",
    specialty: "Off-Road Getaway & Heavy Weapons Logistics",
    perk: "Smuggler Eagle Eye (POI & Cache Detection)",
    vehicle: "Declasse Tulip 1972 Muscle Car",
    img: "/img/char-jason.jpg",
    accentColor: "from-cyan-500 via-blue-600 to-purple-600",
    borderGlow: "border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    tagColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  },
];

export function ProtagonistsShowcase() {
  const [activeTab, setActiveTab] = useState<"both" | "lucia" | "jason">("both");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  return (
    <section aria-labelledby="protagonists-heading" className="container-site pt-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pink-400">
            <Sparkles className="h-3 w-3" /> Modern Bonnie & Clyde
          </div>
          <h2
            id="protagonists-heading"
            className="mt-3 font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground"
          >
            Meet the <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Protagonists</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Two criminals bound by fate, trust, and ambition in the unforgiving underworld of Leonida.
          </p>
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          <button
            onClick={() => setActiveTab("both")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              activeTab === "both"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dual View
          </button>
          <button
            onClick={() => setActiveTab("lucia")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              activeTab === "lucia"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Lucia
          </button>
          <button
            onClick={() => setActiveTab("jason")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              activeTab === "jason"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Jason
          </button>
        </div>
      </div>

      {/* Showcase Cards Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {PROTAGONISTS.filter(
          (p) => activeTab === "both" || activeTab === p.id
        ).map((p) => (
          <div
            key={p.id}
            className={cn(
              "group relative overflow-hidden rounded-3xl border bg-card/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-xl",
              p.borderGlow,
              activeTab !== "both" && "lg:col-span-2"
            )}
          >
            {/* Ambient background glow */}
            <div
              className={cn(
                "pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-25 blur-3xl bg-gradient-to-br",
                p.accentColor
              )}
            />

            <div className="flex flex-col md:flex-row h-full">
              {/* Character Portrait — 100% Clear & Visible with Natural 3:4 Aspect Ratio (No Washed Out Overlays) */}
              <div className="relative w-full md:w-[42%] min-h-[360px] md:min-h-[480px] overflow-hidden bg-[#070b14] shrink-0 border-b md:border-b-0 md:border-r border-white/10">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Mobile-only bottom fade so text below doesn't collide */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B1020] to-transparent md:hidden pointer-events-none" />
                
                {/* Role Badge Overlay */}
                <div className="absolute top-4 left-4">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg", p.tagColor)}>
                    <Sparkles className="w-3 h-3" />
                    {p.role}
                  </span>
                </div>
              </div>

              {/* Character Dossier Content — Clean, Structured 2x2 Layout */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-[#0B1020]/95">
                <div className="space-y-4">
                  {/* Top Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-pink-400">
                        CONFIRMED DOSSIER
                      </span>
                      <span className="w-1 h-1 rounded-full bg-pink-400" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                        Active
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg shadow-sm">
                      {p.alias}
                    </span>
                  </div>

                  {/* Character Name & Role Subtitle */}
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs font-mono text-pink-300/80 font-bold uppercase tracking-wider mt-0.5">
                      {p.role} • State of Leonida
                    </p>
                  </div>

                  {/* Character Quote */}
                  <blockquote className="flex items-start gap-2.5 rounded-xl border border-pink-500/20 bg-pink-950/15 p-3 text-xs italic text-pink-200/90 shadow-sm">
                    <Quote className="h-4 w-4 shrink-0 text-pink-400 opacity-90 mt-0.5" />
                    <span>&ldquo;{p.quote}&rdquo;</span>
                  </blockquote>

                  {/* Attribute Specs: Organized 2x2 Grid with Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 hover:border-pink-500/30 transition-colors">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400">
                        <Zap className="h-3 w-3 text-amber-400 shrink-0" />
                        <span>Special Ability</span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-white leading-snug">
                        {p.perk}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 hover:border-pink-500/30 transition-colors">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400">
                        <Shield className="h-3 w-3 text-pink-400 shrink-0" />
                        <span>Specialty</span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-white leading-snug">
                        {p.specialty}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 hover:border-pink-500/30 transition-colors">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400">
                        <Car className="h-3 w-3 text-purple-400 shrink-0" />
                        <span>Signature Ride</span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-white leading-snug">
                        {p.vehicle}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 hover:border-pink-500/30 transition-colors">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400">
                        <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span>Territory</span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-white leading-snug">
                        {p.origin}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Actor: <strong className="text-white">{p.voiceActor}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const matched = characters.find((c) => c.id === p.id);
                      if (matched) setSelectedCharacter(matched);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white transition-all shadow-md shadow-pink-500/25 active:scale-95"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Character Profile Detail Modal */}
      <CharacterDetailModal 
        character={selectedCharacter} 
        onClose={() => setSelectedCharacter(null)} 
      />
    </section>
  );
}
