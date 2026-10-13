"use client";

import { useState, useMemo } from "react";
import {
  SunMoon,
  Sun,
  Moon,
  Clock,
  ArrowRightLeft,
  Copy,
  Check,
  Info,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Classic GTA time scale: 1 in-game hour = 2 real-world minutes (estimate until launch confirms)
const GAME_MINUTES_PER_REAL_MINUTE = 30;
const MINUTES_PER_GAME_DAY = 1440;

type Mode = "real-to-game" | "game-to-real";

function parseTime(hhmm: string): number {
  const [h = "0", m = "0"] = hhmm.split(":");
  return (Number(h) % 24) * 60 + (Number(m) % 60);
}

function formatGameTime(totalMinutes: number): string {
  const m = ((Math.round(totalMinutes) % MINUTES_PER_GAME_DAY) + MINUTES_PER_GAME_DAY) % MINUTES_PER_GAME_DAY;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function gamePhase(minutes: number): { label: string; icon: "sun" | "moon" } {
  const h = ((minutes % MINUTES_PER_GAME_DAY) + MINUTES_PER_GAME_DAY) % MINUTES_PER_GAME_DAY / 60;
  if (h >= 5 && h < 7) return { label: "Dawn", icon: "sun" };
  if (h >= 7 && h < 11) return { label: "Morning", icon: "sun" };
  if (h >= 11 && h < 15) return { label: "Midday", icon: "sun" };
  if (h >= 15 && h < 18) return { label: "Afternoon", icon: "sun" };
  if (h >= 18 && h < 20) return { label: "Sunset", icon: "sun" };
  return { label: "Night", icon: "moon" };
}

function formatRealWait(realMinutes: number): string {
  if (realMinutes <= 0) return "right now";
  if (realMinutes < 1) return "under a minute";
  if (realMinutes < 60) {
    const m = Math.round(realMinutes);
    return `${m} real minute${m === 1 ? "" : "s"}`;
  }
  const h = Math.floor(realMinutes / 60);
  const m = Math.round(realMinutes % 60);
  return m === 0
    ? `${h} real hour${h === 1 ? "" : "s"}`
    : `${h}h ${m}m real time`;
}

export function DayNightConverterClient() {
  const [mode, setMode] = useState<Mode>("real-to-game");
  const [currentGameTime, setCurrentGameTime] = useState("12:00");
  const [realMinutes, setRealMinutes] = useState<number>(30);
  const [targetGameTime, setTargetGameTime] = useState("06:00");
  const [copied, setCopied] = useState(false);

  const QUICK_DURATIONS = [15, 30, 60, 120];
  const PRESETS: { label: string; time: string }[] = [
    { label: "Next sunrise", time: "06:00" },
    { label: "Next sunset", time: "19:00" },
    { label: "Midnight", time: "00:00" },
    { label: "High noon", time: "12:00" },
  ];

  const result = useMemo(() => {
    const nowGameMin = parseTime(currentGameTime);
    if (mode === "real-to-game") {
      const gameMinAfter = nowGameMin + Math.max(0, realMinutes) * GAME_MINUTES_PER_REAL_MINUTE;
      const phase = gamePhase(gameMinAfter);
      return {
        headline: formatGameTime(gameMinAfter),
        headlineCaption: `In-game time after ${Math.max(0, realMinutes)} real minute${realMinutes === 1 ? "" : "s"}`,
        phase: phase.label,
        phaseIcon: phase.icon,
        markerGameMin: ((Math.round(gameMinAfter) % MINUTES_PER_GAME_DAY) + MINUTES_PER_GAME_DAY) % MINUTES_PER_GAME_DAY,
        secondary: `${Math.max(0, realMinutes)} real min = ${(Math.max(0, realMinutes) * GAME_MINUTES_PER_REAL_MINUTE / 60).toFixed(1)} game hours`,
      };
    }
    // game-to-real
    const targetMin = parseTime(targetGameTime);
    const gameMinUntil = ((targetMin - nowGameMin) % MINUTES_PER_GAME_DAY + MINUTES_PER_GAME_DAY) % MINUTES_PER_GAME_DAY;
    const waitRealMin = gameMinUntil / GAME_MINUTES_PER_REAL_MINUTE;
    const phase = gamePhase(targetMin);
    return {
      headline: formatRealWait(waitRealMin),
      headlineCaption: `Real time until ${formatGameTime(targetMin)} game time`,
      phase: phase.label,
      phaseIcon: phase.icon,
      markerGameMin: targetMin,
      secondary: `${(gameMinUntil / 60).toFixed(1)} game hours away from ${formatGameTime(nowGameMin)}`,
    };
  }, [mode, currentGameTime, realMinutes, targetGameTime]);

  const handlePreset = (time: string) => {
    setTargetGameTime(time);
    setMode("game-to-real");
  };

  const handleCopySummary = () => {
    const summary = mode === "real-to-game"
      ? `GTA 6 Time Conversion: ${Math.max(0, realMinutes)} real minutes from ${formatGameTime(parseTime(currentGameTime))} = ${result.headline} in-game (${result.phase}). Rate: 1 game hour = 2 real minutes (estimate).`
      : `GTA 6 Time Conversion: from ${formatGameTime(parseTime(currentGameTime))}, target ${formatGameTime(parseTime(targetGameTime))} (${result.phase}) arrives in ${result.headline}. Rate: 1 game hour = 2 real minutes (estimate).`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PhaseIcon = result.phaseIcon === "sun" ? Sun : Moon;

  return (
    <div className="space-y-10">
      {/* Mode Toggle */}
      <div className="card-surface p-4 rounded-2xl border border-border flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
          <ArrowRightLeft className="h-3.5 w-3.5 text-gold-light" /> Conversion Mode:
        </span>
        {(
          [
            { id: "real-to-game", label: "Real → Game" },
            { id: "game-to-real", label: "Game → Real" },
          ] as { id: Mode; label: string }[]
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-semibold transition-all border",
              mode === m.id
                ? "border-accent bg-accent/20 text-foreground font-bold shadow-sm"
                : "border-border bg-muted/60 text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Main Converter Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* INPUTS COLUMN (5 cols) */}
        <div className="lg:col-span-5 card-surface p-6 rounded-3xl border border-border shadow-xl space-y-5">
          <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2 pb-3 border-b border-border">
            <Clock className="h-4 w-4 text-accent" /> Time Parameters
          </h2>

          {/* Current in-game time */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">
              Current In-Game Time (HH:MM)
            </label>
            <input
              type="time"
              value={currentGameTime}
              onChange={(e) => e.target.value && setCurrentGameTime(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/70 p-3 text-sm font-mono text-foreground focus:border-accent focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Read this off your in-game phone or pause menu clock.
            </p>
          </div>

          {mode === "real-to-game" ? (
            /* Real → Game: duration input */
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5 flex justify-between">
                <span>Real Minutes You Will Play</span>
                <span className="font-mono text-gold-light font-bold">{realMinutes} min</span>
              </label>
              <input
                type="range"
                min={1}
                max={180}
                step={1}
                value={realMinutes}
                onChange={(e) => setRealMinutes(Number(e.target.value))}
                className="w-full accent-gold"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setRealMinutes(d)}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border",
                      realMinutes === d
                        ? "border-accent bg-accent/20 text-foreground font-bold"
                        : "border-border bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {d >= 60 ? `${d / 60}h` : `${d}m`}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Game → Real: target game time input */
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                Target In-Game Time (HH:MM)
              </label>
              <input
                type="time"
                value={targetGameTime}
                onChange={(e) => e.target.value && setTargetGameTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/70 p-3 text-sm font-mono text-foreground focus:border-accent focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                When do you want it to be in Leonida? We&apos;ll tell you how long to wait.
              </p>
            </div>
          )}
        </div>

        {/* OUTPUTS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Result Card */}
          <div className="card-surface p-6 rounded-3xl border border-border shadow-2xl">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground">{result.headlineCaption}</span>
                <div className="font-display text-3xl sm:text-4xl font-black text-foreground mt-0.5">
                  {result.headline}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{result.secondary}</p>
              </div>
              <div className="text-center rounded-2xl border border-border bg-muted/60 px-5 py-3">
                <PhaseIcon className={cn("h-6 w-6 mx-auto mb-1", result.phaseIcon === "sun" ? "text-gold-light" : "text-muted-foreground")} />
                <span className="font-mono text-sm font-black text-foreground">{result.phase}</span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Day Phase</span>
              </div>
            </div>

            {/* Sun Position Indicator */}
            <div className="mt-6">
              <span className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-1.5 mb-2">
                <SunMoon className="h-3.5 w-3.5 text-gold-light" /> Sun Position
              </span>
              <div className="relative pt-2">
                {/* Sky bar */}
                <div
                  className="relative h-10 w-full rounded-full border border-border overflow-visible"
                  style={{
                    background:
                      "linear-gradient(to right, #1b2340 0%, #1b2340 20%, #b4643c 21%, #e8a15c 25%, #7fb8d9 29%, #4a90c2 50%, #7fb8d9 71%, #e88a5c 75%, #b4643c 79%, #1b2340 80%, #1b2340 100%)",
                  }}
                >
                  {/* Marker */}
                  <div
                    className="absolute -top-1.5 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${(result.markerGameMin / MINUTES_PER_GAME_DAY) * 100}%`, transform: "translateX(-50%)" }}
                  >
                    <div className="rounded-full border-2 border-background bg-card p-1.5 shadow-lg">
                      {result.phaseIcon === "sun" ? (
                        <Sun className="h-4 w-4 text-gold-light" />
                      ) : (
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="mt-0.5 h-8 w-0.5 bg-foreground/70 rounded-full" />
                  </div>
                </div>
                {/* Tick labels */}
                <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1 px-0.5">
                  <span>00</span>
                  <span>06</span>
                  <span>12</span>
                  <span>18</span>
                  <span>24</span>
                </div>
              </div>
            </div>

            {/* Copy action */}
            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCopySummary}
                className="bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                <span>{copied ? "Conversion Copied!" : "Copy Conversion"}</span>
              </Button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-light" /> Quick Presets
            </h3>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p.time)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-semibold transition-all border flex items-center gap-1.5",
                    mode === "game-to-real" && targetGameTime === p.time
                      ? "border-accent bg-accent/20 text-foreground font-bold"
                      : "border-border bg-muted/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p.label === "Next sunrise" && <Sun className="h-3.5 w-3.5 text-gold-light" />}
                  {p.label === "Midnight" && <Moon className="h-3.5 w-3.5" />}
                  {p.label}
                  <span className="font-mono text-muted-foreground">{p.time}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Presets compute the real-world wait from your current in-game time to that target, wrapping past midnight.
            </p>
          </div>
        </div>
      </div>

      {/* DISCLAIMER & FAQ */}
      <div className="grid gap-6 md:grid-cols-2 pt-6 border-t border-border">
        <div className="card-surface p-6 rounded-3xl border border-border space-y-3">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Info className="h-4 w-4 text-gold-light" /> About the Time Scale
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Every classic GTA title runs at roughly <strong className="text-foreground">1 in-game hour = 2 real-world minutes</strong> — one full 24-hour Leonida day takes about 48 real minutes. This is an estimate based on the series&apos; long-standing ratio; Rockstar may tune the clock for GTA 6, and we&apos;ll update this tool once launch-day timing is verified.
          </p>
        </div>

        <div className="card-surface p-6 rounded-3xl border border-border space-y-3">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-accent" /> Day/Night Converter FAQ
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Why does &ldquo;wait&rdquo; wrap past midnight?</strong> In-game time is a 24-hour loop, so asking for 06:00 when it&apos;s 23:00 means waiting 7 game hours (14 real minutes) through midnight, not going backwards.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Can I pause the clock?</strong> The in-game clock only advances while you&apos;re in the session — the converter assumes continuous play.
          </p>
        </div>
      </div>
    </div>
  );
}
