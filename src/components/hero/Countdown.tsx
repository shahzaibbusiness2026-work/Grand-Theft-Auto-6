"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  Globe2,
  Share2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

// Timeline boundaries: Reveal Trailer (Dec 5, 2023) -> Target Launch (Nov 19, 2026)
const REVEAL_DATE = new Date("2023-12-05T00:00:00Z");
const LAUNCH_DATE = new Date(SITE_CONFIG.targetReleaseDate);

function getRemainingTime(target: Date) {
  const now = Date.now();
  const ms = Math.max(0, target.getTime() - now);
  
  const totalDays = Math.floor(ms / 86_400_000);
  const totalHours = Math.floor(ms / 3_600_000);
  const totalMinutes = Math.floor(ms / 60_000);
  const totalSeconds = Math.floor(ms / 1_000);

  return {
    days: totalDays,
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1_000) % 60,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
  };
}

function getCompletionStats() {
  const totalDuration = LAUNCH_DATE.getTime() - REVEAL_DATE.getTime();
  const elapsedMs = Math.max(0, Math.min(totalDuration, Date.now() - REVEAL_DATE.getTime()));
  const pct = (elapsedMs / totalDuration) * 100;
  
  const elapsedDays = Math.floor(elapsedMs / 86_400_000);
  const totalDays = Math.floor(totalDuration / 86_400_000);
  const remainingDays = Math.max(0, totalDays - elapsedDays);

  return {
    percentage: Math.min(100, Math.max(0, Number(pct.toFixed(1)))),
    elapsedDays,
    totalDays,
    remainingDays,
  };
}

interface CountdownProps {
  className?: string;
}

