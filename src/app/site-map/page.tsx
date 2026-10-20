import Link from "next/link";
import { ChevronRight, Map as MapIcon } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { ALL_TOOLS } from "@/lib/tools-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap — Every Page on Tahzaib Gaming",
  description:
    "Complete sitemap of Tahzaib Gaming: all 26 interactive tools, vehicle and weapon databases, character guides, the Leonida map, news, and guides.",
  alternates: { canonical: "/site-map" },
};

interface SitemapSection {
  title: string;
  links: { label: string; href: string; desc?: string }[];
}

const CATEGORIES = [
  "Maps & Exploration",
  "Databases & Compare",
  "Financial & Business",
  "Combat & Loadouts",
  "AI & Assistance",
] as const;

export default function SiteMapPage() {
  const sections: SitemapSection[] = [
    {
      title: "Databases",
      links: [
        { label: "Vehicle Database", href: "/vehicles", desc: "Every confirmed ride in Leonida" },
        { label: "Vehicle Comparison Duel", href: "/compare/vehicles", desc: "Head-to-head stat battles" },
        { label: "Vehicle Rankings", href: "/rankings", desc: "Fastest, best overall & more" },
        { label: "Weapon Database & Armory", href: "/weapons", desc: "DPS, recoil, attachments" },
        { label: "Weapon Comparison Duel", href: "/compare/weapons", desc: "Side-by-side firepower" },
        { label: "Characters", href: "/characters", desc: "Lucia, Jason & the Leonida cast" },
        { label: "Missions", href: "/missions", desc: "Walkthroughs & rewards" },
        { label: "Properties & Real Estate", href: "/properties", desc: "Safehouses & businesses" },
        { label: "Locations & POIs", href: "/locations", desc: "Landmarks across Leonida" },
        { label: "Collectibles", href: "/collectibles", desc: "Hidden packages & caches" },
      ],
    },
    {
      title: "Map & Exploration",
      links: [
        { label: "Interactive Satellite Map", href: "/map", desc: "Full Leonida atlas" },
        { label: "Map Explorer", href: "/map-explorer", desc: "Alternate map view" },
        { label: "100% Completion Tracker", href: "/tracker", desc: "Checklist & progress" },
      ],
    },
    {
      title: "News & Content",
      links: [
        { label: "News", href: "/news", desc: "Latest GTA 6 coverage" },
        { label: "Blog", href: "/blog", desc: "Features & opinion" },
        { label: "Guides", href: "/guides", desc: "How-tos & walkthroughs" },
        { label: "Radio Stations", href: "/radio", desc: "Leonida airwaves" },
        { label: "Cheats & Codes", href: "/cheats", desc: "Codes & secrets" },
      ],
    },
    {
      title: "Account & More",
      links: [
        { label: "Dashboard", href: "/dashboard", desc: "Your Atlas HQ" },
        { label: "Vice City Pro", href: "/pricing", desc: "Membership plans" },
        { label: "About Atlas", href: "/about", desc: "Who we are" },
        { label: "Contact Us", href: "/contact", desc: "Get in touch" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="font-bold text-foreground">Sitemap</span>
        </nav>

        {/* Header */}
        <div className="mb-8 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary">
            <MapIcon className="h-3 w-3" aria-hidden="true" /> Site Index
          </div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
            Site<span className="text-primary">map</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Every page on Tahzaib Gaming, organized by section. Looking for the machine-readable
            version? See our <Link href="/sitemap.xml" className="font-semibold text-primary hover:underline">XML sitemap</Link>.
          </p>
        </div>

        {/* Main sections */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <nav key={section.title} aria-label={section.title} className="card-surface p-5">
              <h2 className="font-display text-base font-extrabold uppercase tracking-wide text-foreground">
                {section.title}
              </h2>
              <ul className="mt-3 space-y-1">
                {section.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="group flex items-baseline justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
                    >
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                        {l.label}
                      </span>
                      {l.desc && (
                        <span className="truncate text-xs text-muted-foreground">{l.desc}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Tools — all 26, grouped by category */}
          <div className="card-surface p-5 md:col-span-2 xl:col-span-3">
            <h2 className="font-display text-base font-extrabold uppercase tracking-wide text-foreground">
              All {ALL_TOOLS.length} Interactive Tools
            </h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {CATEGORIES.map((cat) => {
                const catTools = ALL_TOOLS.filter((t) => t.category === cat);
                if (catTools.length === 0) return null;
                return (
                  <div key={cat}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary">
                      {cat}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {catTools.map((t) => (
                        <li key={t.id}>
                          <Link
                            href={t.href}
                            className="block rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {t.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
