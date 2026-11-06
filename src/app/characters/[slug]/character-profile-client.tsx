"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  ChevronRight,
  Clapperboard,
  Clock,
  Coffee,
  Dumbbell,
  Ellipsis,
  Eye,
  Film,
  Flame,
  Gamepad2,
  Heart,
  Image as ImageIcon,
  Lightbulb,
  Link2,
  MapPin,
  Play,
  Shield,
  Smile,
  Sparkles,
  Star,
  Tag,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import { YouTubeLite } from "@/components/youtube-lite";
import {
  OFFICIAL_TRAILERS,
  type CharacterProfileFacts,
} from "@/lib/character-profile";

type Tab = "overview" | "gallery" | "trailers" | "relationships" | "more";

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "overview", label: "Overview", icon: User },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "trailers", label: "Trailers", icon: Play },
  { id: "relationships", label: "Relationships", icon: Users },
  { id: "more", label: "More", icon: Ellipsis },
];

const INFO_ICONS: Record<string, typeof User> = {
  "Full Name": User,
  Role: Star,
  Status: Activity,
  Location: MapPin,
  Affiliation: Users,
  "Key Connection": Link2,
  "First Appearance": Clapperboard,
  "Known For": Target,
};

const TRAIT_ICONS: Record<string, typeof Zap> = {
  Determined: Target,
  Resilient: Shield,
  Driven: Zap,
  Loyal: Heart,
  "Easy-going": Smile,
  Watchful: Eye,
  Paranoid: Eye,
  "Laid-back": Coffee,
  Ambitious: TrendingUp,
  Charismatic: Sparkles,
  "Business-minded": Briefcase,
  Hustling: Zap,
  Savvy: Lightbulb,
  Relentless: Flame,
  Confident: Star,
  Charming: Sparkles,
  Cunning: Brain,
  Bold: Flame,
  Experienced: Award,
  Shrewd: Brain,
  Patient: Clock,
};

const QUICK_FACT_ICONS: Record<string, typeof Gamepad2> = {
  Game: Gamepad2,
  "First Revealed": Calendar,
  Region: MapPin,
  "Affiliation Type": Users,
  Focus: Tag,
};

