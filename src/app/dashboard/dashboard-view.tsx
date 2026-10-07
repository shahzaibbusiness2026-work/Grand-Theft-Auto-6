"use client";

import { useState } from "react";
import { CompanionSidebar } from "@/components/dashboard/companion-sidebar";
import { CompanionTopBar } from "@/components/dashboard/companion-topbar";
import { CompanionHero } from "@/components/dashboard/companion-hero";
import { CompanionProgressCard } from "@/components/dashboard/companion-progress-card";
import { CompanionContinueCard } from "@/components/dashboard/companion-continue-card";
import { CompanionGoalsCard } from "@/components/dashboard/companion-goals-card";
import { CompanionActivityCard } from "@/components/dashboard/companion-activity-card";
import { CompanionRecommendationsCard } from "@/components/dashboard/companion-recommendations-card";
import { CompanionUpdatesCard } from "@/components/dashboard/companion-updates-card";
import { CompanionMapSection } from "@/components/dashboard/companion-map-section";
import { CompanionVehiclesSection } from "@/components/dashboard/companion-vehicles-section";
import { CompanionWeaponsSection } from "@/components/dashboard/companion-weapons-section";
import { CompanionAiCard } from "@/components/dashboard/companion-ai-card";
import { CompanionQuoteCard } from "@/components/dashboard/companion-quote-card";
import { X } from "lucide-react";
import type { DashboardStats } from "@/lib/services/queries";

interface DashboardViewProps {
  liveStats: DashboardStats;
}

export function DashboardView({ liveStats }: DashboardViewProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div data-flip-text className="flex h-screen w-full overflow-hidden bg-[#070b14] dark:bg-[#070b14] text-slate-100 dark:text-slate-100 antialiased select-none transition-colors">
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
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white"
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
          userName="Zuhaib"
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
          <div className="mx-auto max-w-[1540px] space-y-6 pb-12">
            {/* Hero Welcome Card — shows live DB counts as site stats */}
            <CompanionHero
              userName="ZUHAIB"
              completionRate={72}
              siteStats={{
                totalVehicles: liveStats.totalVehicles,
                totalWeapons: liveStats.totalWeapons,
                totalArticles: liveStats.totalArticles,
                totalCharacters: liveStats.totalCharacters,
              }}
            />

            {/* Row 1: Progress (local storage), Continue Mission (Real GTA 6 Mission from DB), Today's Goals */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <CompanionProgressCard overallPercent={72} />
              <CompanionContinueCard
                missionTitle={liveStats.activeMission?.name || "Welcome to Leonida"}
                missionType={liveStats.activeMission?.act || "Main Story"}
                completedObjectives={3}
                totalObjectives={4}
                location={liveStats.activeMission?.district || "Vice City Downtown"}
                playTime="45m"
                protagonist={liveStats.activeMission?.protagonist || "Lucia"}
                objectivesText={liveStats.activeMission?.objectives}
              />
              <CompanionGoalsCard />
            </div>

            {/* Row 2: Live Mapped Territorities & Interactive Map Section */}
            <CompanionMapSection
              locations={liveStats.featuredLocations}
              totalMarkers={liveStats.totalMapMarkers || 24}
              totalLocations={liveStats.totalLocations || 14}
            />

            {/* Row 3: Live Verified Fleet / Vehicles Showcase */}
            <CompanionVehiclesSection
              vehicles={liveStats.featuredVehicles}
              totalVehicles={liveStats.totalVehicles}
            />

            {/* Row 4: Live Verified Armory / Weapons Showcase */}
            <CompanionWeaponsSection
              weapons={liveStats.featuredWeapons}
              totalWeapons={liveStats.totalWeapons}
            />

            {/* Row 5: Recent Activity, Recommendations, Latest Updates (live articles) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <CompanionActivityCard />
              <CompanionRecommendationsCard />
              {/* Latest Updates receives live articles from Supabase */}
              <CompanionUpdatesCard articles={liveStats.latestArticles} />
            </div>

            {/* Row 6: Ask GTA 6 AI, Atmospheric Quote */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <CompanionAiCard />
              </div>
              <div className="lg:col-span-4">
                <CompanionQuoteCard />
              </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className="flex items-center justify-center pt-8 pb-4 text-center">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
                VICE CITY <span className="text-amber-500 mx-2">/</span> A BIGGER TOMORROW
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
