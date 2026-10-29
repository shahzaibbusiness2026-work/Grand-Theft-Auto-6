"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
const RELEASE_DAY = "2026-11-19";
function ReleaseNote({ confirmed }: { confirmed: boolean }) {
  return (
    <p className="text-xs text-white/85">
      {confirmed ? "Scheduled calendar date" : "Expected calendar date; exact launch day unconfirmed"} at 00:00 UTC. Regional unlock times and
      preload timing are not established by this timer.
    </p>
  );
}
function ReleaseReferences({ calendarUrl }: { calendarUrl: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-5 text-sm">
      <a
        className="inline-flex min-h-11 items-center underline"
        href="https://www.rockstargames.com/VI"
        target="_blank"
        rel="noreferrer"
      >
        Rockstar release information
      </a>
      <a
        className="inline-flex min-h-11 items-center underline"
        href={calendarUrl}
        target="_blank"
        rel="noreferrer"
      >
        Add release date to calendar
      </a>
    </div>
  );
}
export function Countdown({
  className,
  targetDate,
  caption,
  isConfirmed,
}: {
  className?: string;
  targetDate?: string;
  caption?: string;
  isConfirmed?: boolean;
}) {
  // Honour the caller's date/confirmation instead of hardcoding the release day.
  // targetDate arrives as full ISO ("2026-11-19T00:00:00Z") — normalize to a
  // date-only string first, or an invalid Date crashes the prerender.
  const rawTarget = targetDate || RELEASE_DAY;
  const parsed = Date.parse(rawTarget);
  const target = Number.isFinite(parsed)
    ? new Date(parsed).toISOString().slice(0, 10)
    : RELEASE_DAY;
  const boundary = Date.parse(target + "T00:00:00Z");
  const confirmed = isConfirmed !== false;
  const displayDate = new Date(target + "T00:00:00Z").toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }
  );
  const calStart = target.replace(/-/g, "");
  const calEnd = new Date(boundary + 86400000)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=GTA+VI+${confirmed ? "scheduled" : "expected"}+release&dates=${calStart}/${calEnd}&details=Calendar+date.+Regional+unlock+time+unconfirmed.+Source%3A+Rockstar+Games.`;
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, boundary - Date.now()));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [boundary]);
  const seconds = remaining === null ? null : Math.floor(remaining / 1000);
  const cells = [
    ["Days", seconds === null ? "—" : Math.floor(seconds / 86400)],
    ["Hours", seconds === null ? "—" : Math.floor(seconds / 3600) % 24],
    ["Minutes", seconds === null ? "—" : Math.floor(seconds / 60) % 60],
    ["Seconds", seconds === null ? "—" : seconds % 60],
  ];
  return (
    <section
      className={cn("mx-auto w-full max-w-3xl space-y-4 text-white", className)}
      aria-labelledby="release-countdown-title"
    >
      <h2
        id="release-countdown-title"
        className="font-display text-xl sm:text-3xl font-bold"
      >
        GTA VI · {confirmed ? "" : "Expected "}
        {displayDate}
      </h2>
      <p className="text-sm text-white/90">
        {confirmed ? "Scheduled" : "Expected"} for PS5 and Xbox Series X|S.
      </p>
      {caption ? <p className="text-sm text-white/80">{caption}</p> : null}
      <div
        className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4"
        aria-live="off"
      >
        {cells.map(([label, value]) => (
          <div
            key={label}
            className={cn(
              "rounded-2xl border border-white/25 bg-black/65 px-2 py-4 sm:py-5",
              label === "Seconds" && "hidden sm:block",
            )}
          >
            <span className="block font-display text-3xl sm:text-5xl font-black tabular-nums">
              {value}
            </span>
            <span className="mt-2 block text-xs sm:text-sm text-white/90">
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="hidden space-y-4 sm:block">
        <ReleaseNote confirmed={confirmed} />
        <ReleaseReferences calendarUrl={calendarUrl} />
      </div>
      <details className="rounded-xl border border-white/25 bg-black/50 text-left sm:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 text-xs font-semibold [&::-webkit-details-marker]:hidden">
          Release details & calendar
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </summary>
        <div className="space-y-3 border-t border-white/20 px-4 py-3">
          <ReleaseNote confirmed={confirmed} />
          <ReleaseReferences calendarUrl={calendarUrl} />
        </div>
      </details>
    </section>
  );
}
