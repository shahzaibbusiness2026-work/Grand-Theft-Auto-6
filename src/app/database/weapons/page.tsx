"use client";

import React, { useState } from "react";
import {
  Crosshair,
  Sword,
  Target,
  Lock,
  Heart,
  Bookmark,
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
} from "lucide-react";
import { AppShell, PremiumCard } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { dbWeapons, topWeapons, weaponCategories } from "@/lib/data";
import { cn } from "@/lib/utils";

const types = [
  ["All Weapons", 118],
  ["Pistols", 18],
  ["SMGs", 16],
  ["Shotguns", 12],
  ["Assault Rifles", 21],
  ["Sniper Rifles", 9],
  ["LMGs", 7],
  ["Launchers", 6],
  ["Melee", 17],
  ["Special", 12],
] as const;

const rarityVariant: Record<string, "pink" | "green" | "blue" | "yellow" | "default"> = {
  Featured: "default",
  Common: "green",
  Rare: "blue",
  Epic: "yellow",
  Legendary: "yellow",
};

const statLabels = ["Damage", "Fire Rate", "Accuracy", "Range"];

export default function WeaponDatabasePage() {
  const [type, setType] = useState<string>("All Weapons");
  const [price, setPrice] = useState<number[]>([0, 2000000]);

  return (
    <AppShell>
      {/* HERO */}
      <section className="w-full px-4 pt-8 sm:px-6 md:px-8 lg:px-10">
        <div className="card-surface relative overflow-hidden bg-gradient-to-br from-card via-card/85 to-primary/5">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide">Weapon Database</h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                All weapons in GTA 6. Stats, locations, prices and everything you need to know.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total Weapons", value: "118", icon: Crosshair, color: "text-amber-500 dark:text-amber-400" },
                { label: "Melee Weapons", value: "24", icon: Sword, color: "text-purple-400" },
                { label: "Ranged Weapons", value: "94", icon: Target, color: "text-sky-400" },
                { label: "Unlocked", value: "58 / 118", icon: Lock, color: "text-amber-500 dark:text-amber-400" },
              ].map((s) => (
                <div key={s.label} className="card-surface flex items-center gap-3 px-4 py-3">
                  <s.icon className={cn("h-5 w-5", s.color)} />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="font-display text-lg font-extrabold">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid w-full gap-6 px-4 py-8 sm:px-6 md:px-8 lg:px-10 lg:grid-cols-[250px_1fr_280px]">
        {/* FILTERS */}
        <aside className="card-surface h-fit p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wider">Filter Weapons</h2>
            <button className="text-xs font-semibold text-accent">Clear All</button>
          </div>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search weapons..." className="pl-9" />
          </div>

          <h3 className="section-eyebrow mt-6 text-muted-foreground">Weapon Type</h3>
          <nav className="mt-3 space-y-1">
            {types.map(([label, count]) => (
              <button
                key={label}
                onClick={() => setType(label)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] font-semibold text-muted-foreground hover:text-white",
                  type === label && "border border-accent/50 bg-accent/10 text-white"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Crosshair className="h-3.5 w-3.5 text-accent" /> {label}
                </span>
                <span className="text-[11px]">{count}</span>
              </button>
            ))}
          </nav>

          <h3 className="section-eyebrow mt-6 text-muted-foreground">Rarity</h3>
          <div className="mt-3 space-y-2">
            {["All Rarities", "Common", "Uncommon", "Rare", "Epic", "Legendary"].map((r, i) => (
              <label key={r} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                <input type="checkbox" defaultChecked={i === 0} className="h-3.5 w-3.5 rounded accent-[#f0459c]" />
                {r}
              </label>
            ))}
          </div>

          <h3 className="section-eyebrow mt-6 text-muted-foreground">Price Range</h3>
          <div className="mt-3 space-y-3">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>${(price[0] / 1000).toFixed(0)}K</span>
              <span>${(price[1] / 1000).toFixed(0)}K+</span>
            </div>
            <input
              type="range" min={0} max={2000000} step={25000}
              value={price[0]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice([Number(e.target.value), price[1]])}
              className="w-full accent-[#a855f7]"
              aria-label="Minimum price"
            />
            <input
              type="range" min={0} max={2000000} step={25000}
              value={price[1]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice([price[0], Number(e.target.value)])}
              className="w-full accent-[#a855f7]"
              aria-label="Maximum price"
            />
          </div>

          <h3 className="section-eyebrow mt-6 text-muted-foreground">Sort By</h3>
          <Select className="mt-3" options={[{ value: "default", label: "Default" }, { value: "price", label: "Price" }, { value: "damage", label: "Damage" }]} />

          <Button variant="outline" className="mt-6 w-full">
            Reset Filters
          </Button>
        </aside>

        {/* GRID */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-4 text-[13px] font-semibold">
              <button className="border-b-2 border-accent pb-2 text-white">All Weapons <span className="text-muted-foreground">118</span></button>
              <button className="pb-2 text-muted-foreground">Owned / Unlocked <span>58</span></button>
              <button className="pb-2 text-muted-foreground">Recently Viewed <span>8</span></button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-8">
                <LayoutGrid className="h-3.5 w-3.5" /> Grid View
              </Button>
              <Button variant="secondary" size="sm" className="h-8">
                <List className="h-3.5 w-3.5" /> List View
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {dbWeapons.map((w, i) => (
              <article key={w.name} className="group card-surface overflow-hidden">
                <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-neon-purple/15 to-black/30">
                  <img src="/img/rifle.svg" alt={w.name} className="h-full w-full object-cover mix-blend-lighten" style={{ filter: `hue-rotate(${i * 35}deg) brightness(1.35)` }} />
                  <Badge variant={rarityVariant[w.rarity] ?? "gray"} className="absolute left-2 top-2 uppercase">
                    {w.rarity}
                  </Badge>
                  <span className="absolute right-2 top-2 flex gap-1.5 text-white">
                    <Bookmark className="h-3.5 w-3.5" />
                    <Heart className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-bold">{w.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{w.klass}</p>
                  <p className="mt-2 font-display text-sm font-extrabold text-accent">{w.price}</p>
                  <div className="mt-3 grid grid-cols-4 gap-1 border-t border-border pt-3 text-center">
                    {w.stats.map((s, j) => (
                      <div key={j}>
                        <p className="text-[11px] font-bold">{s}</p>
                        <p className="text-[8px] uppercase tracking-wide text-muted-foreground">{statLabels[j]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <Button variant="secondary" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {["1", "2", "3", "â€¦", "6"].map((p) => (
              <button key={p} className={cn("h-8 w-8 rounded-lg text-[13px] font-bold", p === "1" ? "bg-gradient-to-r from-primary to-accent text-white" : "bg-card text-muted-foreground hover:text-white")}>
                {p}
              </button>
            ))}
            <Button variant="secondary" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* CATEGORIES */}
          <div className="card-surface p-6">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wider">Weapon Categories</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {weaponCategories.map((c, i) => (
                <a key={c.label} href="/database/weapons" className="card-surface flex flex-col items-center gap-2 p-3 text-center transition-colors hover:border-accent/60">
                  <div className="h-14 w-full overflow-hidden rounded-md">
                    <img src="/img/rifle.svg" alt="" className="h-full w-full object-cover opacity-90" style={{ filter: `hue-rotate(${i * 40}deg) grayscale(0.15) brightness(1.2)` }} />
                  </div>
                  <span className="text-xs font-bold">{c.label}</span>
                  <span className="text-[9px] text-muted-foreground">{c.count}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          <div className="card-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-wider">
                <Flame className="h-4 w-4 text-accent" /> Top Weapons
              </h2>
              <a href="/database/weapons" className="text-xs font-semibold text-accent">View All</a>
            </div>
            <ul className="mt-4 space-y-3">
              {topWeapons.map((w) => (
                <li key={w.rank} className="flex items-center gap-3">
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-md font-display text-xs font-extrabold", w.rank === 1 ? "bg-accent text-white" : w.rank === 2 ? "bg-neon-purple text-white" : w.rank === 3 ? "bg-neon-orange text-white" : "bg-muted text-muted-foreground")}>
                    {w.rank}
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold">{w.name}</p>
                    <p className="text-[11px] text-muted-foreground">{w.klass}</p>
                  </div>
                  <span className="font-display text-[13px] font-extrabold">{w.score}</span>
                </li>
              ))}
            </ul>
          </div>
          <PremiumCard />
          <div className="card-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-wider">Recently Added</h2>
              <a href="/database/weapons" className="text-xs font-semibold text-accent">View All</a>
            </div>
            <ul className="mt-4 space-y-3">
              {["Tactical SMG|SMG", "Bullpup Rifle|Assault Rifle", "Compact Pistol|Pistol", "Machete|Melee", "Homing Launcher|Launcher"].map((row, i) => {
                const [name, klass] = row.split("|");
                return (
                  <li key={name} className="flex items-center gap-3">
                    <Badge variant={i < 3 ? "green" : "gray"}>{i < 3 ? "New" : i === 3 ? "1d ago" : "2d ago"}</Badge>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold">{name}</p>
                      <p className="text-[11px] text-muted-foreground">{klass}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

