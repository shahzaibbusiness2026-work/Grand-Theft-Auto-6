// Server Component — no "use client" needed here.
// ISR: cache this public content page for 1 hour. Content changes
// infrequently via the CMS; per-request SSR was causing multi-second loads.
export const revalidate = 3600;

// Only <Countdown> (child) is client-rendered.

import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { Clock, Mail } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { HeroSection } from "@/components/hero/HeroSection";
import { FloatingStats } from "@/components/hero/FloatingStats";
import { DeferredHome } from "@/components/deferred-home";
import { MobileHomepage } from "@/components/mobile-homepage";
import { HOME_TRAILERS as TRAILERS } from "@/lib/home-content";
import { YouTubeLite } from "@/components/youtube-lite";
import { NewsletterForm } from "@/components/newsletter-form";

import {
  getPublicArticles,
  getPublicCharacters,
  getDashboardStats,
} from "@/lib/services/queries";
import { roleColor } from "@/lib/data";

import { cn, toIsoDate } from "@/lib/utils";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/services/settings";

/**
 * Homepage metadata comes from the CMS (site settings) so the owner controls
 * it from the admin dashboard; bundled defaults apply when the DB is down.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title =
    settings.siteTitle || "Taish Gaming — Your Ultimate GTA 6 Companion";
  const description =
    settings.siteDescription ||
    "Explore the world of GTA 6 with the most complete fan database. Interactive maps, missions, vehicles, characters, weapons and more for Grand Theft Auto 6.";
  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { type: "website",
      title,
      description,
      url: "/",
      images: [{ url: "/img/hero-vice-skyline-hd.jpg", alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/img/hero-vice-skyline-hd.jpg"],
    },
  };
}

/**
 * "Popular on Taish Gaming" — Design 2 (image cards).
 * Every card image is distinct within the section AND is not used
 * anywhere else on the homepage (hero, map preview, characters,
 * protagonist showcase, news/articles, newsletter), so no image
 * appears twice on the page. All are real Rockstar trailer frames
 * or official art — no AI illustrations, no fan-made maps.
 * Replacements vs the first draft: map card uses the Leonida
 * wetlands sunset (satellite-map-hd.jpg is already the map
 * section's image); map-size card uses the Vice City beach
 * (gta6-hero-official.webp was near-identical to the key art and
 * is already two articles' cover); money card uses the nightclub
 * (cache-chest.jpg is a 140x76 thumbnail); gameplay card uses
 * Lucia boxing (trailer-keys-marina.webp was flagged AI in the
 * 14 Nov cover audit, so it is not used).
 */
const POPULAR_PAGES = [
  {
    href: "/map",
    title: "Explore the GTA 6 interactive fan map",
    desc: "Leonida regions, cities and locations, with fan-map pins.",
    img: "/img/world-evidence/gta-6-leonida-wetlands-sunset-trailer-1.webp",
    tag: "Map",
  },
  {
    href: "/tools/download-time-calculator",
    title: "Estimate GTA 6 download time",
    desc: "How long the up-to-212 GB pre-load takes at your speed.",
    img: "/img/gta6-hero-clean-hd.jpg",
    tag: "Tool",
  },
  {
    href: "/news/map-size-comparison-gtav-rdr2",
    title: "GTA 6 map size compared",
    desc: "Why there is no official km² number yet.",
    img: "/img/world-evidence/gta-6-vice-city-beach-sunny-weather-trailer-1.webp",
    tag: "News",
  },
  {
    href: "/tools/day-night-converter",
    title: "GTA time to real time converter",
    desc: "Convert game time to real time and back.",
    img: "/img/hero-dark.jpg",
    tag: "Tool",
  },
  {
    href: "/controls",
    title: "GTA 6 controls",
    desc: "Provisional PS5 and Xbox controller layout.",
    img: "/img/hero-artwork-right.jpg",
    tag: "Guide",
  },
  {
    href: "/news/gta-6-gameplay-confirmed-features-mechanics",
    title: "GTA 6 gameplay mechanics",
    desc: "Shown versus unverified mechanics, separated.",
    img: "/img/world-evidence/gta-6-lucia-boxing-trailer-2.webp",
    tag: "News",
  },
  {
    href: "/tools/money-calculator",
    title: "GTA 6 money calculator",
    desc: "Plan fictional earnings with custom inputs.",
    img: "/img/world-evidence/gta-6-nightclub-dj-dancefloor-trailer-1.webp",
    tag: "Tool",
  },
  {
    href: "/weapons",
    title: "GTA 6 weapons",
    desc: "The full weapon database.",
    img: "/img/weapons-phil-ammu-nation.jpg",
    tag: "Database",
  },
  {
    href: "/news",
    title: "Latest GTA 6 news",
    desc: "Official updates and announcements.",
    img: "/img/heli.jpg",
    tag: "News",
  },
];

