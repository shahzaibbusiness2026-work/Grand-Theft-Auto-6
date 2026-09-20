"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Car,
  Bike,
  Ship,
  Plane,
  Wind,
  Boxes,
  Heart,
  Bookmark,
  Gauge,
  Timer,
  Cog,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  Trophy,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { dbVehicles, topVehicles } from "@/lib/data";
import { cn } from "@/lib/utils";

const types = [
  { label: "All Vehicles", count: 312, icon: Car },
  { label: "Cars", count: 178, icon: Car },
  { label: "Motorcycles", count: 43, icon: Bike },
  { label: "Boats", count: 28, icon: Ship },
  { label: "Planes", count: 22, icon: Plane },
  { label: "Helicopters", count: 14, icon: Wind },
  { label: "Trucks", count: 18, icon: Car },
  { label: "SUVs", count: 34, icon: Car },
  { label: "Vans", count: 15, icon: Car },
  { label: "Other", count: 41, icon: Boxes },
];

const heroStats = [
  { label: "Total Vehicles", value: "312", icon: Car, color: "text-neon-purple" },
  { label: "Cars", value: "178", icon: Car, color: "text-neon-orange" },
  { label: "Bikes", value: "43", icon: Bike, color: "text-neon-green" },
  { label: "Boats", value: "28", icon: Ship, color: "text-neon-blue" },
  { label: "Planes", value: "22", icon: Plane, color: "text-sky-400" },
  { label: "Other", value: "41", icon: Boxes, color: "text-neon-yellow" },
];

const statIcons = [
  { icon: Gauge, label: "Top Speed" },
  { icon: Timer, label: "Acceleration" },
  { icon: Cog, label: "Handling" },
  { icon: ShieldCheck, label: "Braking" },
];

