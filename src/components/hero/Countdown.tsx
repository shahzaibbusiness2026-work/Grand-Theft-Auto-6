"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
const RELEASE_DAY = "2026-11-19";
const boundary = Date.parse(RELEASE_DAY + "T00:00:00Z");
export function Countdown({
  className,
}: {
  className?: string;
  targetDate?: string;
  caption?: string;
  isConfirmed?: boolean;
}) {
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
        GTA VI · November 19, 2026
      </h2>
      <p className="text-sm text-white/90">
        Scheduled for PS5 and Xbox Series X|S.
      </p>
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
        Countdown to the calendar date at 00:00 UTC. Regional unlock times and
        preload timing are not established by this timer.
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
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=GTA+VI+scheduled+release&dates=20261119/20261120&details=Scheduled+calendar+date.+Regional+unlock+time+unconfirmed.+Source%3A+Rockstar+Games.+Tracked+by+Taish+Gaming."
          target="_blank"
          rel="noreferrer"
        >
          Add release date to calendar
        </a>
      </div>
    </section>
  );
}
