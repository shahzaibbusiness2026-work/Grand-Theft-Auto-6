"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Shield, 
  Zap, 
  Car, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Crown,
  Handshake,
  Quote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { characters, Character } from "@/lib/data";
import { CharacterDetailModal } from "@/components/character-detail-modal";

export function ProtagonistsShowcase() {
  const [activeTab, setActiveTab] = useState<"both" | "lucia" | "jason">("both");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const openDossier = (id: string) => {
    const matched = characters.find((c) => c.id === id);
    if (matched) setSelectedCharacter(matched);
  };

  return (
    <section aria-labelledby="protagonists-heading" className="container-site pt-16">
      {/* Section Header */}
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

        {/* View mode toggle buttons */}
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
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* CARD 1: LUCIA CAMINOS */}
        {(activeTab === "both" || activeTab === "lucia") && (
          <div
            className={cn(
              "group relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-white border-2 border-pink-400/80 shadow-[0_0_35px_rgba(244,114,182,0.45),0_15px_35px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1",
              activeTab === "lucia" && "lg:col-span-2 max-w-4xl mx-auto w-full"
            )}
          >
            <div className="flex flex-col lg:flex-row h-full">
              {/* Left Column: Lucia Portrait & Artwork Overlays */}
              <div className="relative w-full lg:w-[45%] min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] overflow-hidden bg-slate-900 shrink-0 select-none">
                <Image
                  src="/img/char-lucia.jpg"
                  alt="Lucia Caminos"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Soft gradient blend into the white right content pane */}
                <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-white pointer-events-none" />
                <div className="block lg:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />

                {/* Top-Left Pill Badge: LEAD PROTAGONIST */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#5b1434]/90 border border-pink-400/50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white backdrop-blur-md shadow-lg">
                    <Crown className="w-3.5 h-3.5 text-pink-300" />
                    <span>LEAD PROTAGONIST</span>
                  </div>
                </div>

                {/* Left VI Watermark & Vice City Cursive Script */}
                <div className="absolute top-16 left-4 z-10 pointer-events-none">
                  <div className="font-display text-5xl sm:text-6xl font-black text-pink-500/85 drop-shadow-[0_0_20px_rgba(236,72,153,0.7)] tracking-tighter leading-none">
                    VI
                  </div>
                  <div className="-mt-3 sm:-mt-4 text-2xl sm:text-3xl font-serif italic text-pink-400 font-bold drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] -rotate-12">
                    Vice City
                  </div>
                </div>

                {/* Bottom-Left Tagline */}
                <div className="absolute bottom-5 left-5 z-10 pointer-events-none">
                  <p className="font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    A BRIGHTER<br />TOMORROW<br />TOGETHER.
                  </p>
                  <div className="w-14 h-0.5 bg-pink-500 mt-1 shadow-[0_0_8px_#ec4899]" />
                </div>
              </div>

              {/* Right Column: White Content Pane */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-white text-slate-900">
                <div className="space-y-4">
                  {/* Top Dossier Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-pink-600">
                      CONFIRMED DOSSIER
                    </span>
                    <span className="rounded-full bg-[#334155] text-white text-xs font-semibold px-3.5 py-1 shadow-sm">
                      The Mastermind
                    </span>
                  </div>

                  {/* Character Name */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 leading-none">
                      <span className="text-pink-600">LUCIA</span> CAMINOS
                    </h3>
                  </div>

                  {/* Quote Box */}
                  <div className="rounded-2xl bg-pink-50/70 border border-pink-200/90 p-3.5 sm:p-4 flex items-start gap-3 shadow-sm">
                    <Quote className="w-5 h-5 text-pink-500 shrink-0 mt-0.5 rotate-180" />
                    <p className="text-xs sm:text-[13px] italic font-medium text-pink-700 leading-relaxed">
                      &ldquo;The only way we&apos;re gonna get through this is by sticking together, being a team.&rdquo;
                    </p>
                  </div>

                  {/* Specs List: Vertical 4-Row Key-Value Stack */}
                  <div className="space-y-3 pt-1">
                    {/* Special Ability */}
                    <div className="flex items-start sm:items-center gap-2 text-xs sm:text-[13px]">
                      <div className="flex items-center gap-2 text-slate-500 font-semibold w-36 sm:w-40 shrink-0">
                        <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Special Ability:</span>
                      </div>
                      <span className="font-bold text-slate-900 leading-snug">
                        Tactical Reflexes (Bullet Time) &amp; Lockpicking
                      </span>
                    </div>

                    {/* Specialty */}
                    <div className="flex items-start sm:items-center gap-2 text-xs sm:text-[13px]">
                      <div className="flex items-center gap-2 text-slate-500 font-semibold w-36 sm:w-40 shrink-0">
                        <Shield className="w-4 h-4 text-pink-500 shrink-0" />
                        <span>Specialty:</span>
                      </div>
                      <span className="font-bold text-slate-900 leading-snug">
                        High-stakes Armed Robberies &amp; Infiltration
                      </span>
                    </div>

                    {/* Signature Ride */}
                    <div className="flex items-start sm:items-center gap-2 text-xs sm:text-[13px]">
                      <div className="flex items-center gap-2 text-slate-500 font-semibold w-36 sm:w-40 shrink-0">
                        <Car className="w-4 h-4 text-purple-500 shrink-0" />
                        <span>Signature Ride:</span>
                      </div>
                      <span className="font-bold text-slate-900 leading-snug">
                        Bravado Banshee (Modified)
                      </span>
                    </div>

                    {/* Territory */}
                    <div className="flex items-start sm:items-center gap-2 text-xs sm:text-[13px]">
                      <div className="flex items-center gap-2 text-slate-500 font-semibold w-36 sm:w-40 shrink-0">
                        <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
                        <span>Territory:</span>
                      </div>
                      <span className="font-bold text-slate-900 leading-snug">
                        Vice City Metro / Leonida Penitentiary
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-500">Actor: </span>
                    <span className="font-bold text-slate-900">Manni L. Perez</span>
                    <p className="text-[11px] text-slate-500">(Confirmed / Casting)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openDossier("lucia")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md shadow-pink-500/30 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CARD 2: JASON DUVAL */}
        {(activeTab === "both" || activeTab === "jason") && (
          <div
            className={cn(
              "group relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-white border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(56,189,248,0.45),0_15px_35px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1",
              activeTab === "jason" && "lg:col-span-2 max-w-4xl mx-auto w-full"
            )}
          >
            <div className="flex flex-col lg:flex-row h-full">
              {/* Left Column: Jason Portrait & Artwork Overlays */}
              <div className="relative w-full lg:w-[45%] min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] overflow-hidden bg-slate-900 shrink-0 select-none">
                <Image
                  src="/img/char-jason.jpg"
                  alt="Jason Duval"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Soft gradient blend into the white right content pane */}
                <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-white pointer-events-none" />
                <div className="block lg:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />

                {/* Top-Left Pill Badge: CO-PROTAGONIST */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0c4a6e]/90 border border-cyan-400/50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white backdrop-blur-md shadow-lg">
                    <Handshake className="w-3.5 h-3.5 text-cyan-300" />
                    <span>CO-PROTAGONIST</span>
                  </div>
                </div>

                {/* Left VI Watermark */}
                <div className="absolute top-16 left-4 z-10 pointer-events-none">
                  <div className="font-display text-5xl sm:text-6xl font-black text-cyan-400/75 drop-shadow-[0_0_20px_rgba(6,182,212,0.7)] tracking-tighter leading-none">
                    VI
                  </div>
                </div>

                {/* Bottom-Left Tagline */}
                <div className="absolute bottom-5 left-5 z-10 pointer-events-none">
                  <p className="font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    SAME<br />STREETS<br />HIGHER<br />STAKES...
                  </p>
                  <div className="w-14 h-0.5 bg-cyan-400 mt-1 shadow-[0_0_8px_#22d3ee]" />
                </div>
              </div>

              {/* Right Column: White Content Pane */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-white text-slate-900">
                <div className="space-y-4">
                  {/* Top Dossier Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
                      CONFIRMED DOSSIER
                    </span>
                    <span className="rounded-full bg-[#334155] text-white text-xs font-semibold px-3.5 py-1 shadow-sm">
                      The Enforcer
                    </span>
                  </div>

                  {/* Character Name */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 leading-none">
                      <span className="text-blue-600">JASON</span> DUVAL
                    </h3>
                  </div>

                  {/* Quote Box */}
                  <div className="rounded-2xl bg-sky-50/70 border border-sky-200/90 p-3.5 sm:p-4 flex items-start gap-3 shadow-sm">
                    <Quote className="w-5 h-5 text-sky-500 shrink-0 mt-0.5 rotate-180" />
                    <p className="text-xs sm:text-[13px] italic font-medium text-sky-800 leading-relaxed">
                      &ldquo;Trust. That&apos;s what it comes down to. You and me against the whole damn state.&rdquo;
                    </p>
                  </div>

                  {/* Specs List: Vertical 4-Row Key-Value Stack */}
                  <div className="space-y-3 pt-1">
                    {/* Special Ability */}
                    <div className="flex items-start sm:items-center gap-2 text-xs sm:text-[13px]">
                      <div className="flex items-center gap-2 text-slate-500 font-semibold w-36 sm:w-40 shrink-0">
                        <Zap className="w-4 h-4 text-sky-500 shrink-0" />
                        <span>Special Ability:</span>
                      </div>
                      <span className="font-bold text-slate-900 leading-snug">
                        Smuggler Eagle Eye (POI &amp; Cache Detection)
                      </span>
                    </div>

                    {/* Specialty */}
                    <div className="flex items-start sm:items-center gap-2 text-xs sm:text-[13px]">
                      <div className="flex items-center gap-2 text-slate-500 font-semibold w-36 sm:w-40 shrink-0">
                        <Shield className="w-4 h-4 text-sky-500 shrink-0" />
                        <span>Specialty:</span>
                      </div>
                      <span className="font-bold text-slate-900 leading-snug">
                        Off-Road Getaway &amp; Heavy Weapons Logistics
                      </span>
                    </div>

                    {/* Signature Ride */}
                    <div className="flex items-start sm:items-center gap-2 text-xs sm:text-[13px]">
                      <div className="flex items-center gap-2 text-slate-500 font-semibold w-36 sm:w-40 shrink-0">
                        <Car className="w-4 h-4 text-sky-500 shrink-0" />
                        <span>Signature Ride:</span>
                      </div>
                      <span className="font-bold text-slate-900 leading-snug">
                        Declasse Tulip 1972 Muscle Car
                      </span>
                    </div>

                    {/* Territory */}
                    <div className="flex items-start sm:items-center gap-2 text-xs sm:text-[13px]">
                      <div className="flex items-center gap-2 text-slate-500 font-semibold w-36 sm:w-40 shrink-0">
                        <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                        <span>Territory:</span>
                      </div>
                      <span className="font-bold text-slate-900 leading-snug">
                        Port Gellhorn &amp; Keys Smuggling Routes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-500">Actor: </span>
                    <span className="font-bold text-slate-900">Gregory Connors</span>
                    <p className="text-[11px] text-slate-500">(Confirmed / Speculated)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openDossier("jason")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Character Profile Detail Modal */}
      <CharacterDetailModal 
        character={selectedCharacter} 
        onClose={() => setSelectedCharacter(null)} 
      />
    </section>
  );
}