export function Countdown({ className }: CountdownProps) {
  const [t, setT] = useState(() => getRemainingTime(LAUNCH_DATE));
  const [stats, setStats] = useState(() => getCompletionStats());
  const [mounted, setMounted] = useState(false);
  const [timezoneMode, setTimezoneMode] = useState<"local" | "vice">("local");
  const [copied, setCopied] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  useEffect(() => {
    setT(getRemainingTime(LAUNCH_DATE));
    setStats(getCompletionStats());
    setMounted(true);

    const interval = setInterval(() => {
      setT(getRemainingTime(LAUNCH_DATE));
      setStats(getCompletionStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format numbers without leading zeroes
  const formatNoLeadingZero = (num: number) => String(num);

  const handleCopy = () => {
    const text = `${t.days} days, ${t.hours} hours, ${t.minutes} minutes until Grand Theft Auto VI! (Tracked on GTA 6 Atlas)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cells = useMemo(() => [
    { 
      label: "DAYS", 
      value: mounted ? formatNoLeadingZero(t.days) : "--", 
      subtext: `${(t.days / 7).toFixed(1)} Wks`,
      tooltip: `${t.days} Days Total`
    },
    { 
      label: "HOURS", 
      value: mounted ? formatNoLeadingZero(t.hours) : "--", 
      subtext: `${t.totalHours.toLocaleString()} Total`,
      tooltip: `${t.totalHours.toLocaleString()} Hours Total`
    },
    { 
      label: "MINUTES", 
      value: mounted ? formatNoLeadingZero(t.minutes) : "--", 
      subtext: `${t.totalMinutes.toLocaleString()} Total`,
      tooltip: `${t.totalMinutes.toLocaleString()} Minutes Total`
    },
    { 
      label: "SECONDS", 
      value: mounted ? formatNoLeadingZero(t.seconds) : "--", 
      subtext: `${t.totalSeconds.toLocaleString()} Total`,
      tooltip: `${t.totalSeconds.toLocaleString()} Seconds Total`
    },
  ], [mounted, t]);

  const accessibleSummary = mounted
    ? `${t.days} days, ${t.hours} hours, ${t.minutes} minutes, and ${t.seconds} seconds remaining until launch. Journey is ${stats.percentage}% complete.`
    : "Countdown to Grand Theft Auto VI release";

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Grand+Theft+Auto+VI+Launch+Window&dates=20261119T000000Z/20261119T235959Z&details=Target+launch+window+for+Grand+Theft+Auto+VI+in+the+State+of+Leonida.+Tracked+by+GTA+6+Atlas.&location=Worldwide`;

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "relative w-full max-w-xl sm:max-w-3xl bg-transparent select-none",
        className
      )}
      role="region"
      aria-label="Grand Theft Auto VI Release Countdown"
    >
      <span className="sr-only" aria-live="off">
        {accessibleSummary}
      </span>

      {/* 1. Header Bar: Tag & Interactive Controls */}
      <div className="pb-3.5 border-b border-white/15 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 drop-shadow-[0_2px_10px_rgba(244,114,182,0.35)]">
            RELEASE TIMELINE
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-pink-400 bg-pink-950/40 border border-pink-500/30 rounded-full px-2.5 py-0.5 backdrop-blur-md shadow-[0_0_12px_rgba(236,72,153,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Timezone Switcher */}
          <button
            onClick={() => setTimezoneMode(prev => prev === "local" ? "vice" : "local")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-black/40 hover:bg-white/10 border border-white/15 hover:border-pink-500/40 text-slate-200 hover:text-white transition-all backdrop-blur-md shadow-sm"
            title="Switch timezone view"
          >
            <Globe2 className="w-3.5 h-3.5 text-pink-400" />
            <span>{timezoneMode === "local" ? "My Time" : "Vice City (EDT)"}</span>
          </button>

          {/* Copy Countdown */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-black/40 hover:bg-white/10 border border-white/15 hover:border-pink-500/40 text-slate-200 hover:text-white transition-all backdrop-blur-md shadow-sm"
            title="Copy countdown to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-pink-400" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Google Calendar Reminder */}
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white transition-all shadow-lg shadow-pink-500/25 active:scale-95"
            title="Add release window to Google Calendar"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Remind Me</span>
          </a>
        </div>
      </div>

      {/* 2. 4-Column Responsive Digit Grid (Totally Transparent Cards with Vice City Neon Accents) */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 py-5 text-center" aria-hidden="true">
        {cells.map((cell) => {
          const isSelected = selectedUnit === cell.label;
          return (
            <button
              key={cell.label}
              type="button"
              onClick={() => setSelectedUnit(isSelected ? null : cell.label)}
              className={cn(
                "group relative flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl transition-all border backdrop-blur-md",
                isSelected
                  ? "bg-pink-950/30 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.35)] scale-[1.03]"
                  : "bg-black/25 border-white/10 hover:border-pink-500/40 hover:bg-black/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)]"
              )}
            >
              {/* Digit display without leading zeros */}
              <span className="font-mono tabular-nums text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] drop-shadow-[0_0_24px_rgba(236,72,153,0.3)] group-hover:text-pink-200 transition-colors">
                {cell.value}
              </span>

              {/* Unit Label */}
              <span className="mt-2.5 font-mono text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-pink-400/90 drop-shadow group-hover:text-pink-300 transition-colors">
                {cell.label}
              </span>

              {/* Subtext */}
              <span className="mt-1 text-[9px] sm:text-[10px] text-slate-300/70 font-mono hidden sm:inline-block">
                {cell.subtext}
              </span>

              {/* Active Unit Badge */}
              {isSelected && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/90 border border-pink-500 text-[10px] font-mono text-pink-300 whitespace-nowrap shadow-xl z-10 backdrop-blur-md">
                  {cell.tooltip}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Percentage Completion Progress Bar (Vice City Neon Palette) */}
      <div className="pt-4 border-t border-white/15 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="font-black uppercase tracking-wider text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-purple-200 drop-shadow">
              Journey to Leonida
            </span>
          </div>
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span className="text-slate-300/80 text-[11px] hidden sm:inline drop-shadow">
              {stats.elapsedDays}d elapsed / {stats.remainingDays}d to go
            </span>
            <span className="font-black text-sm sm:text-base text-pink-400 tabular-nums drop-shadow-[0_0_12px_rgba(236,72,153,0.4)]">
              {mounted ? `${stats.percentage}%` : "--%"} <span className="text-[10px] font-normal text-slate-300/70">Complete</span>
            </span>
          </div>
        </div>

        {/* The Animated Progress Track */}
        <div 
          className="relative w-full h-3 rounded-full bg-black/50 border border-white/15 overflow-hidden backdrop-blur-sm p-0.5 shadow-inner"
          title={`Reveal to Launch Window: ${stats.percentage}% elapsed`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 via-pink-500 to-rose-400 transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(236,72,153,0.5)]"
            style={{ width: `${mounted ? stats.percentage : 0}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-white/35 animate-pulse" />
          </div>
        </div>

        {/* Milestone Labels */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300/80 drop-shadow-sm">
          <span>Reveal Trailer (Dec 2023)</span>
          <span className="text-pink-300 font-bold drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]">Current Intel</span>
          <span>Target Launch (Nov 2026)</span>
        </div>
      </div>

      {/* 4. Footer Note */}
      <div className="pt-3 text-center">
        <p className="font-mono text-[10px] sm:text-[11px] text-slate-400 font-medium drop-shadow-sm">
          {SITE_CONFIG.isReleaseDateConfirmed
            ? "Official Confirmed Launch Date"
            : "Anticipated window • Date to be confirmed by Rockstar Games"}
        </p>
      </div>
    </div>
  );
}
