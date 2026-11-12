"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
const RELEASE_DAY = SITE_CONFIG.targetReleaseDate.slice(0, 10);
function ReleaseNote({ confirmed, date }: { confirmed: boolean; date: string }) {
  const [year, month, day] = date.split("-").map(Number);
  const display = new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <p className="text-xs text-white/85">
      {confirmed ? "Scheduled release date: " : "Expected release date: "}
      {display}.
      {" "}This timer counts to midnight in your time zone on that date — Rockstar Support confirms GTA VI releases at midnight local time on November 19, 2026, in all regions.
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
  isConfirmed,
}: {
  className?: string;
  targetDate?: string;
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
  // Rockstar Support (last updated 3 Nov 2026): GTA VI releases at midnight
  // LOCAL time on 19 Nov 2026 in all regions, for both PS5 and Xbox Series
  // X|S. A single UTC target cannot represent that — it would read 5 hours
  // late in PKT and 5 hours early in US Eastern. Count to local midnight on
  // the release date in the visitor's own time zone instead. Only the date
  // part of targetDate is used, so a stored "T00:00:00Z" suffix is ignored.
  const [targetYear, targetMonth, targetDay] = target.split("-").map(Number);
  const boundary = new Date(targetYear, targetMonth - 1, targetDay, 0, 0, 0).getTime();
  const confirmed = isConfirmed !== false;
  const calStart = target.replace(/-/g, "");
  // All-day calendar event: end is the day after the release date, computed
  // in local date parts (adding 24h to a local-midnight timestamp then
  // converting to UTC would shift the date for time zones ahead of UTC).
  const calEndDate = new Date(targetYear, targetMonth - 1, targetDay + 1);
  const calEnd = `${calEndDate.getFullYear()}${String(calEndDate.getMonth() + 1).padStart(2, "0")}${String(calEndDate.getDate()).padStart(2, "0")}`;
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=GTA+VI+${confirmed ? "scheduled" : "expected"}+release&dates=${calStart}/${calEnd}&details=Releases+at+midnight+local+time.+Source%3A+Rockstar+Games.`;
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
    >
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
        <ReleaseNote confirmed={confirmed} date={target} />
        <ReleaseReferences calendarUrl={calendarUrl} />
      </div>
      <details className="rounded-xl border border-white/25 bg-black/50 text-left sm:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 text-xs font-semibold [&::-webkit-details-marker]:hidden">
          Release details & calendar
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </summary>
        <div className="space-y-3 border-t border-white/20 px-4 py-3">
          <ReleaseNote confirmed={confirmed} date={target} />
          <ReleaseReferences calendarUrl={calendarUrl} />
        </div>
      </details>
    </section>
  );
}
