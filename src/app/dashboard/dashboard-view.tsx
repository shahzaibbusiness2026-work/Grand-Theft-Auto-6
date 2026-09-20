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
import { CompanionAiCard } from "@/components/dashboard/companion-ai-card";
import { CompanionQuoteCard } from "@/components/dashboard/companion-quote-card";
import { X } from "lucide-react";

export function DashboardView() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#070b14] text-slate-100 antialiased select-none">
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
            {/* Hero Welcome Card */}
            <CompanionHero userName="ZUHAIB" completionRate={72} />

            {/* Row 1: Progress (72%), Continue Mission, Today's Goals */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <CompanionProgressCard overallPercent={72} />
              <CompanionContinueCard
                missionTitle="The Jewel Store Job"
                missionType="Main Mission"
                completedObjectives={3}
                totalObjectives={5}
                location="Rockford Hills"
                playTime="2h 14m"
              />
              <CompanionGoalsCard />
            </div>

            {/* Row 2: Recent Activity, Recommended For You, Latest Updates */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <CompanionActivityCard />
              <CompanionRecommendationsCard />
              <CompanionUpdatesCard />
            </div>

            {/* Row 3: Ask GTA 6 AI, Atmospheric Quote */}
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
