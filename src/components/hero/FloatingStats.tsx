"use client";

import Link from "next/link";
import { Users, Car, Crosshair, Target, MapPin, Trophy } from "lucide-react";

interface StatItem {
  metric: string;
  label: string;
  href: string;
  icon: typeof Users;
  iconColor: string;
  iconBg: string;
}

const STATS: StatItem[] = [
  {
    metric: "500+",
    label: "Characters",
    href: "/characters",
    icon: Users,
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBg: "bg-amber-500/15 border-amber-500/30",
  },
  {
    metric: "200+",
    label: "Vehicles",
    href: "/vehicles",
    icon: Car,
    iconColor: "text-sky-500 dark:text-cyan-400",
    iconBg: "bg-sky-500/15 border-sky-500/30",
  },
  {
    metric: "300+",
    label: "Weapons",
    href: "/weapons",
    icon: Crosshair,
    iconColor: "text-orange-500 dark:text-orange-400",
    iconBg: "bg-orange-500/15 border-orange-500/30",
  },
  {
    metric: "400+",
    label: "Missions",
    href: "/missions",
    icon: Target,
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
  },
  {
    metric: "800+",
    label: "Locations",
    href: "/locations",
    icon: MapPin,
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBg: "bg-amber-500/15 border-amber-500/30",
  },
  {
    metric: "100%",
    label: "Completion",
    href: "/tracker",
    icon: Trophy,
    iconColor: "text-yellow-500 dark:text-yellow-400",
    iconBg: "bg-yellow-500/15 border-yellow-500/30",
  },
];

export function FloatingStats() {
  return (
    <div className="w-full rounded-2xl sm:rounded-3xl border border-border bg-card/90 dark:bg-card/75 backdrop-blur-2xl px-4 py-3 sm:px-6 lg:px-8 shadow-lg text-card-foreground">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* 6 Stats Horizontal Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-2 w-full lg:w-auto flex-1">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl transition-all hover:bg-muted/60"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${stat.iconBg} transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <span className="block font-display text-sm sm:text-base font-black text-foreground leading-none tracking-tight group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                    {stat.metric}
                  </span>
                  <span className="block text-[11px] font-semibold text-muted-foreground truncate mt-0.5">
                    {stat.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Quote Section */}
        <div className="hidden xl:flex flex-col items-end text-right border-l border-border pl-6 shrink-0">
          <span className="font-serif italic text-xs font-bold tracking-wider text-foreground/90 uppercase">
            &ldquo;VICE CITY LIVES AGAIN.&rdquo;
          </span>
          <span className="font-mono text-[9px] font-extrabold tracking-[0.25em] text-amber-500 dark:text-amber-400 uppercase mt-0.5">
            — ROCKSTAR GAMES
          </span>
        </div>
      </div>
    </div>
  );
}
