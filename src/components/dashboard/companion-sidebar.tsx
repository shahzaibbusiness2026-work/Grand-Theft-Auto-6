"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  MapPin,
  Car,
  Crosshair,
  Target,
  Building2,
  Coins,
  Layers,
  Sparkles,
  BookOpen,
  Newspaper,
  Bot,
  Users,
  Crown,
  Check,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanionSidebarProps {
  onItemClick?: () => void;
  className?: string;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/map", label: "Interactive Map", icon: MapPin },
  { href: "/vehicles", label: "Vehicles", icon: Car },
  { href: "/weapons", label: "Weapons", icon: Crosshair },
  { href: "/missions", label: "Missions", icon: Target },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/tools", label: "Money Tools", icon: Coins },
  { href: "/tools/loadout-builder", label: "Loadout Builder", icon: Layers },
  { href: "/collectibles", label: "Collectibles", icon: Sparkles },
  { href: "/guides", label: "Guides", icon: BookOpen },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/ai", label: "Ask GTA 6 AI", icon: Bot },
  { href: "/blog", label: "Community", icon: Users },
];

export function CompanionSidebar({ onItemClick, className }: CompanionSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col justify-between border-r border-white/[0.08] bg-[#04060d] text-slate-200 select-none overflow-y-auto no-scrollbar",
        className
      )}
    >
      {/* Top Branding */}
      <div className="p-5 pb-3">
        <Link
          href="/"
          onClick={onItemClick}
          className="group inline-flex flex-col leading-none focus:outline-none"
        >
          <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 bg-clip-text font-display text-[26px] font-black tracking-tight text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.35)]">
            GTA 6
          </span>
          <span className="mt-0.5 font-mono text-[9px] font-black uppercase tracking-[0.45em] text-[#00F0FF] opacity-90 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
            COMPANION
          </span>
        </Link>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200",
                isActive
                  ? "bg-amber-500/20 text-white font-bold shadow-[0_0_16px_rgba(245,158,11,0.25)] border border-amber-500/40"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-200"
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: GO PRO & Neon Art */}
      <div className="p-3.5 space-y-4">
        {/* GO PRO Card */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-b from-[#131c2e]/90 to-[#0c1220]/95 p-3.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              <Crown className="h-4 w-4" />
            </div>
            <span className="font-display text-sm font-extrabold tracking-wider text-white">
              GO PRO
            </span>
          </div>

          <ul className="space-y-1.5 text-[11px] text-slate-300 mb-3">
            {[
              "Ad-free experience",
              "Advanced tools",
              "Save your progress",
              "Exclusive content",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-3 w-3 text-cyan-400 shrink-0" />
                <span className="truncate">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/pricing"
            onClick={onItemClick}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 py-2 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.35)] transition-all duration-200 hover:brightness-105 active:scale-95"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-950" />
          </Link>
        </div>

        {/* Neon script & palm decoration */}
        <div className="relative flex flex-col items-center justify-center py-2 select-none pointer-events-none opacity-90 overflow-hidden">
          <svg
            className="absolute -bottom-4 right-1 h-20 w-20 text-amber-500/[0.08]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C12 2 10.5 5.5 8 8C5.5 10.5 2 12 2 12C2 12 5.5 13.5 8 16C10.5 18.5 12 22 12 22C12 22 13.5 18.5 16 16C18.5 13.5 22 12 22 12C22 12 18.5 10.5 16 8C13.5 5.5 12 2 12 2Z" />
          </svg>
          <span
            className="font-serif italic text-base tracking-wide text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]"
            style={{ fontFamily: "'Brush Script MT', 'Pacifico', cursive, sans-serif" }}
          >
            Vice City
          </span>
          <span
            className="font-serif italic text-lg tracking-wider text-amber-400 -mt-1 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]"
            style={{ fontFamily: "'Brush Script MT', 'Pacifico', cursive, sans-serif" }}
          >
            Lives Again
          </span>
        </div>
      </div>
    </aside>
  );
}
