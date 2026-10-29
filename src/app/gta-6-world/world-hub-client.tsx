"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Leaf,
  Music,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import { WORLD_SECTIONS, type WorldSection } from "@/lib/gta-world";

const SECTION_ICONS: Record<WorldSection["icon"], LucideIcon> = {
  leaf: Leaf,
  music: Music,
  building: Building2,
  users: Users,
};

function WorldCard({
  card,
  accent,
}: {
  card: WorldSection["cards"][number];
  accent: string;
}) {
  return (
    <Link
      href={card.href}
      className="group relative block min-h-[150px] overflow-hidden rounded-[9px] border border-white/10 transition-all duration-200 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {card.image ? (
        <SafeImage
          src={card.image}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : null}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-tight text-white">
            {card.title}
          </p>
          <p className="mt-0.5 line-clamp-1 text-xs text-white/70">
            {card.subtitle}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white transition-colors group-hover:bg-white group-hover:text-black"
        >
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ backgroundColor: accent }}
      />
    </Link>
  );
}

export function WorldHubSections() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggle = (id: string) => {
    if (expanded === id) {
      setExpanded(null);
      buttonRefs.current[id]?.focus();
      return;
    }
    setExpanded(id);
    requestAnimationFrame(() => panelRefs.current[id]?.focus());
  };

  return (
    <div className="space-y-10 pb-10">
      {WORLD_SECTIONS.map((section) => {
        const Icon = SECTION_ICONS[section.icon];
        const isOpen = expanded === section.id;
        return (
          <section key={section.id} aria-labelledby={`${section.id}-heading`}>
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center"
                style={{ color: section.color }}
                aria-hidden="true"
              >
                <Icon className="h-6 w-6" />
              </span>
              <h2
                id={`${section.id}-heading`}
                className="shrink-0 text-lg font-black uppercase tracking-wide sm:text-xl"
                style={{ color: section.color }}
              >
                {section.title}
              </h2>
              <span
                aria-hidden="true"
                className="h-px flex-1 opacity-60"
                style={{ backgroundColor: section.color }}
              />
              <button
                type="button"
                ref={(el) => {
                  buttonRefs.current[section.id] = el;
                }}
                onClick={() => toggle(section.id)}
                aria-expanded={isOpen}
                aria-controls={`${section.id}-panel`}
                className="flex shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-wider text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
              >
                {isOpen ? "Close" : "Explore all"}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            {isOpen && (
              <div
                id={`${section.id}-panel`}
                ref={(el) => {
                  panelRefs.current[section.id] = el;
                }}
                tabIndex={-1}
                role="region"
                aria-label={`${section.title} overview`}
                className="mb-4 rounded-xl border border-white/15 bg-white/5 p-4 focus-visible:outline-none sm:p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-white">
                    Everything in {section.title.toLowerCase()}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggle(section.id)}
                    aria-label={`Close ${section.title} overview`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {section.cards.map((card) => (
                    <li key={card.href}>
                      <Link
                        href={card.href}
                        className="block rounded-lg border border-white/10 bg-black/30 px-3.5 py-3 transition-colors hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                      >
                        <span className="block text-sm font-bold text-white">
                          {card.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-white/65">
                          {card.subtitle}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {section.cards.map((card) => (
                <WorldCard
                  key={card.href}
                  card={card}
                  accent={section.color}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
