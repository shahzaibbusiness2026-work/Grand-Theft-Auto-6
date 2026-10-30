"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  Bookmark,
  ChevronRight,
  MapPin,
  List,
  Package,
  Car,
  Crosshair,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { PremiumCard } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { GuideRecord } from "@/lib/services/guides";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/safe-image";

interface GuideCard {
  title: string;
  desc: string;
  read: string;
  img: string;
  href: string;
  slug?: string;
  category?: string;
  featured?: boolean;
  tag?: string;
  filter?: string;
}

function toCard(g: GuideRecord): GuideCard {
  return {
    title: g.title,
    desc: g.description || "",
    read: g.read_time || "",
    img: g.image || "/img/hero-dark.jpg",
    href: `/guides/${g.slug}`,
    slug: g.slug,
    category: g.category,
    featured: g.featured,
    tag: g.tag || g.category,
  };
}

// Link to maintained pages; do not invent guide records to fill the catalogue.
const resources: GuideCard[] = [
  { title: "GTA 6 map size: evidence and unknowns", desc: "What can and cannot be established about playable area and comparisons with GTA V.", href: "/news/map-size-comparison-gtav-rdr2", category: "Locations", read: "", img: "/img/hero-dark.jpg" },
  { title: "GTA 6 release date, preload and editions", desc: "The scheduled console release, official preload information and what to check before buying.", href: "/news/gta-6-release-date-pre-order-editions", category: "Getting Started", read: "", img: "/img/hero-dark.jpg" },
  { title: "Leonida's six named destinations", desc: "Source-linked destination profiles, with confirmed place names separated from fan-map positions.", href: "/regions", category: "Locations", read: "", img: "/img/hero-dark.jpg" },
  { title: "GTA 6 character backgrounds and relationships", desc: "Meet Jason, Lucia and the supporting cast through Rockstar's published character backgrounds.", href: "/characters", category: "Characters", read: "", img: "/img/hero-dark.jpg" },
  { title: "GTA 6 money: what remains unverified", desc: "Check the evidence before relying on payout rankings, business income or pre-release money methods.", href: "/money-guide", category: "Money & Economy", read: "", img: "/img/hero-dark.jpg" },
];

const quickLinks = [
  { label: "Map Explorer", icon: MapPin, href: "/map-explorer" },
  { label: "Mission List", icon: List, href: "/missions" },
  { label: "Collectible Tracker", icon: Package, href: "/collectibles" },
  { label: "Vehicle Database", icon: Car, href: "/vehicles" },
  { label: "Weapon Compare", icon: Crosshair, href: "/compare/weapons" },
  { label: "Money Calculator", icon: DollarSign, href: "/tools/money-calculator" },
];

