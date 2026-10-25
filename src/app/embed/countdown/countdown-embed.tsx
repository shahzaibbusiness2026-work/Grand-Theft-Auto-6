"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-11-19T00:00:00Z").getTime();

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownEmbed({ size }: { size: "small" | "medium" | "large" }) {
  const [now, setNow] = useState<number>(() => Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, TARGET - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000) % 24;
  const minutes = Math.floor(diff / 60_000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  const compact = size === "small";
  const numClass = compact ? "text-2xl" : size === "medium" ? "text-3xl" : "text-5xl";
  const labelClass = compact ? "text-[9px]" : "text-[10px]";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0B0F1A] px-3 text-white">
      {!compact && (
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#C9A86A]">
          Grand Theft Auto VI
        </p>
      )}
      {diff <= 0 && mounted ? (
        <p className={`${numClass} font-black tracking-wide text-[#FF2E9A]`}>OUT NOW</p>
      ) : (
        <div className="flex items-start gap-2 sm:gap-3">
          {[
            { value: mounted ? String(days) : "--", label: "Days" },
            { value: mounted ? pad(hours) : "--", label: "Hours" },
            { value: mounted ? pad(minutes) : "--", label: "Mins" },
            { value: mounted ? pad(seconds) : "--", label: "Secs" },
          ].map((cell) => (
            <div key={cell.label} className="flex flex-col items-center">
              <span className={`${numClass} font-black leading-none tabular-nums`}>{cell.value}</span>
              <span className={`${labelClass} mt-1 font-bold uppercase tracking-widest text-[#C9A86A]`}>
                {cell.label}
              </span>
            </div>
          ))}
        </div>
      )}
      <a
        href="https://www.taishgaming.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={`${compact ? "mt-1 text-[9px]" : "mt-2 text-[10px]"} font-semibold uppercase tracking-[0.2em] text-[#00F0FF] hover:underline`}
      >
        Taish Gaming — GTA 6 Countdown
      </a>
    </div>
  );
}
