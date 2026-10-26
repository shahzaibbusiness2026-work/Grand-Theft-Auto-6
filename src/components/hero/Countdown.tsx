"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

// Timeline boundaries: Reveal Trailer (Dec 5, 2023) -> Target Launch (Nov 19, 2026)
const REVEAL_DATE = new Date("2023-12-05T00:00:00Z");
const LAUNCH_DATE = new Date(SITE_CONFIG.targetReleaseDate);
const PRELOAD_DATE = new Date("2026-11-12T00:00:00Z");

function getPreloadDaysLeft() {
  const ms = PRELOAD_DATE.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

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
  targetDate?: string;
  caption?: string;
  isConfirmed?: boolean;
}

export function Countdown({ className, targetDate, caption, isConfirmed }: CountdownProps) {
  const launchDate = useMemo(() => {
    if (targetDate) {
      const d = new Date(targetDate);
      if (!isNaN(d.getTime())) return d;
    }
    return LAUNCH_DATE;
  }, [targetDate]);

  // Constant first render, identical on server and client; the mount effect
  // below sets the real values once. Wall-clock initialisers made server and
  // client HTML differ on every load, so React discarded and rebuilt the
  // whole countdown — a visible flicker on every refresh.
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0 });
  const [stats, setStats] = useState({ percentage: 0, elapsedDays: 0, totalDays: 0, remainingDays: 0 });
  const [preloadDays, setPreloadDays] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [timezoneMode, setTimezoneMode] = useState<"local" | "vice">("local");
  const [copied, setCopied] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);


  useEffect(() => {
    setT(getRemainingTime(launchDate));
    setStats(getCompletionStats());
    setPreloadDays(getPreloadDaysLeft());
    setMounted(true);

    const interval = setInterval(() => {
      setT(getRemainingTime(launchDate));
      setStats(getCompletionStats());
      setPreloadDays(getPreloadDaysLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  // Format numbers without leading zeroes
  const formatNoLeadingZero = (num: number) => String(num);

  const handleCopy = () => {
    const text = `${t.days} days, ${t.hours} hours, ${t.minutes} minutes until Grand Theft Auto VI! (Tracked on Taish Gaming)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cells = useMemo(() => [
    { 
      label: "DAYS", 
      value: mounted ? formatNoLeadingZero(t.days) : "--", 
      subtext: "To Nov 19, 2026",
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
      <div className="pb-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: RELEASE TIMELINE & LIVE Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <p className="font-mono text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#00F0FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">
            RELEASE TIMELINE
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/50 rounded-full px-3 py-0.5 backdrop-blur-md shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <span className="relative flex w-2 h-2">
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
            </span>
            LIVE
          </span>
        </div>

        {/* Right: Action Pills */}
        <div className="flex items-center gap-2">
          {/* Timezone Switcher */}
          <button
            onClick={() => setTimezoneMode(prev => prev === "local" ? "vice" : "local")}
            className="inline-flex min-h-[44px] items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 hover:bg-black/80 border border-white/20 hover:border-[#00F0FF]/60 text-white transition-all backdrop-blur-md shadow-sm"
            title="Switch timezone view"
          >
            <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{timezoneMode === "local" ? "MY TIME" : "VICE CITY"}</span>
          </button>

          {/* Copy Countdown */}
          <button
            onClick={handleCopy}
            className="inline-flex min-h-[44px] items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 hover:bg-black/80 border border-white/20 hover:border-[#00F0FF]/60 text-white transition-all backdrop-blur-md shadow-sm"
            title="Copy countdown to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="text-[#00F0FF]">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>SHARE</span>
              </>
            )}
          </button>

          {/* Google Calendar Reminder */}
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#00D2FF] to-[#0066FF] hover:from-[#38BDF8] hover:to-[#0055EE] text-white transition-all shadow-[0_0_20px_rgba(0,210,255,0.45)] hover:shadow-[0_0_25px_rgba(0,210,255,0.65)] active:scale-95"
            title="Add release window to Google Calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span>REMIND ME</span>
          </a>
        </div>
      </div>

      {/* 2. 4-Column Responsive Digit Grid (Frosted Glass Cards with Cyan Accents) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-4 text-center" role="group" aria-label="Countdown units">
        {cells.map((cell) => {
          const isSelected = selectedUnit === cell.label;
          return (
            <button
              key={cell.label}
              type="button"
              onClick={() => setSelectedUnit(isSelected ? null : cell.label)}
              aria-label={`${cell.value} ${cell.label}${isSelected ? " (selected)" : ""}`}
              aria-pressed={isSelected}
              className={cn(
                "group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl transition-colors border",
                isSelected
                  ? "bg-black/50 border-[#00F0FF] shadow-[0_0_35px_rgba(0,240,255,0.4)] scale-[1.03]"
                  : "bg-black/55 border-white/20 hover:border-[#00F0FF]/60 hover:bg-black/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]"
              )}
            >
              {/* Digit display without leading zeros */}
              <span className="font-display tabular-nums text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                {cell.value}
              </span>

              {/* Unit Label */}
              <span className="mt-2.5 sm:mt-3 font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                {cell.label}
              </span>

              {/* Subtext */}
              <span className="mt-1.5 text-xs sm:text-xs text-white/70 font-mono font-medium">
                {cell.subtext}
              </span>

              {/* Active Unit Badge */}
              {isSelected && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/95 border border-[#00F0FF] text-xs font-mono text-[#00F0FF] whitespace-nowrap shadow-xl z-20 backdrop-blur-md">
                  {cell.tooltip}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Percentage Completion Progress Bar (Journey to Leonida) */}
      <div className="pt-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-[#00F0FF] -rotate-45 shrink-0 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            <span className="font-black uppercase tracking-wider text-xs sm:text-sm text-white">
              JOURNEY TO LEONIDA
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm">
            <span className="text-white/70 font-medium hidden sm:inline">
              {stats.elapsedDays.toLocaleString()} elapsed / {stats.remainingDays}d to go
            </span>
            <span className="font-bold text-sm sm:text-base text-[#00F0FF] tabular-nums drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]">
              {`${stats.percentage.toFixed(1)}%`}
            </span>
            <span className="text-white font-medium text-xs sm:text-sm">
              Complete
            </span>
          </div>
        </div>

        {/* The Animated Progress Track with Glowing Thumb Knob */}
        <div 
          className="relative w-full h-2.5 sm:h-3 rounded-full bg-black/60 border border-white/20 p-0 shadow-inner flex items-center"
          title={`Reveal to Launch Window: ${stats.percentage}% elapsed`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] shadow-[0_0_15px_#00F0FF] relative flex items-center justify-end"
            style={{ width: `${stats.percentage}%` }}
          >
            <span className="progress-shimmer" aria-hidden="true" />
            {/* Glowing White Thumb Knob at the tip */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-[#00D2FF] shadow-[0_0_12px_#00F0FF] z-10" />
          </div>
        </div>

        {/* Milestone Labels */}
        <div className="flex items-center justify-between text-xs sm:text-xs font-medium text-white/70">
          <span className="hidden sm:inline">Reveal Trailer (Dec 2023)</span>
          <span className="text-[#00F0FF] font-semibold drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">Current Intel</span>
          <span className="hidden sm:inline">Official Launch · Nov 19, 2026</span>
        </div>
      </div>

      {/* 4. Pre-load countdown */}
      <div className="pt-4 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#FF2E9A]/60 bg-[#FF2E9A]/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_16px_rgba(255,46,154,0.25)]">
          <span className="w-2 h-2 rounded-full bg-[#FF2E9A] shadow-[0_0_8px_#FF2E9A]" />
          <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-white">
            {mounted
              ? preloadDays > 0
                ? <>Pre-load in <span className="text-[#FF2E9A]">{preloadDays} day{preloadDays !== 1 ? "s" : ""}</span> — Nov 12</>
                : "Pre-load is live now"
              : "Pre-load — Nov 12"}
          </span>
        </span>
      </div>

      {/* 5. Footer Note */}
      <div className="pt-3 text-center">
        <p className="text-xs sm:text-xs text-white/70 font-medium">
          {caption || (isConfirmed ?? SITE_CONFIG.isReleaseDateConfirmed
            ? "Official Confirmed Launch Date"
            : "GTA VI releases November 19, 2026 · Pre-load begins November 12, 2026")}
        </p>
      </div>
    </div>
  );
}
