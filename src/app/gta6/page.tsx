import Link from "next/link";
import { SiteShell } from "@/components/shells";
import { Countdown } from "@/components/hero/Countdown";
import { SafeImage } from "@/components/safe-image";
import { Badge } from "@/components/ui/badge";
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

// No-duplicate rule (owner, 2026-11-15): every card below has its own image,
// and none of the 9 images appears anywhere on the homepage. The 9
// destinations also do not repeat the homepage "Popular on Taish Gaming"
// cards (/map, download-time, map-size, day-night, /controls, gameplay,
// /money-guide, /weapons, /news) — this hub links to different pages.
// NOTE: gta-6-store-signs-brands-trailer-1.webp and
// gta-6-handgun-robbery-scene-trailer-1.webp are the SAME file (identical
// md5) — never use both. The robbery file is used once, for Compare weapons.
const HUB_LINKS = [
  {
    href: "/news/gta-6-preload-ps5-xbox-how-to",
    title: "GTA 6 pre-load guide",
    desc: "Pre-loading opened November 10. How to get the up-to-212 GB download ready.",
    img: "/img/world-evidence/gta-6-vice-city-buildings-palms-trailer-1.webp",
    tag: "Pre-load",
  },
  {
    href: "/news/gta-6-file-size-210-gb-ps5-storage-guide",
    title: "GTA 6 file size & storage",
    desc: "Up to 212 GB. Check whether it fits your PS5 or Xbox before November 19.",
    img: "/img/world-evidence/gta-6-living-room-tv-details-trailer-2.webp",
    tag: "212 GB",
  },
  {
    href: "/news/gta-6-release-date-pre-order-editions",
    title: "GTA 6 editions & release date",
    desc: "Standard $79.99 vs Ultimate $99.99, and what each edition includes.",
    img: "/img/world-evidence/gta-6-jason-lucia-bar-drinks-trailer-2.webp",
    tag: "Editions",
  },
  {
    href: "/vehicles",
    title: "GTA 6 vehicles",
    desc: "110 catalogued vehicles. Stats stay blank until verified in-game at launch.",
    img: "/img/world-evidence/gta-6-highway-vehicle-scene-trailer-2.webp",
    tag: "110 vehicles",
  },
  {
    href: "/characters",
    title: "GTA 6 characters",
    desc: "Lucia, Jason and the Leonida cast Rockstar has shown so far.",
    img: "/img/world-evidence/gta-6-characters-table-trailer-2.webp",
    tag: "Characters",
  },
  {
    href: "/gta-6-world",
    title: "Leonida world",
    desc: "Regions, wildlife, weather, brands and life across the state of Leonida.",
    img: "/img/world-evidence/gta-6-flamingos-wetland-birds-trailer-1.webp",
    tag: "World",
  },
  {
    href: "/radio",
    title: "GTA 6 radio stations",
    desc: "The six stations Rockstar confirmed, plus GTA VI: The Album.",
    img: "/img/world-evidence/gta-6-music-dj-nightclub-trailer-1.webp",
    tag: "Radio",
  },
  {
    href: "/compare/vehicles",
    title: "Compare vehicles",
    desc: "Pick two vehicles and compare them side by side.",
    img: "/img/world-evidence/gta-6-social-media-car-clip-trailer-1.webp",
    tag: "Compare",
  },
  {
    href: "/compare/weapons",
    title: "Compare weapons",
    desc: "Pick two weapons and compare them side by side.",
    img: "/img/world-evidence/gta-6-handgun-robbery-scene-trailer-1.webp",
    tag: "Compare",
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
              className="group card-surface block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-sm"
            >
              <div className="relative h-40 overflow-hidden">
                <SafeImage
                  src={l.img}
                  alt={l.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <Badge variant="solid" className="absolute left-2 top-2 z-10">
                  {l.tag}
                </Badge>
              </div>
              <div className="p-4">
                <h2 className="font-display text-sm font-bold leading-snug group-hover:text-primary">
                  {l.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                  {l.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-white/10 bg-black/20 p-5 sm:p-6">
          <h2 className="font-bold text-xl mb-3">Launch week timeline</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-foreground/75">
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-primary">Nov 10</span>
              <span>
                Pre-loading opened — PS5 at local midnight, Xbox at 12 a.m.
                GMT (5 a.m. PKT). Download up to 212 GB.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-primary">Nov 12</span>
              <span>
                Code-in-box retail copies on sale; codes redeemable. No disc
                in the box.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-primary">Nov 19</span>
              <span>
                Launch — midnight local time on PS5 and Xbox Series X|S.
                GTA VI: The Album (34 tracks) releases the same day.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-bold text-primary">Nov 19</span>
              <span>
                YouTube 24-hour launch livestream starts 12 a.m. ET on
                youtube.com/youtube, with an RDCWorld pre-show at 11 p.m. ET
                on Nov 18.
              </span>
            </li>
          </ul>
        </section>

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
