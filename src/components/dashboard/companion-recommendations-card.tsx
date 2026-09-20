"use client";

import Link from "next/link";
import { Sparkles, MoreHorizontal, ChevronRight } from "lucide-react";

interface RecommendationItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
}

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: "rec-1",
    title: "Best Vehicle for Your Budget",
    subtitle: "Bravado Banshee",
    href: "/vehicles",
    image: "/img/car-pink.jpg",
  },
  {
    id: "rec-2",
    title: "High-Paying Side Mission",
    subtitle: "The Vice Hustle",
    href: "/missions",
    image: "/img/char-jason.jpg",
  },
  {
    id: "rec-3",
    title: "Nearby Collectibles",
    subtitle: "5 items near your location",
    href: "/collectibles",
    image: "/img/cache-chest.jpg",
  },
  {
    id: "rec-4",
    title: "Property to Consider",
    subtitle: "Oceanview Apartment",
    href: "/properties",
    image: "/img/apartment.jpg",
  },
];

export function CompanionRecommendationsCard() {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>RECOMMENDED FOR YOU</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Based on your progress and playstyle
          </p>
        </div>
        <button
          type="button"
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Recommendations list */}
      <div className="my-3 space-y-2.5">
        {RECOMMENDATIONS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-2.5 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.06]"
          >
            <div className="flex items-center gap-3 truncate">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="truncate">
                <span className="block text-xs font-bold text-white truncate group-hover:text-[#00F0FF] transition-colors">
                  {item.title}
                </span>
                <span className="block text-[11px] text-slate-400 truncate">
                  {item.subtitle}
                </span>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
