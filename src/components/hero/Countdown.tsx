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
        "relative w-full max-w-xl sm:max-w-2xl rounded-2xl border border-white/15 bg-[#141C2E]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] select-none",
        className
      )}
      role="region"
      aria-label="Grand Theft Auto VI Release Countdown"
    >
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#B8AAFF]/20 via-[#F3A398]/15 to-[#6340CC]/20 blur-xl opacity-60 -z-10" />

      <span className="sr-only" aria-live="off">
        {accessibleSummary}
      </span>

      {/* 1. Header Bar: Tag & Interactive Controls */}
      <div className="pb-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#B5C0D4]">
            RELEASE TIMELINE
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Timezone Switcher */}
          <button
            onClick={() => setTimezoneMode(prev => prev === "local" ? "vice" : "local")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#1C2740] hover:bg-[#253352] border border-[#33415C] text-[#B5C0D4] hover:text-white transition-colors"
            title="Switch timezone view"
          >
            <Globe2 className="w-3 h-3 text-[#B8AAFF]" />
            <span>{timezoneMode === "local" ? "My Time" : "Vice City (EDT)"}</span>
          </button>

          {/* Copy Countdown */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#1C2740] hover:bg-[#253352] border border-[#33415C] text-[#B5C0D4] hover:text-white transition-colors"
            title="Copy countdown to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#B8AAFF]" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Google Calendar Reminder */}
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#B8AAFF] hover:bg-[#A898F0] text-[#171127] transition-colors font-black"
            title="Add release window to Google Calendar"
          >
            <Calendar className="w-3 h-3" />
            <span>Remind Me</span>
          </a>
        </div>
      </div>

      {/* 2. 4-Column Responsive Digit Grid (No leading zero) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 py-4 text-center" aria-hidden="true">
        {cells.map((cell) => {
          const isSelected = selectedUnit === cell.label;
          return (
            <button
              key={cell.label}
              type="button"
              onClick={() => setSelectedUnit(isSelected ? null : cell.label)}
              className={cn(
                "group relative flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl transition-all border",
                isSelected
                  ? "bg-[#1C2740] border-[#B8AAFF] shadow-lg shadow-[#B8AAFF]/15 scale-[1.03]"
                  : "bg-[#0B1020]/75 border-white/10 hover:border-[#B8AAFF]/50 hover:bg-[#1C2740]/60"
              )}
            >
              {/* Digit display without leading zeros */}
              <span className="font-mono tabular-nums text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none group-hover:text-[#B8AAFF] transition-colors">
                {cell.value}
              </span>

              {/* Unit Label */}
              <span className="mt-2 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#94A3BD] group-hover:text-white transition-colors">
                {cell.label}
              </span>

              {/* Subtext */}
              <span className="mt-1 text-[9px] sm:text-[10px] text-[#B5C0D4]/70 font-mono hidden sm:inline-block">
                {cell.subtext}
              </span>

              {/* Active Unit Badge */}
              {isSelected && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#1C2740] border border-[#B8AAFF] text-[9px] font-mono text-[#B8AAFF] whitespace-nowrap shadow-md z-10">
                  {cell.tooltip}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Percentage Completion Progress Bar */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B8AAFF]" />
            <span className="font-bold uppercase tracking-wider text-[11px] text-white">
              Journey to Leonida
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#94A3BD] text-[11px] hidden sm:inline">
              {stats.elapsedDays}d elapsed / {stats.remainingDays}d to go
            </span>
            <span className="font-black text-sm text-[#B8AAFF] tabular-nums">
              {mounted ? `${stats.percentage}%` : "--%"} <span className="text-[10px] font-normal text-[#94A3BD]">Complete</span>
            </span>
          </div>
        </div>

        {/* The Animated Progress Track */}
        <div 
          className="relative w-full h-2.5 rounded-full bg-[#0B1020] border border-white/10 overflow-hidden"
          title={`Reveal to Launch Window: ${stats.percentage}% elapsed`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6340CC] via-[#B8AAFF] to-[#F3A398] transition-all duration-1000 ease-out relative"
            style={{ width: `${mounted ? stats.percentage : 0}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-white/25 animate-pulse" />
          </div>
        </div>

        {/* Milestone Labels */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3BD]">
          <span>Reveal Trailer (Dec 2023)</span>
          <span className="text-[#B5C0D4]">Current Intel</span>
          <span>Target Launch (Nov 2026)</span>
        </div>
      </div>

      {/* 4. Footer Note */}
      <div className="pt-2 text-center">
        <p className="font-mono text-[10px] sm:text-[11px] text-[#94A3BD] font-medium">
          {SITE_CONFIG.isReleaseDateConfirmed
            ? "Official Confirmed Launch Date"
            : "Anticipated window • Date to be confirmed by Rockstar Games"}
        </p>
      </div>
    </div>
  );
}
