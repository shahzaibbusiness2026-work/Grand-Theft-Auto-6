// Server Component — no "use client" needed here.
// Only <Countdown> (child) is client-rendered.

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  Mail,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { HeroSection } from "@/components/hero/HeroSection";
import { FloatingStats } from "@/components/hero/FloatingStats";
import { ProtagonistsShowcase } from "@/components/protagonists-showcase";
import { YouTubeLite } from "@/components/youtube-lite";
import { NewsletterForm } from "@/components/newsletter-form";
import { HomeSatelliteMap } from "@/components/home-satellite-map";
import { getPublicArticles } from "@/lib/services/articles";
import { getPublicCharacters } from "@/lib/services/characters";
import { roleColor } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Atlas — Your Ultimate GTA 6 Companion",
  description:
    "Explore the world of GTA 6 with the most complete fan database. Interactive maps, missions, vehicles, characters, weapons and more for Grand Theft Auto 6.",
  alternates: { canonical: "/" },
};

const TRAILERS = [
  { id: "QdBZY2fkU-0", title: "Official Trailer 1", caption: "Watch the official reveal trailer" },
  { id: "FKUW7_I4QwA", title: "Official Trailer 2", caption: "More gameplay, more Leonida" },
];

export default async function HomePage() {
  const [allArticles, allCharacters] = await Promise.all([
    getPublicArticles(),
    getPublicCharacters(),
  ]);

  const newsPosts = allArticles.slice(0, 3);
  const blogPosts = allArticles.slice(3, 6);

  return (
    <SiteShell>
      {/* 1 — CINEMATIC AAA HERO SECTION */}
      <HeroSection />

      {/* QUICK STATS ATLAS STRIP */}
      <section className="container-site pt-1 sm:pt-2">
        <FloatingStats />
      </section>

      {/* 2 — LATEST TRAILERS */}
      <section aria-labelledby="trailers-heading" className="container-site pt-12 sm:pt-14">
        <SectionHeader id="trailers-heading" title="Latest Trailers" subtitle="Watch the official reveals" viewAllHref="/news" viewAllLabel="View All Trailers" />
        <div className="grid gap-5 lg:grid-cols-2">
          {TRAILERS.map((t) => (
            <figure key={t.id} className="card-surface group overflow-hidden">
              <YouTubeLite videoId={t.id} title={`GTA 6 ${t.title}`} />
              <figcaption className="flex items-center gap-3 px-5 py-4">
                <span className="icon-tile h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-neon-cyan" aria-hidden="true">
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wide">{t.title}</h3>
                  <p className="text-[13px] text-muted-foreground">{t.caption}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 3 — INTERACTIVE MAP */}
      <section aria-labelledby="map-heading" className="container-site pt-14">
        <SectionHeader
          id="map-heading"
          title="Interactive World Map"
          subtitle="Explore confirmed points of interest across Vice City and Leonida"
          viewAllHref="/map"
          viewAllLabel="Open Fullscreen Map"
        />
        <HomeSatelliteMap />
      </section>

      {/* 4 — CHARACTERS */}
      <section aria-labelledby="characters-heading" className="container-site pt-14">
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
              href={`/characters#${c.id}`}
              className="group card-surface w-44 shrink-0 overflow-hidden sm:w-52 transition-transform duration-300 hover:-translate-y-1 hover:shadow-neon-cyan"
            >
              <div className="relative h-48 overflow-hidden sm:h-56">
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 176px, 208px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white drop-shadow">
                    {c.name}
                  </h3>
                  <p className={cn("text-[11px] font-bold drop-shadow", roleColor[c.role])}>
                    {c.role}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5 — PROTAGONIST SHOWCASE (LUCIA & JASON) */}
      <ProtagonistsShowcase />

      {/* 6 — NEWS & BLOG */}
      <section aria-labelledby="news-heading" className="container-site pt-14">
        <SectionHeader id="news-heading" title="News & Articles" subtitle="Stay updated with the latest" viewAllHref="/news" viewAllLabel="View All News" />
        <div className="grid gap-6 lg:grid-cols-2">
          {/* News half */}
          <div className="card-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-accent">Latest News</h3>
              <Link href="/news" className="text-[13px] font-semibold text-accent hover:underline">View All →</Link>
            </div>
            <div className="space-y-4">
              {newsPosts.map((a) => (
                <Link key={a.title} href="/news" className="group flex gap-4">
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={a.img}
                      alt={a.title}
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0">
                    <Badge variant="solid" className="mb-1.5">{a.tag}</Badge>
                    <h4 className="line-clamp-2 font-display text-sm font-bold leading-snug group-hover:text-accent">{a.title}</h4>
                    <p className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <time dateTime={a.date}>{a.date}</time>
                      <span className="text-border" aria-hidden="true">•</span>
                      <Clock className="h-3 w-3" aria-hidden="true" /> {a.read}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Blog half */}
          <div className="card-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-primary">From the Blog</h3>
              <Link href="/blog" className="text-[13px] font-semibold text-primary hover:underline">View All →</Link>
            </div>
            <div className="space-y-4">
              {blogPosts.map((a) => (
                <Link key={a.title} href="/blog" className="group flex gap-4">
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={a.img}
                      alt={a.title}
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0">
                    <Badge className="mb-1.5">{a.tag}</Badge>
                    <h4 className="line-clamp-2 font-display text-sm font-bold leading-snug group-hover:text-primary">{a.title}</h4>
                    <p className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <time dateTime={a.date}>{a.date}</time>
                      <span className="text-border" aria-hidden="true">•</span>
                      <Clock className="h-3 w-3" aria-hidden="true" /> {a.read}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7 — NEWSLETTER */}
      <section aria-labelledby="newsletter-heading" className="container-site py-16">
        <div className="card-surface relative overflow-hidden min-h-[380px]">
          <Image
            src="/img/hero-dark.jpg"
            alt="GTA 6 Vice City Skyline"
            fill
            sizes="100vw"
            className="object-cover object-right opacity-75 brightness-110 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent pointer-events-none" />
          <div className="relative px-6 py-12 sm:px-10">
            <p className="section-eyebrow text-accent">Newsletter</p>
            <h2 id="newsletter-heading" className="mt-3 max-w-md font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Never Miss <br /> an <span className="text-accent text-glow-amber">Update</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Subscribe to our newsletter and get the latest GTA 6 news, articles, trailers and exclusive updates straight to your inbox.
            </p>
            <NewsletterForm />
            <div className="mt-8 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { title: "Latest News", desc: "Get all official updates and announcements." },
                { title: "Exclusive Content", desc: "Early access to articles, screenshots and more." },
                { title: "No Spam", desc: "We respect your inbox. Unsubscribe anytime." },
              ].map((p) => (
                <div key={p.title} className="flex items-start gap-2.5">
                  <span className="icon-tile h-8 w-8 shrink-0 border border-accent/40 bg-accent/10 text-accent" aria-hidden="true">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold">{p.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
