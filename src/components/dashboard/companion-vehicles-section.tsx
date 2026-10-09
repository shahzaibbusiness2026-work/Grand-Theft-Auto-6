"use client";

import Link from "next/link";
import { Car, Gauge, Zap, ArrowUpRight, Flame } from "lucide-react";
import type { DashboardVehicleItem } from "@/lib/services/queries";

interface CompanionVehiclesSectionProps {
  vehicles: DashboardVehicleItem[];
  totalVehicles?: number;
}

export function CompanionVehiclesSection({
  vehicles = [],
  totalVehicles = 12,
}: CompanionVehiclesSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 dark:border-white/10 border-slate-200 bg-[#0a0f1d]/90 dark:bg-[#0a0f1d]/90 light:bg-white p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/10 dark:bg-gold/15 text-gold-light dark:text-gold-light border border-gold/30 shadow-[0_0_12px_rgba(201,168,106,0.25)]">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-extrabold uppercase tracking-wider text-white dark:text-white text-slate-900">
                VERIFIED MOTOR POOL & GARAGE
              </span>
              <span className="flex items-center gap-1 rounded-full bg-gold/15 dark:bg-gold/20 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-gold-light border border-gold/30">
                <Flame className="h-3 w-3 text-gold animate-pulse" />
                {totalVehicles} CONFIRMED
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-500 mt-0.5">
              High-performance supercars, muscle legends, speedboats, and aircraft confirmed for Vice City
            </p>
          </div>
        </div>

        {/* Action Link to full vehicles */}
        <Link
          href="/vehicles"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs font-bold text-gold-light dark:text-gold-light text-gold-dark hover:bg-gold/20 hover:border-gold transition-all active:scale-95 shadow-sm"
        >
          <Car className="h-3.5 w-3.5" />
          <span>Explore All Vehicles</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid: Live Confirmed Vehicles */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map((veh) => (
          <Link
            key={veh.id}
            href={`/vehicles#${veh.id}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] dark:border-white/[0.06] border-slate-200 bg-white/[0.02] dark:bg-white/[0.02] bg-slate-50/80 p-3.5 transition-all duration-300 hover:border-gold/50 hover:bg-white/[0.06] hover:shadow-[0_8px_24px_rgba(201,168,106,0.15)] hover:-translate-y-0.5"
          >
            <div>
              {/* Vehicle Image Thumbnail with Class Tag */}
              <div className="relative h-32 w-full overflow-hidden rounded-xl border border-white/10 dark:border-white/10 border-slate-200 bg-slate-900/60 mb-3">
                <img
                  src={veh.img}
                  alt={veh.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-2 left-2 rounded-lg bg-black/70 backdrop-blur-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-gold-light border border-white/10">
                  {veh.class}
                </div>
                <div className="absolute bottom-2 right-2 rounded-md bg-gold/90 px-2 py-0.5 font-mono text-xs font-black text-slate-950 shadow-sm">
                  {veh.priceDisplay}
                </div>
              </div>

              {/* Title & Manufacturer */}
              <h4 className="font-display text-sm font-extrabold text-white dark:text-white text-slate-900 group-hover:text-gold-light transition-colors truncate">
                {veh.name}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-500 font-medium truncate">
                {veh.manufacturer || "State of Leonida"}
              </p>
            </div>

            {/* Performance Stats bar */}
            <div className="mt-3 grid grid-cols-2 gap-2 pt-2.5 border-t border-white/5 dark:border-white/5 border-slate-200/80 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-300 text-slate-700">
                <Gauge className="h-3 w-3 text-gold-light" />
                <span className="font-mono font-bold">{veh.topSpeed}</span>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-slate-300 dark:text-slate-300 text-slate-700">
                <Zap className="h-3 w-3 text-cyan-400" />
                <span className="font-mono font-bold">{veh.acceleration}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
