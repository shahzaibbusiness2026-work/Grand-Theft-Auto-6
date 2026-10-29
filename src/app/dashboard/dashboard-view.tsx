"use client";

import { useState, useEffect } from "react";
import { getDisplayName } from "@/lib/user-store";
import { CompanionSidebar } from "@/components/dashboard/companion-sidebar";
import { CompanionTopBar } from "@/components/dashboard/companion-topbar";
import { CompanionHero } from "@/components/dashboard/companion-hero";
import { CompanionVehiclesSection } from "@/components/dashboard/companion-vehicles-section";
import { CompanionWeaponsSection } from "@/components/dashboard/companion-weapons-section";
import { X } from "lucide-react";
import type { DashboardStats } from "@/lib/services/queries";

interface DashboardViewProps {
  liveStats: DashboardStats;
}

export function DashboardView({ liveStats }: DashboardViewProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // The account's own name — read from the local login on mount (never a
  // hardcoded person). "Player" is the neutral fallback before login.
  const [displayName, setDisplayName] = useState("Player");
  useEffect(() => {
    setDisplayName(getDisplayName());
  }, []);

  return (
    <div data-flip-text className="dashboard-type flex h-screen w-full overflow-hidden bg-[#070b14] dark:bg-[#070b14] text-slate-100 dark:text-slate-100 antialiased select-none transition-colors">
      {/* SEO: single H1 for the page, visually hidden (dashboard is a tool UI). */}
      <h1 className="sr-only">GTA 6 Dashboard</h1>
      {/* 1. Desktop Fixed Sidebar */}
      <div className="hidden md:flex shrink-0">
        <CompanionSidebar />
      </div>

      {/* 2. Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative z-10 flex w-72 flex-col bg-[#04060d] shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
            <CompanionSidebar onItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Main Content Viewport */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <CompanionTopBar
          onMenuToggle={() => setMobileMenuOpen(true)}
          userName={displayName}
        />

        {/* Scrollable Dashboard Body — weapons and vehicles only, all live DB data */}
        <main className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
          {/* Ambient premium glows */}
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(201,168,106,0.12),transparent_60%)]" />
          <div className="pointer-events-none absolute right-0 top-1/3 -z-0 h-96 w-96 rounded-full bg-[#00F0FF]/[0.05] blur-[120px]" />
          <div className="mx-auto max-w-[1540px] space-y-6 pb-12">
            {/* Hero Welcome Card — shows live DB counts as site stats */}
            <CompanionHero
              userName={displayName}
              siteStats={{
                totalVehicles: liveStats.totalVehicles,
                totalWeapons: liveStats.totalWeapons,
                totalCharacters: liveStats.totalCharacters,
                totalArticles: liveStats.totalArticles,
              }}
            />

            {/* Live Fleet / Vehicles Showcase */}
            <CompanionVehiclesSection
              vehicles={liveStats.featuredVehicles}
              totalVehicles={liveStats.totalVehicles}
            />

            {/* Live Armory / Weapons Showcase */}
            <CompanionWeaponsSection
              weapons={liveStats.featuredWeapons}
              totalWeapons={liveStats.totalWeapons}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
