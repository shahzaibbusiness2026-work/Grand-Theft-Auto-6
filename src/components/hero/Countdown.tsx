"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Official Release: November 19, 2026 at 00:00 UTC
const LAUNCH = new Date("2026-11-19T00:00:00Z");

function diff() {
  const ms = Math.max(0, LAUNCH.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1_000) % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

interface CountdownProps {
  className?: string;
}

export function Countdown({ className }: CountdownProps) {
  const [t, setT] = useState({ days: 619, hours: 14, minutes: 22, seconds: 48 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setT(diff());
    setMounted(true);
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { value: mounted ? String(t.days) : "619", label: "DAYS", isHighlight: true },
    { value: mounted ? pad(t.hours) : "14", label: "HOURS", isHighlight: false },
    { value: mounted ? pad(t.minutes) : "22", label: "MINUTES", isHighlight: false },
    { value: mounted ? pad(t.seconds) : "48", label: "SECONDS", isHighlight: false },
  ];

  return (
    <div
      suppressHydrationWarning
      className={cn("inline-flex items-center justify-center select-none", className)}
      aria-label="GTA 6 Countdown"
    >
      {/* Countdown 4 Individual Boxes with Amber Colon Dots */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-4 shrink-0">
        {cells.map((cell, index) => (
          <div key={cell.label} className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-4 shrink-0">
            {/* Individual Countdown Box with Fixed Width and Tabular Digits */}
            <div
              className={cn(
                "relative group flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl shrink-0",
                "border border-border/80 bg-card/90 dark:border-white/15 dark:bg-slate-950/70 backdrop-blur-xl",
                "py-3 sm:py-5 md:py-6 lg:py-7",
                "w-[74px] sm:w-[104px] md:w-[120px] lg:w-[134px]",
                "shadow-card-light dark:shadow-[0_12px_32px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.18)]",
                "transition-[border-color,box-shadow,transform] duration-200 hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:-translate-y-1"
              )}
            >
              <span className="font-display tabular-nums text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-none tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] select-none">
                {cell.value}
              </span>
              <span
                className={cn(
                  "mt-1.5 sm:mt-2.5 font-mono text-[9px] sm:text-xs font-black uppercase tracking-[0.25em] select-none",
                  cell.isHighlight ? "text-amber-500 dark:text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-muted-foreground"
                )}
              >
                {cell.label}
              </span>
            </div>

            {/* Glowing Colon Separator (except after the last item) */}
            {index < cells.length - 1 && (
              <div
                className="w-2 sm:w-3 md:w-3.5 flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 text-amber-400 select-none shrink-0"
                aria-hidden="true"
              >
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