export function GuidesClient({ guides }: { guides?: GuideRecord[] }) {
  const [cat, setCat] = useState("All Guides");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  const cards = [...(guides || []).filter((g) => g.slug).map(toCard), ...resources];

  const liveCategories = (() => {
    const counts = new Map<string, number>();
    for (const g of cards) {
      const category = g.category || "Getting Started";
      counts.set(category, (counts.get(category) || 0) + 1);
    }
    const total = cards.length;
    return [
      { label: "All Guides", count: total },
      ...Array.from(counts.entries()).map(([label, count]) => ({ label, count })),
    ];
  })();

  const matchesFilter = (g: GuideCard) =>
    (cat === "All Guides" || g.category === cat) &&
    (search.trim() === "" ||
      `${g.title} ${g.desc}`.toLowerCase().includes(search.trim().toLowerCase()));

  const featuredCards = cards.filter((g) => g.featured).filter(matchesFilter);
  const allFiltered = cards.filter(matchesFilter);

  // Editor's picks = featured guides, in catalogue order.
  const weekTop = [...featuredCards, ...cards.filter((g) => !g.featured).filter(matchesFilter)].slice(0, 5);

  return (
    <div className="grid w-full gap-6 px-4 py-8 sm:px-6 md:px-8 lg:px-10 lg:grid-cols-[240px_1fr_290px]">
      {/* LEFT SIDEBAR */}
      <aside className="hidden space-y-6 lg:block">
        <div className="card-surface p-4">
          <h2 className="px-2 font-display text-xl font-extrabold uppercase tracking-wider text-foreground">Guide Categories</h2>
          <nav aria-label="Guide categories" className="mt-4 space-y-1">
            {liveCategories.map((c) => (
              <button
                key={c.label}
                onClick={() => setCat(c.label)}
                aria-pressed={cat === c.label}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-3 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground",
                  cat === c.label && "border border-[#FF2E9A]/50 bg-[#FF2E9A]/10 text-[#FF2E9A] shadow-sm"
                )}
              >
                {c.label}
                <span className={cn("rounded-full px-2 py-0.5 text-xs", cat === c.label ? "bg-gold text-slate-950 font-bold" : "bg-muted")}>
                  {c.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
        <PremiumCard />
      </aside>

      {/* CENTER */}
      <div className="min-w-0 space-y-6">
        {/* Hub hero */}
        <div className="card-surface relative overflow-hidden bg-gradient-to-br from-card via-card/85 to-primary/5">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative p-6">
            <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">GTA 6 Guides</h1>
            <p className="mt-1 text-sm text-muted-foreground">Start with Leonida&apos;s destinations, character backgrounds or release planning. These pre-release guides distinguish official information from unverified gameplay claims and fan-map estimates.</p>
            <div className="relative mt-5 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input aria-label="Search guides" placeholder="Search guides..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select aria-label="Filter guides by category" value={cat} onChange={(event) => setCat(event.target.value)} className="mt-3 min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground lg:hidden">
              {liveCategories.map((category) => <option key={category.label} value={category.label}>{category.label} ({category.count})</option>)}
            </select>
          </div>
        </div>

        {/* Featured */}
        {featuredCards.length > 0 && <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold uppercase tracking-wider text-foreground">Featured Guides</h2>
            <a href="#browse-guides" className="flex items-center gap-1 text-xs font-semibold text-accent px-2 py-2">
              View All <ChevronRight className="h-3 w-3" />
            </a>
          </div>
          <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-1">
            {featuredCards.map((g) => (
              <Link key={g.href} href={g.href} className="group card-surface w-56 shrink-0 overflow-hidden">
                <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[#0c1222] to-[#1a2340]">
                  {g.img ? (
                    <SafeImage loading="lazy" src={g.img} alt={g.title} width={224} height={112} sizes="224px" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : null}
                  {g.featured && <Badge variant="solid" className="absolute left-2 top-2">Featured</Badge>}
                </div>
                <div className="p-3.5">
                  {g.read ? (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {g.read}
                    </p>
                  ) : null}
                  <h3 className="mt-1.5 font-display text-sm font-bold leading-snug">{g.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{g.desc}</p>
                  <div className="mt-2.5 flex justify-end text-xs text-muted-foreground">
                    <Bookmark className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>}

        {/* Popular list */}
        <div id="browse-guides" className="card-surface scroll-mt-24 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold uppercase tracking-wider text-foreground">Browse Guides</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {(expanded ? allFiltered : allFiltered.slice(0, 6)).map((g) => (
              <li key={g.title} className="flex items-center gap-4 rounded-lg border border-border/60 p-3">
                <Link href={g.href} className="flex min-w-0 flex-1 items-center gap-4">
                <SafeImage loading="lazy" src={g.img} alt={g.title} width={80} height={56} sizes="80px" style={g.filter ? { filter: g.filter } : undefined} className="h-14 w-20 shrink-0 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold">{g.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="default" className="normal-case">{g.tag || g.category}</Badge>
                    <span>{g.desc}</span>
                  </div>
                </div>
                </Link>
                {g.read ? (
                  <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                    <Clock className="h-3 w-3" /> {g.read}
                  </span>
                ) : null}
                <Bookmark className="h-4 w-4 text-accent" />
              </li>
            ))}
          </ul>
          {allFiltered.length === 0 && <p role="status" className="mt-5 text-sm text-muted-foreground">No guides match these filters. Try another category or search.</p>}
          {allFiltered.length > 6 && (
            <div className="mt-6 flex justify-center">
              <Button variant="ghost" size="default" className="min-h-[44px]" onClick={() => setExpanded((v) => !v)}>
                {expanded ? "Show Fewer Guides" : "View More Guides"} <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
              </Button>
            </div>
          )}
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
                <span className="text-xs font-semibold leading-tight">{q.label}</span>
              </a>
            ))}
          </div>
        </div>

        {weekTop.length > 0 && <div className="card-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wider">Editor&apos;s Picks</h2>
            <a href="#browse-guides" className="text-xs font-semibold text-accent px-2 py-2">View All</a>
          </div>
          <ul className="mt-4 space-y-3">
            {weekTop.map((w, i) => (
              <li key={w.title} className="flex items-center gap-3">
                <span className="w-4 text-center font-display text-[13px] font-extrabold text-accent">{i + 1}</span>
                {w.img ? (
                  <SafeImage loading="lazy" src={w.img} alt={w.title} width={48} height={36} sizes="48px" className="h-9 w-12 shrink-0 rounded-md object-cover" />
                ) : null}
                <div className="flex-1">
                  <Link href={w.href} className="line-clamp-2 text-xs font-bold leading-snug hover:text-accent">{w.title}</Link>
                  {w.read ? (
                    <p className="text-xs text-muted-foreground">
                      {w.read}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>}

      </aside>
    </div>
  );
}
