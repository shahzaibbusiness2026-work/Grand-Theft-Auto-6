"use client";

import Link from "next/link";
import { Car, Gauge, Zap, ArrowUpRight, Flame } from "lucide-react";
import type { DashboardVehicleItem } from "@/lib/services/queries";

interface CompanionVehiclesSectionProps {
  vehicles: DashboardVehicleItem[];
  totalVehicles: number;
}

export function CompanionVehiclesSection({
  vehicles = [],
  totalVehicles,
}: CompanionVehiclesSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 dark:border-white/10 border-slate-200 bg-[#0a0f1d]/90 dark:bg-[#0a0f1d]/90 light:bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)] ring-1 ring-gold/15 backdrop-blur-xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/30 to-gold/5 text-gold-light dark:text-gold-light border border-gold/40 shadow-[0_0_16px_rgba(201,168,106,0.35)]">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-extrabold uppercase tracking-wider text-white dark:text-white text-slate-900">
                MOTOR POOL & GARAGE
              </span>
              <span className="flex items-center gap-1 rounded-full bg-gold/15 dark:bg-gold/20 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-gold-light border border-gold/30">
                <Flame className="h-3 w-3 text-gold animate-pulse" />
                {totalVehicles} LISTED
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-500 mt-0.5">
              High-performance supercars, muscle legends, speedboats, and aircraft catalogued across Leonida
            </p>
          </div>
        </div>

        {/* Action Link to full vehicles */}
        <Link
          href="/vehicles"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-gold to-yellow-400 px-4 py-2 text-xs font-black text-slate-950 hover:brightness-110 transition-all active:scale-95 shadow-[0_8px_24px_rgba(201,168,106,0.4)]"
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
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] dark:border-white/[0.06] border-slate-200 bg-white/[0.02] dark:bg-white/[0.02] bg-slate-50/80 p-3.5 transition-all duration-300 hover:border-gold/50 hover:bg-white/[0.06] hover:shadow-[0_12px_32px_rgba(201,168,106,0.22)] hover:-translate-y-1 hover:ring-1 hover:ring-gold/40"
          >
            <div>
              {/* Vehicle image when the DB has one; text-only otherwise (no placeholder image) */}
              {veh.img ? (
                <div className="relative h-32 w-full overflow-hidden rounded-xl border border-white/10 dark:border-white/10 border-slate-200 bg-slate-900/60 mb-3">
                  <img
                    src={veh.img}
                    alt={veh.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {veh.class ? (
                    <div className="absolute top-2 left-2 rounded-lg bg-black/70 backdrop-blur-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-gold-light border border-white/10">
                      {veh.class}
                    </div>
                  ) : null}
                  {veh.priceDisplay ? (
                    <div className="absolute bottom-2 right-2 rounded-md bg-gold/90 px-2 py-0.5 font-mono text-xs font-black text-slate-950 shadow-sm">
                      {veh.priceDisplay}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {veh.class ? (
                    <span className="rounded-lg bg-black/70 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-gold-light border border-white/10">
                      {veh.class}
                    </span>
                  ) : null}
                  {veh.priceDisplay ? (
                    <span className="rounded-md bg-gold/90 px-2 py-0.5 font-mono text-xs font-black text-slate-950 shadow-sm">
                      {veh.priceDisplay}
                    </span>
                  ) : null}
                </div>
              )}

              {/* Title & Manufacturer */}
              <h4 className="font-display text-sm font-extrabold text-white dark:text-white text-slate-900 group-hover:text-gold-light transition-colors truncate">
                {veh.name}
              </h4>
              {veh.manufacturer ? (
                <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-500 font-medium truncate">
                  {veh.manufacturer}
                </p>
              ) : null}
            </div>

            {/* Performance Stats bar */}
            <div className="mt-3 grid grid-cols-2 gap-2 pt-2.5 border-t border-white/5 dark:border-white/5 border-slate-200/80 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-300 text-slate-700">
                <Gauge className="h-3 w-3 text-gold-light" />
                <span className="font-mono font-bold">{veh.topSpeed || "—"}</span>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-slate-300 dark:text-slate-300 text-slate-700">
                <Zap className="h-3 w-3 text-cyan-400" />
                <span className="font-mono font-bold">{veh.acceleration || "—"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
