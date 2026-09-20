"use client";

import { useState } from "react";
import {
  Search,
  Clock,
  Eye,
  Bookmark,
  ChevronRight,
  MapPin,
  List,
  Package,
  Car,
  Crosshair,
  DollarSign,
  Skull,
  Crown,
  ChevronDown,
} from "lucide-react";
import { AppShell, PremiumCard } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Donut } from "@/components/ui/donut";
import { guideCategories, featuredGuides, popularGuides } from "@/lib/data";
import { cn } from "@/lib/utils";

const quickLinks = [
  { label: "Map Explorer", icon: MapPin, href: "/map-explorer" },
  { label: "Mission List", icon: List, href: "/missions" },
  { label: "Collectible Tracker", icon: Package, href: "/collectibles" },
  { label: "Vehicle Database", icon: Car, href: "/database/vehicles" },
  { label: "Weapon Compare", icon: Crosshair, href: "/weapons/compare" },
  { label: "Money Calculator", icon: DollarSign, href: "/tools" },
];

const weekTop = [
  { title: "How to Get the Best Early Weapons", read: "9 min read", views: "14.2K", img: "/img/rifle.svg" },
  { title: "Hidden Packages Locations", read: "11 min read", views: "12.6K", img: "/img/treasure.svg" },
  { title: "Best Properties to Buy", read: "10 min read", views: "10.9K", img: "/img/hero-dark.jpg" },
  { title: "All Secret Vehicles & How to Unlock", read: "17 min read", views: "9.2K", img: "/img/car-purple.jpg" },
  { title: "Skill Progression Guide", read: "6 min read", views: "8.1K", img: "/img/char-jason.svg" },
];

export default function GuidesPage() {
  const [tab, setTab] = useState("Trending");
  const [cat, setCat] = useState("All Guides");

  return (
    <AppShell>
      <div className="grid w-full gap-6 px-4 py-8 sm:px-6 md:px-8 lg:px-10 lg:grid-cols-[240px_1fr_290px]">
        {/* LEFT SIDEBAR */}
        <aside className="space-y-6">
          <div className="card-surface p-4">
            <h2 className="px-2 font-display text-sm font-extrabold uppercase tracking-wider">Guide Categories</h2>
            <nav className="mt-4 space-y-1">
              {guideCategories.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setCat(c.label)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground",
                    cat === c.label && "border border-amber-500/50 bg-amber-500/10 text-amber-500 dark:text-amber-400 shadow-neon-amber"
                  )}
                >
                  {c.label}
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px]", cat === c.label ? "bg-amber-500 text-slate-950 font-bold" : "bg-muted")}>
                    {c.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
          <PremiumCard />
        </aside>

        {/* CENTER */}
        <div className="space-y-6">
          {/* Hub hero */}
          <div className="card-surface relative overflow-hidden bg-gradient-to-br from-card via-card/85 to-primary/5">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative p-6">
              <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide">Guides Hub</h1>
              <p className="mt-1 text-sm text-muted-foreground">Your ultimate library for mastering Vice City and beyond.</p>
              <div className="relative mt-5 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search guides..." className="pl-9" />
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className="card-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-wider">Featured Guides</h2>
              <a href="/guides" className="flex items-center gap-1 text-xs font-semibold text-accent">
                View All <ChevronRight className="h-3 w-3" />
              </a>
            </div>
            <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-1">
              {featuredGuides.map((g) => (
                <article key={g.title} className="group card-surface w-56 shrink-0 overflow-hidden">
                  <div className="relative h-28 overflow-hidden">
                    <img src={g.img} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {g.featured && <Badge variant="solid" className="absolute left-2 top-2">Featured</Badge>}
                  </div>
                  <div className="p-3.5">
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {g.read}
                    </p>
                    <h3 className="mt-1.5 font-display text-sm font-bold leading-snug">{g.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{g.desc}</p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {g.views}
                      </span>
                      <Bookmark className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Popular list */}
          <div className="card-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-wider">Popular Guides</h2>
              <div className="flex gap-2">
                {["Trending", "Most Viewed", "Recently Added"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                      tab === t ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-bold shadow-neon-amber" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {popularGuides.map((g) => (
                <li key={g.title} className="flex items-center gap-4 rounded-lg border border-border/60 p-3">
                  <img src={g.img} alt="" style={g.filter ? { filter: g.filter } : undefined} className="h-14 w-20 rounded-md object-cover" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold">{g.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="default" className="normal-case">{g.tag}</Badge>
                      <span>{g.desc}</span>
                    </div>
                  </div>
                  <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                    <Clock className="h-3 w-3" /> {g.read}
                  </span>
                  <span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
                    <Eye className="h-3 w-3" /> {g.views}
                  </span>
                  <Bookmark className="h-4 w-4 text-accent" />
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-center">
              <Button variant="ghost" size="sm">
                View More Guides <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          <div className="card-surface p-5">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wider">Quick Links</h2>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {quickLinks.map((q) => (
                <a key={q.label} href={q.href} className="card-surface flex flex-col items-center gap-2 px-2 py-4 text-center transition-colors hover:border-accent/60">
                  <q.icon className="h-4 w-4 text-accent" />
                  <span className="text-[9px] font-semibold leading-tight">{q.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="card-surface p-5">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wider">Guide Progress</h2>
            <div className="mt-4 flex items-center gap-5">
              <Donut value={42} size={92} label="42%" />
              <div>
                <p className="text-[13px] font-bold">60 / 142 Guides Read</p>
                <p className="mt-1 text-xs text-muted-foreground">Keep going, you're doing great!</p>
                <Button variant="outline" size="sm" className="mt-3 h-8">
                  View My Progress
                </Button>
              </div>
            </div>
          </div>

          <div className="card-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-wider">Popular This Week</h2>
              <a href="/guides" className="text-xs font-semibold text-accent">View All</a>
            </div>
            <ul className="mt-4 space-y-3">
              {weekTop.map((w, i) => (
                <li key={w.title} className="flex items-center gap-3">
                  <span className="w-4 text-center font-display text-[13px] font-extrabold text-accent">{i + 1}</span>
                  <img src={w.img} alt="" className="h-9 w-12 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="line-clamp-2 text-xs font-bold leading-snug">{w.title}</p>
                    <p className="text-[9px] text-muted-foreground">
                      {w.read} • {w.views}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface relative overflow-hidden border-accent/40 p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-amber-500/10" />
            <Skull className="absolute -right-3 -top-3 h-24 w-24 text-accent/20" />
            <div className="relative">
              <h3 className="flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-wider">
                <Crown className="h-4 w-4 text-accent" /> Exclusive Premium Guides
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                Access in-depth walkthroughs, secret locations, and pro tips.
              </p>
              <Button variant="solid" size="sm" className="mt-4 w-full">
                See Premium Guides
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
