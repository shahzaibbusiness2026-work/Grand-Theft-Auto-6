"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Star, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SectionHeader } from "@/components/section-header";
import { FilterBar } from "@/components/filter-bar";
import { characters, roleColor } from "@/lib/data";
import { cn } from "@/lib/utils";

const PILLS = ["All Characters", "Main Characters", "Supporting", "Antagonists", "Law Enforcement", "Civilians"];

export function CharactersClient() {
  const [pill, setPill] = useState("All Characters");

  const filtered = characters.filter((c) => {
    if (pill === "All Characters") return true;
    if (pill === "Main Characters") return c.role === "Protagonist";
    if (pill === "Antagonists") return c.role === "Antagonist";
    if (pill === "Law Enforcement") return c.role === "Law Enforcement";
    if (pill === "Civilians") return c.role === "Civilian";
    return c.role === "Supporting";
  });

  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-site pt-8">
        <div className="card-surface relative overflow-hidden min-h-[300px]">
          <Image
            src="/img/char-lucia.jpg"
            alt="Lucia Caminos - GTA 6 Lead Protagonist"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover object-[70%_20%] opacity-90 brightness-110 lg:object-top pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent pointer-events-none" />
          <div className="relative px-6 py-12 sm:px-10">
            <p className="section-eyebrow text-accent">Characters</p>
            <h1 className="mt-3 max-w-md font-display text-4xl font-extrabold leading-tight">
              Meet the People of <span className="text-primary">Leonida</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Explore detailed profiles of all confirmed and rumored characters in GTA 6.
            </p>
            <div className="mt-7 max-w-md">
              <FilterBar placeholder="Search characters..." selects={[{ label: "Role", options: ["All Roles", "Protagonist", "Antagonist", "Supporting"] }]} />
            </div>
          </div>
        </div>

        {/* Pills */}
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {PILLS.map((p) => (
            <button
              key={p}
              onClick={() => setPill(p)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors",
                pill === p
                  ? "border-transparent bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-neon-amber"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-site py-12">
        <SectionHeader title="Featured Characters" viewAllHref="/characters" viewAllLabel="View All Characters" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {characters.filter((c) => c.featured).map((c, i) => (
            <article key={c.id} className={cn("group card-surface overflow-hidden", i === 0 && "border-amber-500/70 shadow-neon-amber")}>
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={c.img}
                  alt={`${c.name} - GTA 6 Character (${c.role})`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-neon-amber">
                  <Star className="h-3 w-3" />
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-bold">{c.name}</h3>
                <p className={cn("mt-0.5 text-xs font-semibold", roleColor[c.role])}>{c.role}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ALL CHARACTERS */}
      <section className="container-site pb-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-extrabold uppercase tracking-wide">All Characters</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">{filtered.length} Characters Found</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-muted-foreground">Sort by:</span>
            <Select className="w-32" options={[{ value: "az", label: "A – Z" }, { value: "za", label: "Z – A" }]} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {filtered.map((c) => (
            <article key={c.id} className="group card-surface overflow-hidden">
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={c.img}
                  alt={`${c.name} - GTA 6 Character`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h3 className="truncate font-display text-[13px] font-bold">{c.name}</h3>
                <p className={cn("mt-0.5 text-[11px] font-semibold", roleColor[c.role])}>{c.role}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" size="sm" className="h-10 px-6">
            Load More Characters
          </Button>
        </div>
      </section>

      {/* STORIES BANNER */}
      <section className="container-site pb-16">
        <div className="card-surface grid gap-6 p-6 lg:grid-cols-2 lg:items-center">
          <div className="relative h-56 overflow-hidden rounded-xl">
            <Image
              src="/img/boat.jpg"
              alt="Vice City Character Stories"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-neon-amber transition-transform hover:scale-110">
              <Play className="h-5 w-5 fill-current" />
            </span>
          </div>
          <div>
            <p className="section-eyebrow text-accent">Character Stories</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold leading-snug">
              Every Character Has <br /> A Story
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Dive deeper into their background, relationships, and impact on the world of GTA 6.
            </p>
            <Button href="/blog" className="mt-6">
              Explore Character Stories <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

