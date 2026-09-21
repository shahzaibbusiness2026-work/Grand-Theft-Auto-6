"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Star, ArrowRight, Sparkles, User, Shield, Zap, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SectionHeader } from "@/components/section-header";
import { FilterBar } from "@/components/filter-bar";
import { characters, roleColor, Character } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CharacterDetailModal } from "@/components/character-detail-modal";

const PILLS = ["All Characters", "Main Characters", "Supporting", "Antagonists", "Law Enforcement", "Civilians"];

interface CharactersClientProps {
  initialCharacters?: Character[];
}

export function CharactersClient({ initialCharacters }: CharactersClientProps) {
  const [pill, setPill] = useState("All Characters");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const characterList = initialCharacters && initialCharacters.length > 0 ? initialCharacters : characters;

  const filtered = characterList.filter((c) => {
    // Role filter
    let roleMatch = true;
    if (pill === "Main Characters") roleMatch = c.role === "Protagonist";
    else if (pill === "Antagonists") roleMatch = c.role === "Antagonist";
    else if (pill === "Law Enforcement") roleMatch = c.role === "Law Enforcement";
    else if (pill === "Civilians") roleMatch = c.role === "Civilian";
    else if (pill === "Supporting") roleMatch = c.role === "Supporting";

    // Search query filter
    let searchMatch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      searchMatch = 
        c.name.toLowerCase().includes(q) ||
        (c.alias && c.alias.toLowerCase().includes(q)) ||
        c.desc.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q);
    }

    return roleMatch && searchMatch;
  });

  return (
    <>
      {/* 1. HERO BANNER — Clean Split Layout (No Text Overlap, Natural Portrait Proportions) */}

      <section className="container-site pt-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0B1020] via-[#141C2E] to-[#0B1020] p-6 sm:p-10 shadow-2xl">
          {/* Ambient Lighting */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-pink-500/15 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (Text, Eyebrow, Search, Description) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-950/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-pink-400 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                CONFIRMED ROSTER & LORE
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Meet the People of{" "}
                <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  Leonida
                </span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed">
                Explore verified intelligence dossiers, voice casting, criminal records, and syndicate affiliations across Vice City and the State of Leonida.
              </p>

              <div className="pt-2 max-w-lg">
                <FilterBar
                  placeholder="Search characters, aliases, or roles..."
                  onSearch={setSearchQuery}
                  selects={[{ label: "Role", options: ["All Roles", "Protagonist", "Antagonist", "Supporting", "Law Enforcement", "Civilian"] }]}
                />
              </div>
            </div>

            {/* Right Content: Dual Protagonist Spotlight Frame (Lucia & Jason in Natural 3:4 Aspect Ratio) */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end gap-3 sm:gap-4">
              {/* Lucia Spotlight */}
              <button
                type="button"
                onClick={() => {
                  const lucia = characters.find((c) => c.id === "lucia");
                  if (lucia) setSelectedCharacter(lucia);
                }}
                className="group relative w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden border border-pink-500/40 bg-black/60 shadow-xl hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] transition-all hover:scale-105 text-left"
                title="View Lucia Caminos Profile"
              >
                <Image
                  src="/img/char-lucia.jpg"
                  alt="Lucia Caminos"
                  fill
                  priority
                  sizes="200px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 inset-x-2 text-center">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-pink-400 block">Lead Protagonist</span>
                  <strong className="text-xs sm:text-sm font-black text-white block truncate drop-shadow">Lucia Caminos</strong>
                </div>
              </button>

              {/* Jason Spotlight */}
              <button
                type="button"
                onClick={() => {
                  const jason = characters.find((c) => c.id === "jason");
                  if (jason) setSelectedCharacter(jason);
                }}
                className="group relative w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden border border-cyan-500/40 bg-black/60 shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all hover:scale-105 text-left"
                title="View Jason Duval Profile"
              >
                <Image
                  src="/img/char-jason.jpg"
                  alt="Jason Duval"
                  fill
                  priority
                  sizes="200px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 inset-x-2 text-center">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-cyan-400 block">Co-Protagonist</span>
                  <strong className="text-xs sm:text-sm font-black text-white block truncate drop-shadow">Jason Duval</strong>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {PILLS.map((p) => (
            <button
              key={p}
              onClick={() => setPill(p)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-all",
                pill === p
                  ? "border-transparent bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-md shadow-pink-500/25"
                  : "border-white/10 bg-card text-muted-foreground hover:text-foreground hover:border-white/20"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* 2. FEATURED CHARACTERS — Perfectly Proportioned 3:4 Portrait Cards with Interactive Click */}
      <section className="container-site py-12">
        <SectionHeader 
          title="Featured Characters" 
          viewAllHref="#all-characters" 
          viewAllLabel="View All Characters" 
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {characters.filter((c) => c.featured).map((c, i) => (
            <article 
              key={c.id} 
              onClick={() => setSelectedCharacter(c)}
              className={cn(
                "group relative card-surface overflow-hidden rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] cursor-pointer",
                i === 0 && "border-pink-500/60"
              )}
            >
              {/* Perfectly Proportioned 3:4 Aspect Ratio Image Box */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                <Image
                  src={c.img}
                  alt={`${c.name} - GTA 6 Character (${c.role})`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent pointer-events-none" />
                
                {/* Top Badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white shadow-md shadow-pink-500/40">
                    <Star className="h-3 w-3 fill-current" />
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/70 border border-white/20 text-white backdrop-blur-md">
                    {c.role}
                  </span>
                </div>

                {/* Hover CTA prompt */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center justify-center w-full gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-pink-500/30">
                    <span>View Dossier</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 bg-[#0B1020]/90">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                    {c.name}
                  </h3>
                  {c.alias && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                      {c.alias}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-300 line-clamp-2">
                  {c.desc}
                </p>

                {c.specialty && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="truncate">{c.specialty}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. ALL CHARACTERS GRID — Perfectly Proportioned Portrait Grid with Interactive Click */}
      <section id="all-characters" className="container-site pb-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-black uppercase tracking-wide text-white">
              All Characters
            </h2>
            <p className="mt-1 text-xs font-mono text-pink-400">
              {filtered.length} Characters Found • Click any card for full dossier
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-muted-foreground">Filter:</span>
            <span className="text-xs font-mono font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              {pill}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {filtered.map((c) => (
            <article 
              key={c.id} 
              onClick={() => setSelectedCharacter(c)}
              className="group card-surface overflow-hidden rounded-xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]"
            >
              {/* Natural 3:4 Aspect Ratio Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                <Image
                  src={c.img}
                  alt={`${c.name} - GTA 6 Character`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Role badge tag */}
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider bg-black/70 border border-white/20 text-white backdrop-blur-md">
                  {c.role}
                </span>

                {/* Hover overlay indicator */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] font-bold text-white bg-pink-600 px-2.5 py-1 rounded-lg shadow-lg">
                    Dossier &rarr;
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#0B1020]/95">
                <h3 className="truncate font-display text-[13px] font-bold text-white group-hover:text-pink-300 transition-colors">
                  {c.name}
                </h3>
                <p className="mt-0.5 text-[11px] font-mono text-pink-400/90 truncate">
                  {c.alias || c.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. STORIES BANNER */}
      <section className="container-site pb-16">
        <div className="card-surface grid gap-6 p-6 lg:grid-cols-2 lg:items-center rounded-3xl border border-white/10">
          <div className="relative h-56 overflow-hidden rounded-2xl">
            <Image
              src="/img/boat.jpg"
              alt="Vice City Character Stories"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/40 transition-transform hover:scale-110">
              <Play className="h-5 w-5 fill-current" />
            </span>
          </div>
          <div>
            <p className="section-eyebrow text-pink-400">Character Stories</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold leading-snug text-white">
              Every Character Has <br /> A Story
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Dive deeper into their background, relationships, and impact on the criminal underworld of GTA 6.
            </p>
            <Button href="/blog" className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold">
              Explore Character Stories <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Interactive Character Profile Detail Modal */}
      <CharacterDetailModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </>
  );
}

