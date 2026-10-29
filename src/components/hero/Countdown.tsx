"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
const RELEASE_DAY = "2026-11-19";
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
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, boundary - Date.now()));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
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
        className="font-display text-2xl sm:text-3xl font-bold"
      >
        GTA VI · {confirmed ? "" : "Expected "}
        {displayDate}
      </h2>
      <p className="text-sm text-white/90">
        {confirmed ? "Scheduled" : "Expected"} for PS5 and Xbox Series X|S.
      </p>
      {caption ? <p className="text-sm text-white/80">{caption}</p> : null}
      <div className="grid grid-cols-4 gap-2 sm:gap-4" aria-live="off">
        {cells.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/25 bg-black/65 px-2 py-5"
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
      <p className="text-xs text-white/85">
        {confirmed
          ? "Countdown to the calendar date at 00:00 UTC. Regional unlock times and preload timing are not established by this timer."
          : "Expected date — Rockstar has not confirmed an exact launch day; this timer counts to the expected calendar date at 00:00 UTC. Regional unlock times are not established by this timer."}
      </p>
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
          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=GTA+VI+${confirmed ? "scheduled" : "expected"}+release&dates=${calStart}/${calEnd}&details=${confirmed ? "Scheduled" : "Expected"}+calendar+date.+Regional+unlock+time+unconfirmed.+Source%3A+Rockstar+Games.+Tracked+by+Taish+Gaming.`}
          target="_blank"
          rel="noreferrer"
        >
          Add release date to calendar
        </a>
      </div>
    </section>
  );
}
