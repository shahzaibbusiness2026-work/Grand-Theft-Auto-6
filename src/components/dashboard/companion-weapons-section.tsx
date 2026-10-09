"use client";

import Link from "next/link";
import { Crosshair, ShieldAlert, Sparkles, ArrowUpRight, Wrench } from "lucide-react";
import type { DashboardWeaponItem } from "@/lib/services/queries";

interface CompanionWeaponsSectionProps {
  weapons: DashboardWeaponItem[];
  totalWeapons?: number;
}

export function CompanionWeaponsSection({
  weapons = [],
  totalWeapons = 10,
}: CompanionWeaponsSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 dark:border-white/10 border-slate-200 bg-[#0a0f1d]/90 dark:bg-[#0a0f1d]/90 light:bg-white p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5 dark:border-white/5 border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 dark:bg-rose-500/15 text-rose-400 dark:text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.25)]">
            <Crosshair className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-extrabold uppercase tracking-wider text-white dark:text-white text-slate-900">
                LEONIDA ARMORY & WEAPON CACHES
              </span>
              <span className="flex items-center gap-1 rounded-full bg-rose-500/15 dark:bg-rose-500/20 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-rose-400 border border-rose-500/30">
                <ShieldAlert className="h-3 w-3" />
                {totalWeapons} REGISTERED
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-500 mt-0.5">
              Service rifles, combat sidearms, suppressed SMGs, and tactical attachments cataloged across Leonida
            </p>
          </div>
        </div>

        {/* Action Link to full weapons */}
        <Link
          href="/weapons"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-1.5 text-xs font-bold text-rose-400 dark:text-rose-400 text-rose-600 hover:bg-rose-500/20 hover:border-rose-500 transition-all active:scale-95 shadow-sm"
        >
          <Crosshair className="h-3.5 w-3.5" />
          <span>Access Full Arsenal</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid: Live Confirmed Weapons */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {weapons.map((wep) => {
          // Parse damage like "68/100" into a percentage
          const dmgNum = parseInt(wep.damage.replace(/[^0-9]/g, ""), 10) || 50;

          return (
            <Link
              key={wep.id}
              href={`/weapons#${wep.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] dark:border-white/[0.06] border-slate-200 bg-white/[0.02] dark:bg-white/[0.02] bg-slate-50/80 p-4 transition-all duration-300 hover:border-rose-500/50 hover:bg-white/[0.06] hover:shadow-[0_8px_24px_rgba(244,63,94,0.15)] hover:-translate-y-0.5"
            >
              <div>
                {/* Category & Rarity tags */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded-lg bg-rose-500/10 px-2 py-0.5 font-mono text-xs font-bold text-rose-400 dark:text-rose-400 text-rose-600 border border-rose-500/20">
                    {wep.category}
                  </span>
                  <span className="font-mono text-xs font-black text-amber-400">
                    {wep.priceDisplay || "$10,000"}
                  </span>
                </div>

                {/* Name */}
                <h4 className="font-display text-sm font-extrabold text-white dark:text-white text-slate-900 group-hover:text-rose-400 transition-colors truncate">
                  {wep.name}
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-500 font-medium truncate mt-0.5">
                  {wep.acquisitionMethod}
                </p>

                {/* Damage meter */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>Firepower</span>
                    <span className="font-mono text-rose-400 font-bold">{wep.damage}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 dark:bg-white/10 bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, dmgNum))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Attachments Footer */}
              <div className="mt-3.5 pt-2.5 border-t border-white/5 dark:border-white/5 border-slate-200/80 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-400 dark:text-slate-400 text-slate-500">
                  <Wrench className="h-3 w-3 text-cyan-400" />
                  {wep.attachments && wep.attachments.length > 0
                    ? `${wep.attachments.length} Mod Slots`
                    : "Standard Issue"}
                </span>
                <span className="text-rose-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  Armory Details &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
