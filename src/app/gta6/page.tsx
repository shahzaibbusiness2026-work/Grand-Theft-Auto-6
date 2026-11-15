import Link from "next/link";
import { SiteShell } from "@/components/shells";
import { Countdown } from "@/components/hero/Countdown";
import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/page-metadata";
import { serializeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  openGraph: pageOpenGraph("/gta6"),
  title: "GTA 6 Ultimate Guide: Map, Release Countdown, Vehicles & Tools",
  description:
    "Grand Theft Auto VI launches November 19, 2026 at midnight local time. Map, pre-load, editions, controls, vehicles, weapons and calculators in one place.",
  alternates: { canonical: "/gta6" },
  robots: { index: true, follow: true },
};

const HUB_LINKS = [
  {
    href: "/map",
    title: "Interactive Map",
    desc: "Leonida regions, cities and locations, with fan-map pins.",
    tag: "Map",
  },
  {
    href: "/news/gta-6-preload-ps5-xbox-how-to",
    title: "Pre-load Guide",
    desc: "Pre-loading opened November 10. How to get the up-to-212 GB download ready.",
    tag: "Pre-load",
  },
  {
    href: "/news/gta-6-file-size-210-gb-ps5-storage-guide",
    title: "File Size & Storage",
    desc: "Up to 212 GB. Check whether it fits your PS5 or Xbox before November 19.",
    tag: "212 GB",
  },
  {
    href: "/news/gta-6-release-date-pre-order-editions",
    title: "Editions & Release Date",
    desc: "Standard $79.99 vs Ultimate $99.99, and what each edition includes.",
    tag: "Editions",
  },
  {
    href: "/controls",
    title: "Controls",
    desc: "Provisional PS5 and Xbox controller layout. Rockstar has not published the official one yet.",
    tag: "Controls",
  },
  {
    href: "/vehicles",
    title: "Vehicles",
    desc: "110 catalogued vehicles. Stats stay blank until verified in-game at launch.",
    tag: "110 vehicles",
  },
  {
    href: "/weapons",
    title: "Weapons",
    desc: "34 catalogued weapons, including the seven Rockstar-named guns.",
    tag: "34 weapons",
  },
  {
    href: "/tools",
    title: "Tools & Calculators",
    desc: "Download-time, money, DPS and day-night calculators for launch week.",
    tag: "Tools",
  },
  {
    href: "/news",
    title: "Latest GTA 6 News",
    desc: "Official updates and announcements, with sources cited.",
    tag: "News",
  },
];

export default function Gta6HubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Grand Theft Auto VI: Complete Leonida Guide & Interactive Database",
    url: "https://www.taishgaming.com/gta6",
    description:
      "Grand Theft Auto VI launches November 19, 2026 at midnight local time. Map, pre-load, editions, controls, vehicles, weapons and calculators in one place.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: HUB_LINKS.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.title,
        url: `https://www.taishgaming.com${l.href}`,
      })),
    },
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <div className="container-site py-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
            Grand Theft Auto VI
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">
            Complete Leonida Guide &amp; Interactive Database
          </h1>
          <p className="text-foreground/70 mt-3">
            GTA 6 launches at midnight local time on Thursday, November 19,
            2026, on PS5 and Xbox Series X|S. Pre-loading has been open since
            November 10. Everything below is grounded in what Rockstar has
            confirmed or what the trailers show — nothing here is invented.
          </p>
        </div>

        <div className="mt-8">
          <Countdown />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HUB_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group card-surface block overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-sm"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                {l.tag}
              </span>
              <h2 className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-primary">
                {l.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {l.desc}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Open →
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-white/10 bg-black/20 p-5 sm:p-6">
          <h2 className="font-bold text-xl mb-3">What is confirmed so far</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/75">
            <li>
              Launch: midnight local time, Thursday November 19, 2026, PS5
              and Xbox Series X|S. No PC date announced.
            </li>
            <li>
              Pre-load opened November 10, 2026. File size up to 212 GB.
              Code-in-box retail copies from November 12 (no disc).
            </li>
            <li>
              Editions: Standard $79.99, Ultimate $99.99. No early access.
            </li>
            <li>
              30 FPS target on all consoles (Rockstar, November 10). No
              60 FPS mode announced. No crossplay at launch — single-player
              only.
            </li>
            <li>
              Seven vehicles and seven weapons carry Rockstar-traceable
              names. Everything else in the database is labelled by
              evidence, not presented as confirmed.
            </li>
          </ul>
        </section>
      </div>
    </SiteShell>
  );
}