function Panel({
  icon: Icon,
  title,
  action,
  className,
  children,
}: {
  icon: typeof User;
  title: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10102a]/90 dark:shadow-none ${className ?? ""}`}
    >      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
          <Icon className="h-5 w-5 shrink-0 text-[#FF2E9A]" aria-hidden />
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function CharacterProfileClient({
  name,
  summary,
  context,
  question,
  answer,
  related,
  facts,
}: {
  name: string;
  summary: string;
  context: string;
  question: string;
  answer: string;
  related: { label: string; href: string }[];
  facts: CharacterProfileFacts;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");
  const otherLinks = related.filter((l) => !l.href.startsWith("/characters/"));

  return (
    <div className="bg-[#f7f5ff] text-slate-900 dark:bg-[#07071a] dark:text-slate-100">
      {/* Hero banner — Vice City skyline backdrop, portrait + name */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <img
            src="/img/hero-vice-skyline-hd.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f5ff] via-[#f7f5ff]/85 to-[#f7f5ff]/25 dark:from-[#07071a] dark:via-[#07071a]/80 dark:to-[#07071a]/30" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#f7f5ff] dark:to-[#07071a]" />
        </div>
        <div className="container-site relative">
          <div className="flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:py-14">
            <div className="w-52 shrink-0 sm:w-64">
              <img
                src={facts.portrait}
                alt={`${name} — official Rockstar portrait`}
                className="aspect-[3/4] w-full rounded-2xl object-cover shadow-2xl ring-2 ring-[#FF2E9A]/50 dark:shadow-[0_0_44px_rgba(255,46,154,0.35)]"
              />
            </div>
            <div className="min-w-0 pb-1">
              <Link
                href="/characters"
                className="text-sm font-semibold text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-900 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-white"
              >
                &larr; All characters
              </Link>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#FF2E9A] px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white">
                  GTA VI
                </span>
                <span className="rounded-md bg-violet-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white">
                  {facts.roleLabel}
                </span>
              </div>
              <h1 className="mt-3 font-display text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-7xl">
                {firstName}{" "}
                <span className="bg-gradient-to-r from-[#FF2E9A] to-violet-500 bg-clip-text text-transparent">
                  {lastName}
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300/90 sm:text-lg">
                {summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="container-site">
        <div
          role="tablist"
          aria-label="Character sections"
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={
                tab === id
                  ? "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF2E9A] to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg"
                  : "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none dark:hover:border-white/25 dark:hover:text-white"
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        <div className="pb-14 pt-6">
          {tab === "overview" && (
            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-12">
              {/* Character Information */}
              <Panel icon={User} title="Character Information" className="xl:col-span-3">
                <dl className="divide-y divide-slate-100 dark:divide-white/5">
                  {facts.info.map((row) => {
                    const Icon = INFO_ICONS[row.label] ?? Film;
                    return (
                      <div key={row.label} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="flex w-28 shrink-0 items-start gap-1.5 pt-0.5 text-[13px] font-bold text-slate-500 dark:text-slate-400">
                          <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF2E9A]" aria-hidden />
                          {row.label}
                        </span>
                        <dd className="text-[15px] font-medium leading-snug text-slate-800 dark:text-slate-200">
                          {row.value}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </Panel>

              {/* Overview + traits + relationships */}
              <div className="space-y-5 xl:col-span-4">
                <Panel icon={BookOpen} title="Overview">
                  <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {summary}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {context}
                  </p>
                </Panel>
                <Panel icon={Zap} title="Key Traits">
                  <div className="flex flex-wrap gap-2">
                    {facts.traits.map((trait) => {
                      const Icon = TRAIT_ICONS[trait] ?? Sparkles;
                      return (
                        <span
                          key={trait}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF2E9A]/25 bg-[#FF2E9A]/5 px-3 py-2 text-sm font-bold text-slate-800 dark:border-[#FF2E9A]/30 dark:bg-[#FF2E9A]/10 dark:text-slate-100"
                        >
                          <Icon className="h-4 w-4 text-[#FF2E9A]" aria-hidden />
                          {trait}
                        </span>
                      );
                    })}
                  </div>
                </Panel>
                <Panel
                  icon={Users}
                  title="Relationships"
                  action={
                    <Link
                      href="/characters"
                      className="inline-flex items-center gap-1 text-sm font-bold text-[#FF2E9A] hover:underline"
                    >
                      View All <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  }
                >
                  <div className="space-y-3">
                    {facts.relationships.map((rel) => (
                      <Link
                        key={rel.slug}
                        href={`/characters/${rel.slug}`}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition hover:border-[#FF2E9A]/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-[#FF2E9A]/50"
                      >
                        <img
                          src={rel.portrait}
                          alt={rel.name}
                          className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#FF2E9A]/60"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-bold text-slate-900 dark:text-slate-100">
                            {rel.name}
                          </span>
                          <span className="block text-[13px] text-slate-500 dark:text-slate-400">
                            {rel.label}
                          </span>
                        </span>
                        <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                      </Link>
                    ))}
                  </div>
                </Panel>
              </div>

              {/* Trailer + gallery preview */}
              <div className="space-y-5 xl:col-span-3">
                <Panel
                  icon={Play}
                  title="Official Trailer"
                  action={
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {facts.trailer.title}
                    </span>
                  }
                >
                  <div className="overflow-hidden rounded-xl">
                    <YouTubeLite videoId={facts.trailer.videoId} title={facts.trailer.title} />
                  </div>
                  <p className="mt-3 flex items-center justify-between text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>
                      {facts.trailer.date} &middot; {facts.trailer.duration}
                    </span>
                    <Link
                      href={facts.trailer.breakdownHref}
                      className="font-bold text-[#FF2E9A] hover:underline"
                    >
                      Read the breakdown &rarr;
                    </Link>
                  </p>
                </Panel>
                <Panel
                  icon={ImageIcon}
                  title="Gallery"
                  action={
                    <button
                      onClick={() => setTab("gallery")}
                      className="text-sm font-bold text-[#FF2E9A] hover:underline"
                    >
                      View all &rarr;
                    </button>
                  }
                >
                  <div className="grid grid-cols-3 gap-2">
                    {facts.gallery.slice(0, 3).map((img) => (
                      <button
                        key={img.src}
                        onClick={() => setTab("gallery")}
                        className="overflow-hidden rounded-lg"
                        aria-label={`Open gallery — ${img.caption}`}
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="aspect-[3/4] w-full object-cover transition hover:opacity-85"
                        />
                      </button>
                    ))}
                  </div>
                </Panel>
              </div>

              {/* Quick Facts */}
              <Panel icon={Zap} title="Quick Facts" className="xl:col-span-2">
                <dl className="space-y-4">
                  {facts.quickFacts.map((row) => {
                    const Icon = QUICK_FACT_ICONS[row.label] ?? Tag;
                    return (
                      <div key={row.label}>
                        <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          <Icon className="h-3.5 w-3.5 text-[#FF2E9A]" aria-hidden />
                          {row.label}
                        </dt>
                        <dd className="mt-1 text-[15px] font-semibold leading-snug text-slate-800 dark:text-slate-200">
                          {row.value}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </Panel>
            </div>
          )}

          {tab === "gallery" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Gallery — {name}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Official Rockstar portrait and verified trailer frames only.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {facts.gallery.map((img) => (
                  <figure
                    key={img.src}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#10102a]/90 dark:shadow-none"
                  >
                    <img src={img.src} alt={img.caption} className="aspect-[3/4] w-full object-cover" />
                    <figcaption className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {img.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {tab === "trailers" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Official trailers
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                The two official GTA VI trailers from Rockstar Games.
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {OFFICIAL_TRAILERS.map((t) => (
                  <div
                    key={t.videoId}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#10102a]/90 dark:shadow-none"
                  >
                    <YouTubeLite videoId={t.videoId} title={t.title} />
                    <div className="flex items-center justify-between gap-3 px-5 py-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{t.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {t.date} &middot; {t.duration}
                        </p>
                      </div>
                      <Link
                        href={t.breakdownHref}
                        className="shrink-0 text-sm font-bold text-[#FF2E9A] hover:underline"
                      >
                        Breakdown &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "relationships" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Relationships — {name}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Only connections Rockstar&rsquo;s published bios actually state.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {facts.relationships.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/characters/${rel.slug}`}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#FF2E9A]/50 dark:border-white/10 dark:bg-[#10102a]/90 dark:shadow-none dark:hover:border-[#FF2E9A]/50"
                  >
                    <img
                      src={rel.portrait}
                      alt={rel.name}
                      className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-[#FF2E9A]/60"
                    />
                    <span>
                      <span className="block text-base font-bold text-slate-900 dark:text-slate-100">
                        {rel.name}
                      </span>
                      <span className="block text-sm text-slate-500 dark:text-slate-400">
                        {rel.label}
                      </span>
                    </span>
                  </Link>
                ))}
                <Link
                  href="/characters"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 p-4 text-sm font-bold text-slate-500 transition hover:border-[#FF2E9A]/50 hover:text-[#FF2E9A] dark:border-white/20 dark:text-slate-400"
                >
                  View all characters <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          )}

          {tab === "more" && (
            <div className="max-w-3xl space-y-5">
              <Panel icon={BookOpen} title={question}>
                <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {answer}
                </p>
              </Panel>
              {otherLinks.length > 0 && (
                <Panel icon={Link2} title="People and places to explore next">
                  <ul className="list-disc space-y-3 pl-5">
                    {otherLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-2 hover:text-[#FF2E9A] dark:text-slate-200 dark:decoration-slate-600"
                          href={link.href}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Source:{" "}
                <a
                  className="underline"
                  href="https://www.rockstargames.com/VI/only-in-leonida"
                  target="_blank"
                  rel="noreferrer"
                >
                  Rockstar Games, {name} section
                </a>
                . Reviewed November 4, 2026. Background summaries cite
                Rockstar&rsquo;s published biographies. This is a source-based
                profile, not a first-hand gameplay test.{" "}
                <Link className="underline" href="/corrections">
                  Send a correction
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
