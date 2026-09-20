"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Flag,
  Crosshair,
  Gem,
  Trophy,
  Map,
  Compass,
  Car,
  Shield,
  Users,
  BookOpen,
  Radio,
  Download,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  ChevronRight,
  Database,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardSidebarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categoryStats: { cat: string; total: number; done: number; pct: number }[];
  totalObjectives: number;
  completedCount: number;
  onReset: () => void;
  onExport: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function DashboardSidebar({
  selectedCategory,
  onSelectCategory,
  categoryStats,
  totalObjectives,
  completedCount,
  onReset,
  onExport,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const getCatStat = (catName: string) => {
    return categoryStats.find((c) => c.cat === catName);
  };

  const storyStat = getCatStat("Story");
  const sideStat = getCatStat("Side");
  const collectiblesStat = getCatStat("Collectibles");
  const activitiesStat = getCatStat("Activities");

  // Tracker modules (filtered in-page)
  const trackerItems = [
    {
      id: "All",
      label: "Overview & HUD",
      sublabel: "Command Center",
      icon: LayoutDashboard,
      badge: `${completedCount}/${totalObjectives}`,
      color: "#00F0FF",
    },
    {
      id: "Story",
      label: "Story Campaign",
      sublabel: "Lucia & Jason Arcs",
      icon: Flag,
      badge: `${storyStat?.done ?? 0}/${storyStat?.total ?? 6}`,
      color: "#00F0FF",
    },
    {
      id: "Side",
      label: "Side Contracts",
      sublabel: "Bounties & Smuggling",
      icon: Crosshair,
      badge: `${sideStat?.done ?? 0}/${sideStat?.total ?? 4}`,
      color: "#FF7A00",
    },
    {
      id: "Collectibles",
      label: "Hidden Caches",
      sublabel: "Beacons & Cargo",
      icon: Gem,
      badge: `${collectiblesStat?.done ?? 0}/${collectiblesStat?.total ?? 4}`,
      color: "#f59e0b",
    },
    {
      id: "Activities",
      label: "World Activities",
      sublabel: "Stunts & Challenges",
      icon: Trophy,
      badge: `${activitiesStat?.done ?? 0}/${activitiesStat?.total ?? 4}`,
      color: "#10b981",
    },
  ];

  // Core Atlas feature databases
  const atlasFeatures = [
    {
      label: "Interactive Map",
      sublabel: "Leonida GPS Grid",
      href: "/map",
      icon: Map,
      badge: "GPS",
      color: "#38bdf8",
    },
    {
      label: "Map Explorer",
      sublabel: "POIs & Districts",
      href: "/map-explorer",
      icon: Compass,
      badge: "3D",
      color: "#818cf8",
    },
    {
      label: "Vehicles Database",
      sublabel: "Supercars & Boats",
      href: "/vehicles",
      icon: Car,
      badge: "200+",
      color: "#f59e0b",
    },
    {
      label: "Weapons Armory",
      sublabel: "Firearms & Gear",
      href: "/weapons",
      icon: Shield,
      badge: "50+",
      color: "#ef4444",
    },
    {
      label: "Characters & Intel",
      sublabel: "Lucia, Jason & Lore",
      href: "/characters",
      icon: Users,
      badge: "INTEL",
      color: "#ec4899",
    },
    {
      label: "Missions Archive",
      sublabel: "Campaign Walkthrough",
      href: "/missions",
      icon: Database,
      badge: "LOG",
      color: "#a855f7",
    },
    {
      label: "Guides & Tactics",
      sublabel: "100% Completion Tips",
      href: "/guides",
      icon: BookOpen,
      badge: "PRO",
      color: "#06b6d4",
    },
    {
      label: "Newswire Wire",
      sublabel: "Rockstar Intel",
      href: "/news",
      icon: Radio,
      badge: "LIVE",
      color: "#f43f5e",
    },
  ];

  const sidebarBody = (
    <div className="flex h-full flex-col justify-between p-3.5 sm:p-4 text-slate-300">
      {/* Top Header & Brand */}
      <div className="space-y-4">
        <div className={cn("pb-3 border-b border-white/10", isCollapsed ? "flex flex-col items-center gap-2.5" : "flex items-center justify-between")}>
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <Layers className="h-4 w-4 text-slate-950 font-bold" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-sm font-black tracking-wide text-white uppercase truncate">
                    Atlas System
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
                </div>
                <p className="font-mono text-[10px] text-slate-400 tracking-wider">
                  OS V1.04 // ONLINE
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              <Layers className="h-4 w-4 text-slate-950 font-bold" />
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* Desktop Toggle Button */}
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
              className={cn(
                "hidden lg:flex h-8 w-8 items-center justify-center rounded-xl border transition-all focus-visible:ring-2 focus-visible:ring-[#00F0FF]",
                isCollapsed
                  ? "border-[#00F0FF]/40 bg-[#00F0FF]/15 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.3)] hover:bg-[#00F0FF]/25 hover:border-[#00F0FF]"
                  : "border-white/10 bg-white/[0.04] text-slate-400 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 hover:bg-[#00F0FF]/15 hover:shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              )}
              title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4 text-[#00F0FF]" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close sidebar"
              className="flex lg:hidden h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/15 transition-all focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Section 1: Dashboard Tracker Modules */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-2.5 pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#00F0FF]/80">
              {"// Tracker Modules"}
            </p>
          )}
          <nav className="space-y-1" aria-label="Tracker Sections">
            {trackerItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedCategory === item.id;

              if (isCollapsed) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(item.id);
                      onCloseMobile();
                    }}
                    title={`${item.label} (${item.badge})`}
                    suppressHydrationWarning
                    className={cn(
                      "relative flex h-10 w-10 mx-auto items-center justify-center rounded-xl transition-all duration-200 outline-none",
                      isActive
                        ? "bg-[#00F0FF]/15 border border-[#00F0FF]/60 shadow-[0_0_15px_rgba(0,240,255,0.3)] text-[#00F0FF]"
                        : "border border-transparent text-slate-400 hover:bg-gradient-to-br hover:from-amber-500/20 hover:to-orange-500/15 hover:border-amber-500/50 hover:text-white hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isActive ? "scale-110" : "group-hover:scale-110"
                      )}
                      style={{ color: isActive ? item.color : undefined }}
                    />
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(item.id);
                    onCloseMobile();
                  }}
                  suppressHydrationWarning
                  className={cn(
                    "group flex w-full items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 outline-none text-left focus-visible:ring-2 focus-visible:ring-amber-500",
                    isActive
                      ? "bg-[#00F0FF]/12 border-l-2 border-[#00F0FF] shadow-[inset_0_0_12px_rgba(0,240,255,0.12)] text-[#00F0FF]"
                      : "border-l-2 border-transparent hover:bg-gradient-to-r hover:from-amber-500/15 hover:via-orange-500/[0.08] hover:to-transparent hover:border-l-2 hover:border-amber-500 hover:shadow-[inset_0_0_15px_rgba(245,158,11,0.08)]"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "scale-105" : "text-slate-400 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                      )}
                      style={{ color: isActive ? item.color : undefined }}
                    />
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "font-display text-[13px] font-bold tracking-wide truncate transition-colors duration-200",
                          isActive ? "text-[#00F0FF]" : "text-slate-200 group-hover:text-white"
                        )}
                      >
                        {item.label}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] truncate transition-colors duration-200",
                          isActive ? "text-[#00F0FF]/70" : "text-slate-400 group-hover:text-slate-300"
                        )}
                      >
                        {item.sublabel}
                      </p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "ml-2 shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold border transition-all duration-200",
                      isActive
                        ? "bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/40 shadow-[0_0_8px_rgba(0,240,255,0.15)]"
                        : "bg-white/[0.04] text-slate-300 border-white/10 group-hover:bg-amber-500/20 group-hover:text-amber-400 group-hover:border-amber-500/50 group-hover:shadow-[0_0_8px_rgba(245,158,11,0.25)]"
                    )}
                    suppressHydrationWarning
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Atlas Intelligence (All site features) */}
        <div className="space-y-1 pt-2 border-t border-white/10">
          {!isCollapsed && (
            <p className="px-2.5 pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400/90">
              {"// Atlas Intelligence"}
            </p>
          )}
          <nav className="space-y-1" aria-label="Atlas Features">
            {atlasFeatures.map((feat) => {
              const Icon = feat.icon;
              const isCurrent = pathname === feat.href;

              if (isCollapsed) {
                return (
                  <Link
                    key={feat.href}
                    href={feat.href}
                    prefetch={true}
                    onClick={onCloseMobile}
                    title={`${feat.label} (${feat.badge})`}
                    className={cn(
                      "flex h-10 w-10 mx-auto items-center justify-center rounded-xl transition-all duration-200",
                      isCurrent
                        ? "bg-amber-500/20 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.35)] text-white"
                        : "border border-transparent text-slate-400 hover:bg-gradient-to-br hover:from-amber-500/20 hover:to-orange-500/15 hover:border-amber-500/50 hover:text-white hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    )}
                  >
                    <Icon
                      className="h-4 w-4 transition-transform duration-200 hover:scale-110"
                      style={{ color: feat.color }}
                    />
                  </Link>
                );
              }

              return (
                <Link
                  key={feat.href}
                  href={feat.href}
                  prefetch={true}
                  onClick={onCloseMobile}
                  className={cn(
                    "group flex w-full items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-left focus-visible:ring-2 focus-visible:ring-amber-500",
                    isCurrent
                      ? "bg-amber-500/15 border-l-2 border-amber-500 text-white shadow-[inset_0_0_12px_rgba(245,158,11,0.12)]"
                      : "border-l-2 border-transparent hover:bg-gradient-to-r hover:from-amber-500/15 hover:via-orange-500/[0.08] hover:to-transparent hover:border-l-2 hover:border-amber-500 hover:shadow-[inset_0_0_15px_rgba(245,158,11,0.08)] text-slate-300 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                      style={{ color: feat.color }}
                    />
                    <div className="min-w-0">
                      <p className="font-display text-[13px] font-bold tracking-wide truncate text-slate-200 group-hover:text-white transition-colors duration-200">
                        {feat.label}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate group-hover:text-slate-300 transition-colors duration-200">
                        {feat.sublabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    <span className="shrink-0 rounded-md bg-white/[0.04] border border-white/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-300 group-hover:bg-amber-500/20 group-hover:text-amber-400 group-hover:border-amber-500/50 group-hover:shadow-[0_0_8px_rgba(245,158,11,0.25)] transition-all duration-200">
                      {feat.badge}
                    </span>
                    <ChevronRight className="h-3 w-3 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom System Controls */}
      <div className="pt-3 border-t border-white/10 space-y-2 mt-3">
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                Browser Cache Sync
              </span>
              <span className="text-[#10b981] font-bold">READY</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onExport}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-white/10 bg-white/[0.03] text-slate-200 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 hover:bg-[#00F0FF]/15 hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
                title="Export Save File (JSON)"
              >
                <Download className="h-3.5 w-3.5 text-[#00F0FF]" /> Export
              </button>

              <button
                type="button"
                onClick={onReset}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-white/10 bg-white/[0.03] text-slate-200 hover:text-[#ef4444] hover:border-[#ef4444]/50 hover:bg-[#ef4444]/15 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ef4444]"
                title="Reset local completion progress"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#ef4444]" /> Reset
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onExport}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#00F0FF] hover:bg-[#00F0FF]/20 hover:border-[#00F0FF]/60 hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
              title="Export Save File (JSON)"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#ef4444] hover:bg-[#ef4444]/20 hover:border-[#ef4444]/60 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-all focus-visible:ring-2 focus-visible:ring-[#ef4444]"
              title="Reset Progress"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={cn(
          "hidden lg:block shrink-0 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[76px]" : "w-64 xl:w-72"
        )}
      >
        <div className="sticky top-20 rounded-3xl border border-white/10 bg-[#060913]/95 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
          {sidebarBody}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Off-Canvas Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Atlas Navigation Drawer"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#060913] border-r border-white/15 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarBody}
      </div>
    </>
  );
}
