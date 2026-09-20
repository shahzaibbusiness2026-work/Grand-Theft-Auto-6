"use client";

import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";

interface UpdateItem {
  id: string;
  title: string;
  date: string;
  badge: "Official" | "Rumor";
  image: string;
  href: string;
}

const UPDATES: UpdateItem[] = [
  {
    id: "up-1",
    title: "GTA 6 Trailer 2 Breaks Records with 120M Views",
    date: "2 days ago",
    badge: "Official",
    image: "/img/hero-dark.jpg",
    href: "/news",
  },
  {
    id: "up-2",
    title: "Rockstar Confirms New Gameplay Details",
    date: "4 days ago",
    badge: "Official",
    image: "/img/char-lucia.jpg",
    href: "/news",
  },
  {
    id: "up-3",
    title: "Vice City Map Leak Sparks New Speculation",
    date: "1 week ago",
    badge: "Rumor",
    image: "/img/satellite-map-hd.jpg",
    href: "/news",
  },
];

export function CompanionUpdatesCard() {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
          <Newspaper className="h-4 w-4 text-amber-400" />
          <span>LATEST UPDATES</span>
        </div>
        <Link
          href="/news"
          className="flex items-center gap-1 text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Articles list */}
      <div className="my-3 space-y-3">
        {UPDATES.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.03] bg-white/[0.02] p-2.5 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.06]"
          >
            <div className="flex items-center gap-3 truncate">
              <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
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
                <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                  {item.date}
                </span>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                item.badge === "Official"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {item.badge}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