export default function VehicleDatabasePage() {
  const [type, setType] = useState("All Vehicles");
  const [price, setPrice] = useState<number[]>([0, 4000000]);

  return (
    <AppShell>
      {/* HERO */}
      <section className="w-full px-4 pt-8 sm:px-6 md:px-8 lg:px-10">
        <div className="card-surface relative overflow-hidden bg-gradient-to-br from-card via-card/85 to-primary/5">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide">Vehicle Database</h1>
              <p className="mt-2 text-sm text-muted-foreground">Browse all confirmed and discovered vehicles in GTA 6.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {heroStats.map((s) => (
                <div key={s.label} className="card-surface flex flex-col items-center gap-1 px-3 py-3">
                  <s.icon className={cn("h-4 w-4", s.color)} />
                  <span className="font-display text-lg font-extrabold">{s.value}</span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground">/ {s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid w-full gap-6 px-4 py-8 sm:px-6 md:px-8 lg:px-10 lg:grid-cols-[260px_1fr]">
        {/* FILTER SIDEBAR */}
        <aside className="card-surface h-fit p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wider">Filter Vehicles</h2>
            <button className="text-xs font-semibold text-accent">Clear All</button>
          </div>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search vehicles..." className="pl-9" />
          </div>

          <h3 className="section-eyebrow mt-6 text-muted-foreground">Vehicle Type</h3>
          <nav className="mt-3 space-y-1">
            {types.map((t) => (
              <button
                key={t.label}
                onClick={() => setType(t.label)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] font-semibold text-muted-foreground hover:text-white",
                  type === t.label && "border border-accent/50 bg-accent/10 text-white"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <t.icon className="h-3.5 w-3.5 text-accent" /> {t.label}
                </span>
                <span className="text-[11px]">{t.count}</span>
              </button>
            ))}
          </nav>

          <h3 className="section-eyebrow mt-6 text-muted-foreground">Manufacturer</h3>
          <Select className="mt-3" options={[{ value: "all", label: "All Manufacturers" }, { value: "grotti", label: "Grotti" }, { value: "declasse", label: "Declasse" }]} />

          <h3 className="section-eyebrow mt-6 text-muted-foreground">Price Range</h3>
          <div className="mt-3 space-y-3">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>${(price[0] / 1_000_000).toFixed(1)}M</span>
              <span>${(price[1] / 1_000_000).toFixed(1)}M+</span>
            </div>
            <input
              type="range" min={0} max={4000000} step={50000}
              value={price[0]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice([Number(e.target.value), price[1]])}
              className="w-full accent-[#f0459c]"
              aria-label="Minimum price"
            />
            <input
              type="range" min={0} max={4000000} step={50000}
              value={price[1]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice([price[0], Number(e.target.value)])}
              className="w-full accent-[#f0459c]"
              aria-label="Maximum price"
            />
          </div>

          <h3 className="section-eyebrow mt-6 text-muted-foreground">Drive Type</h3>
          <div className="mt-3 space-y-2">
            {["All Wheel Drive (AWD)", "Rear Wheel Drive (RWD)", "Front Wheel Drive (FWD)", "Four Wheel Drive (4WD)"].map((d) => (
              <label key={d} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-input accent-[#f0459c]" />
                {d}
              </label>
            ))}
          </div>

          <h3 className="section-eyebrow mt-6 text-muted-foreground">Sort By</h3>
          <Select className="mt-3" options={[{ value: "release", label: "Release Date" }, { value: "speed", label: "Top Speed" }, { value: "price", label: "Price" }]} />

          <Button variant="outline" className="mt-6 w-full">
            Reset Filters
          </Button>
        </aside>

        {/* MAIN */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-4 text-[13px] font-semibold">
              <button className="border-b-2 border-accent pb-2 text-white">All Vehicles <span className="text-muted-foreground">312</span></button>
              <button className="pb-2 text-muted-foreground">Owned / Saved <span>0</span></button>
              <button className="pb-2 text-muted-foreground">Recently Viewed <span>6</span></button>
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

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dbVehicles.map((v, i) => (
              <article key={v.name} className="group card-surface overflow-hidden">
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={v.img}
                    alt={`${v.name} - GTA 6 Vehicle`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {i === 0 && <Badge className="absolute left-2 top-2 border-primary/50 bg-primary/20 text-primary backdrop-blur">Featured</Badge>}
                  <span className="absolute right-2 top-2 flex gap-1.5 text-white">
                    <Bookmark className="h-3.5 w-3.5" />
                    <Heart className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-bold">{v.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{v.klass}</p>
                  <p className="mt-2 font-display text-sm font-extrabold text-accent">{v.price}</p>
                  <div className="mt-3 grid grid-cols-4 gap-1 border-t border-border pt-3 text-center">
                    {v.stats.map((s, j) => (
                      <div key={j}>
                        {(() => {
                          const S = statIcons[j].icon;
                          return <S className={cn("mx-auto h-3.5 w-3.5", s > 80 ? "text-neon-orange" : "text-muted-foreground")} />;
                        })()}
                        <p className="mt-1 text-[11px] font-bold">{s}</p>
                        <p className="text-[8px] uppercase tracking-wide text-muted-foreground">{statIcons[j].label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {["1", "2", "3", "â€¦", "13"].map((p) => (
                <button key={p} className={cn("h-8 w-8 rounded-lg text-[13px] font-bold", p === "1" ? "bg-gradient-to-r from-primary to-accent text-white" : "bg-card text-muted-foreground hover:text-white")}>
                  {p}
                </button>
              ))}
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Showing 1 to 12 of 312 vehicles</p>
          </div>

          {/* TOP VEHICLES */}
          <div className="card-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-wider">
                <Trophy className="h-4 w-4 text-accent" /> Top Vehicles
              </h2>
              <div className="flex gap-3 text-xs font-semibold text-muted-foreground">
                {["Top Speed", "Best Handling", "Most Expensive", "Most Popular"].map((t, i) => (
                  <button key={t} className={cn(i === 0 && "text-white")}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-1">
              {topVehicles.map((v) => (
                <a key={v.rank} href="/vehicles/visione" className="card-surface w-48 shrink-0 overflow-hidden">
                  <div className="relative h-24">
                    <Image
                      src={v.img}
                      alt={`${v.name} - GTA 6 Vehicle`}
                      fill
                      sizes="192px"
                      className="object-cover"
                    />
                    <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-xs font-extrabold text-white">
                      {v.rank}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-[13px] font-bold">{v.name}</h3>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Top Speed</p>
                    <p className="mt-0.5 font-display text-sm font-extrabold text-accent">{v.stat}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

