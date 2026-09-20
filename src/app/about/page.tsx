import React from "react";
import { Metadata } from "next";
import { ShieldCheck, Compass, Users, Sparkles, AlertTriangle } from "lucide-react";
import { SiteShell } from "@/components/shells";

export const metadata: Metadata = {
  title: "About GTA 6 Atlas | The Authoritative Leonida Intelligence Network",
  description: "Learn about the mission, editorial standards, and team behind the GTA 6 Atlas comprehensive database and mapping tool.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 space-y-12">
        {/* Hero */}
        <div className="max-w-3xl space-y-4">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#B8AAFF]">
            About GTA 6 Atlas
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            The Authoritative Leonida Intelligence Hub
          </h1>
          <p className="text-base sm:text-lg text-[#B5C0D4] leading-relaxed">
            Built by passionate analysts and open-world enthusiasts, GTA 6 Atlas is dedicated to cataloging every vehicle, weapon, district, mission, and easter egg in Grand Theft Auto VI.
          </p>
        </div>

        {/* Disclaimer Notice */}
        <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5 sm:p-6 flex items-start gap-4 text-amber-200">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed space-y-1">
            <p className="font-bold text-white">Notice of Non-Affiliation and Disclaimer</p>
            <p className="text-amber-200/80">
              GTA 6 Atlas is an independent, unofficial fan site and community encyclopedia. We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Rockstar Games, Take-Two Interactive Software, Inc., or any of their subsidiaries or affiliates. The official Rockstar Games website can be found at <a href="https://www.rockstargames.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-white">rockstargames.com</a>.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1C2740] border border-[#33415C] flex items-center justify-center text-[#B8AAFF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-white">Rigorous Fact-Checking</h2>
            <p className="text-xs text-[#B5C0D4] leading-relaxed">
              Every coordinate, vehicle model, and gameplay feature is corroborated against official trailers, press releases, and patent filings to eliminate ungrounded speculation.
            </p>
          </div>

          <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1C2740] border border-[#33415C] flex items-center justify-center text-[#F3A398]">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-white">Interactive Spatial Tools</h2>
            <p className="text-xs text-[#B5C0D4] leading-relaxed">
              Our 4K high-definition satellite mapping engine allows explorers to inspect street grids, elevation contours, and collectibles with centimeter accuracy.
            </p>
          </div>

          <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1C2740] border border-[#33415C] flex items-center justify-center text-[#B8AAFF]">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-white">Community Driven</h2>
            <p className="text-xs text-[#B5C0D4] leading-relaxed">
              Built for the community, with community feedback. We continuously update our guides, comparison tools, and calculators as new intelligence surfaces.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