export default async function HomePage() {
  const [allArticles, allCharacters, settings, stats] = await Promise.all([
    getPublicArticles(),
    getPublicCharacters(),
    getSiteSettings(),
    getDashboardStats(),
  ]);

  const newsPosts = allArticles.slice(0, 3);
  const blogPosts = allArticles.slice(3, 6);

  // Admin → Settings → Homepage Sections controls which blocks render.
  const sectionToggles = settings.homepageSectionToggles ?? [];
  const showSection = (id: string) => sectionToggles.includes(id);

  return (
    <SiteShell>
      {showSection("hero") && (
        <>
          {/* 1 — CINEMATIC AAA HERO SECTION */}
          <HeroSection settings={settings} />
        </>
      )}

      {!showSection("hero") && (
        <div className="container-site pt-8">
          <h1 className="font-display text-2xl font-black leading-tight text-foreground sm:text-4xl">
            {settings.heroHeading?.trim() || "Grand Theft Auto VI"}
          </h1>
        </div>
      )}

      <MobileHomepage
        articles={allArticles.map((a) => ({
          slug: a.slug,
          title: a.title,
          img: a.img,
          date: a.date,
          category: a.category,
          excerpt: a.excerpt,
        }))}
        characters={allCharacters}
        sections={sectionToggles}
      />
      <div className="hidden sm:block" data-desktop-home>
        {/* QUICK STATS ATLAS STRIP */}
        <section className="container-site pt-1 sm:pt-2">
          <FloatingStats stats={stats} />
        </section>

        {showSection("trailers") && (
          <>
            {/* 2 — LATEST TRAILERS */}
            <section
              aria-labelledby="trailers-heading"
              className="container-site pt-6 sm:pt-8"
            >
              <SectionHeader
                id="trailers-heading"
                title="Latest Trailers"
                subtitle="Watch the official reveals"
                viewAllHref="/news"
                viewAllLabel="View All Trailers"
              />
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {TRAILERS.map((t) => (
                  <figure
                    key={t.id}
                    className="card-surface group overflow-hidden"
                  >
                    <YouTubeLite videoId={t.id} title={`GTA 6 ${t.title}`} />
                    <figcaption className="flex items-center gap-3 px-5 py-4">
                      <span
                        className="icon-tile h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-sm"
                        aria-hidden="true"
                      >
                        <svg
                          className="h-3.5 w-3.5 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                      <div>
                        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
                          {t.title}
                        </h3>
                        <p className="text-[13px] text-muted-foreground">
                          {t.caption}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          </>
        )}

        {showSection("map") && (
          <>
            {/* 3 — INTERACTIVE MAP */}
            <section
              aria-labelledby="map-heading"
              className="container-site pt-6"
            >
              <SectionHeader
                id="map-heading"
                title="Interactive World Map"
                subtitle="Explore points of interest across Vice City and Leonida"
                viewAllHref="/map"
                viewAllLabel="Open Fullscreen Map"
              />
              <DeferredHome kind="map" />
            </section>
          </>
        )}

        {showSection("characters") && (
          <>
            {/* 4 — CHARACTERS */}
            <section
              aria-labelledby="characters-heading"
              className="container-site pt-6"
            >
              <SectionHeader
                id="characters-heading"
                title="Characters"
                subtitle="Meet the people of Leonida"
                viewAllHref="/characters"
                viewAllLabel="View All Characters"
              />
              <div className="rail no-scrollbar flex gap-4 overflow-x-auto pb-3">
                {allCharacters.slice(0, 8).map((c) => (
                  <Link
                    key={c.id}
                    href={`/characters/${c.id}`}
                    className="group card-surface w-44 shrink-0 overflow-hidden sm:w-52 transition-transform duration-300 hover:-translate-y-1 hover:shadow-sm"
                  >
                    <div className="relative h-48 overflow-hidden sm:h-56">
                      <SafeImage
                        src={c.img}
                        alt={c.name}
                        fill
                        sizes="(max-width: 640px) 176px, 208px"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 dark-overlay-text">
                        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white drop-shadow">
                          {c.name}
                        </h3>
                        <p
                          className={cn(
                            "text-xs font-bold drop-shadow",
                            roleColor[c.role],
                          )}
                        >
                          {c.role}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 5 — PROTAGONIST SHOWCASE (LUCIA & JASON, CMS-DRIVEN) */}
            <DeferredHome kind="cast" characters={allCharacters} />
          </>
        )}

        {showSection("news") && (
          <>
            {/* 6 — NEWS & BLOG */}
            <section
              aria-labelledby="news-heading"
              className="container-site pt-6"
            >
              <SectionHeader
                id="news-heading"
                title="News & Articles"
                subtitle="Stay updated with the latest"
                viewAllHref="/news"
                viewAllLabel="View All News"
              />
              <div className="grid gap-6 lg:grid-cols-2">
                {/* News half */}
                <div className="card-surface p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-accent">
                      Latest News
                    </h3>
                    <Link
                      href="/news"
                      className="text-[13px] font-semibold text-accent hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {newsPosts.map((a) => (
                      <Link
                        key={a.slug || a.title}
                        href={a.slug ? `/news/${a.slug}` : "/news"}
                        className="group flex gap-4"
                      >
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                          <SafeImage
                            src={a.img}
                            alt={a.title}
                            fill
                            sizes="112px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0">
                          <Badge variant="solid" className="mb-1.5">
                            {a.tag}
                          </Badge>
                          <h4 className="line-clamp-2 font-display text-sm font-bold leading-snug group-hover:text-accent">
                            {a.title}
                          </h4>
                          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <time dateTime={toIsoDate(a.date)}>{a.date}</time>
                            <span className="text-border" aria-hidden="true">
                              •
                            </span>
                            <Clock className="h-3 w-3" aria-hidden="true" />{" "}
                            {a.read}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Blog half */}
                <div className="card-surface p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-primary">
                      More Articles
                    </h3>
                    <Link
                      href="/news"
                      className="text-[13px] font-semibold text-primary hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {blogPosts.map((a) => (
                      <Link
                        key={a.slug || a.title}
                        href={a.slug ? `/news/${a.slug}` : "/news"}
                        className="group flex gap-4"
                      >
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                          <SafeImage
                            src={a.img}
                            alt={a.title}
                            fill
                            sizes="112px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0">
                          <Badge className="mb-1.5">{a.tag}</Badge>
                          <h4 className="line-clamp-2 font-display text-sm font-bold leading-snug group-hover:text-primary">
                            {a.title}
                          </h4>
                          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <time dateTime={toIsoDate(a.date)}>{a.date}</time>
                            <span className="text-border" aria-hidden="true">
                              •
                            </span>
                            <Clock className="h-3 w-3" aria-hidden="true" />{" "}
                            {a.read}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {showSection("community") && (
          <>
            {/* 7 — NEWSLETTER */}
            <section
              aria-labelledby="newsletter-heading"
              className="container-site py-6"
            >
              <div className="card-surface relative overflow-hidden min-h-[340px]">
                <SafeImage
                  src="/img/hero-vice-skyline-hd.jpg"
                  alt="GTA 6 Vice City Skyline"
                  fill
                  sizes="100vw"
                  className="object-cover object-right opacity-90 dark:opacity-75 dark:brightness-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />
                <div className="relative px-6 py-9 sm:px-10">
                  <p className="section-eyebrow text-[#F3A398]">Newsletter</p>
                  <h2
                    id="newsletter-heading"
                    className="mt-3 max-w-md font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl text-white"
                  >
                    Never Miss <br /> an{" "}
                    <span className="text-[#F3A398] text-glow-amber">
                      Update
                    </span>
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
                    Subscribe to our newsletter and get the latest GTA 6 news,
                    articles, trailers and exclusive updates straight to your
                    inbox.
                  </p>
                  <NewsletterForm />
                  <div className="mt-6 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      {
                        title: "Latest News",
                        desc: "Get all official updates and announcements.",
                      },
                      {
                        title: "Exclusive Content",
                        desc: "Early access to articles, screenshots and more.",
                      },
                      {
                        title: "No Spam",
                        desc: "We respect your inbox. Unsubscribe anytime.",
                      },
                    ].map((p) => (
                      <div key={p.title} className="flex items-start gap-2.5">
                        <span
                          className="icon-tile h-8 w-8 shrink-0 border border-accent/40 bg-accent/10 text-accent"
                          aria-hidden="true"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-[13px] font-bold text-white">
                            {p.title}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-white/70">
                            {p.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
      <section className="container-site py-6 sm:py-8" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="font-display text-2xl font-bold">
          Popular on Taish Gaming
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          The pages readers open most: the map, the size comparison, the tools and the controls.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group card-surface block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-sm"
            >
              <div className="relative h-40 overflow-hidden">
                <SafeImage
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <Badge variant="solid" className="absolute left-2 top-2 z-10">
                  {p.tag}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-bold leading-snug group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
