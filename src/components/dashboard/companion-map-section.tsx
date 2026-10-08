"use client";

import Link from "next/link";
import { MapPin, Navigation, Compass, Radio, ArrowUpRight, ShieldCheck } from "lucide-react";
import type { LocationRecord } from "@/lib/services/locations";

interface CompanionMapSectionProps {
  locations: LocationRecord[];
  totalMarkers?: number;
  totalLocations?: number;
}

export function CompanionMapSection({
  locations = [],
  totalMarkers = 24,
  totalLocations = 14,
}: CompanionMapSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 dark:border-white/10 border-slate-200 bg-[#0a0f1d]/90 dark:bg-[#0a0f1d]/90 light:bg-white p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 text-[#00F0FF] dark:text-[#00F0FF] border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-extrabold uppercase tracking-wider text-white dark:text-white text-slate-900">
                LEONIDA TERRITORY MAP & SECTORS
              </span>
              <span className="flex items-center gap-1 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#00F0FF] border border-cyan-500/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                </span>
                LIVE RADAR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-500 mt-0.5">
              Live district telemetry, GPS waypoints, and verified points of interest
            </p>
          </div>
        </div>

        {/* Action Link to full map */}
        <Link
          href="/map"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-[#00F0FF] hover:bg-cyan-500/20 hover:border-cyan-500 transition-all active:scale-95 shadow-sm"
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Launch Full Interactive Map</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid: Live Mapped Locations */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {locations.map((loc) => (
          <Link
            key={loc.id}
            href={`/map?district=${encodeURIComponent(loc.district)}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] dark:border-white/[0.06] border-slate-200 bg-white/[0.02] dark:bg-white/[0.02] bg-slate-50/80 p-3.5 transition-all duration-300 hover:border-cyan-500/50 hover:bg-white/[0.06] hover:shadow-[0_8px_24px_rgba(0,240,255,0.12)] hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="rounded-lg bg-cyan-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-400 dark:text-cyan-400 text-cyan-600 border border-cyan-500/20">
                  {loc.type || "Territory"}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 dark:text-emerald-400 text-emerald-600">
                  <ShieldCheck className="h-3 w-3" />
                  {loc.verification === "verified" ? "Verified" : "Reported"}
                </span>
              </div>

              <h4 className="font-display text-sm font-bold text-white dark:text-white text-slate-900 group-hover:text-[#00F0FF] transition-colors truncate">
                {loc.name}
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-500 mt-0.5 truncate">
                {loc.district}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/5 dark:border-white/5 border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="font-mono text-slate-400 dark:text-slate-400 text-slate-500 truncate max-w-[140px]">
                {loc.coordinates || "Vice City GPS"}
              </span>
              <span className="text-[#00F0FF] font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                View <Navigation className="h-2.5 w-2.5 ml-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Mini Radar Satellite Footer Banner */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-[#0c1626]/40 to-transparent p-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-[#00F0FF]">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
          </div>
          <span className="text-slate-300 dark:text-slate-300 text-slate-700">
            Active Satellite Mesh:{" "}
            <strong className="text-white dark:text-white text-slate-900 font-semibold">{totalLocations} Districts</strong> and{" "}
            <strong className="text-cyan-400 dark:text-cyan-400 text-cyan-600 font-semibold">{totalMarkers} Verified Waypoints</strong> indexed from game trailers and official leaks.
          </span>
        </div>
        <Link
          href="/map"
          className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-cyan-400 dark:text-cyan-400 text-cyan-600 hover:underline"
        >
          Open Radar Grid &rarr;
        </Link>
      </div>
    </section>
  );
}
