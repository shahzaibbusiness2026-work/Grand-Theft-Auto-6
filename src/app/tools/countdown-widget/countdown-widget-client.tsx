"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Timer,
  Copy,
  Check,
  CalendarClock,
  Info,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Expected launch window (estimate) — Nov 19, 2026 00:00:00 UTC
const TARGET_DATE = new Date("2026-11-19T00:00:00Z");
const EMBED_BASE_URL = "https://www.taishgaming.com/embed/countdown";

type SizeId = "small" | "medium" | "large";

const SIZES: Record<SizeId, { label: string; hint: string; width: number; height: number }> = {
  small: { label: "Small", hint: "Sidebar / chat widget", width: 300, height: 150 },
  medium: { label: "Medium", hint: "Blog post / stream panel", width: 400, height: 200 },
  large: { label: "Large", hint: "Homepage hero / full overlay", width: 600, height: 250 },
};

const SIZE_ORDER: SizeId[] = ["small", "medium", "large"];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownWidgetClient() {
  const [size, setSize] = useState<SizeId>("medium");
  const [now, setNow] = useState<number>(() => Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = useMemo(() => {
    const diff = Math.max(0, TARGET_DATE.getTime() - now);
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor(diff / 3_600_000) % 24,
      minutes: Math.floor(diff / 60_000) % 60,
      seconds: Math.floor(diff / 1000) % 60,
      live: diff > 0,
    };
  }, [now]);

  const embedCode = useMemo(() => {
    const s = SIZES[size];
    return `<iframe src="${EMBED_BASE_URL}?size=${size}" width="${s.width}" height="${s.height}" frameborder="0" title="GTA 6 Countdown" loading="lazy"></iframe>`;
  }, [size]);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewSize = SIZES[size];
  const units = [
    { value: parts.days.toString(), label: "Days" },
    { value: pad(parts.hours), label: "Hours" },
    { value: pad(parts.minutes), label: "Mins" },
    { value: pad(parts.seconds), label: "Secs" },
  ];

  return (
    <div className="space-y-10">
      {/* Top row: size picker + target date info */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Size options */}
        <div className="lg:col-span-7 card-surface p-6 rounded-3xl border border-border shadow-xl">
          <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2 mb-4">
            <Maximize2 className="h-4 w-4 text-gold-light" /> Choose Your Size
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SIZE_ORDER.map((id) => {
              const s = SIZES[id];
              const active = size === id;
              return (
                <button
                  key={id}
                  onClick={() => setSize(id)}
                  className={cn(
                    "min-h-[44px] rounded-2xl border p-4 text-left transition-all",
                    active
                      ? "border-gold/40 bg-gold/10 shadow-sm"
                      : "border-border bg-muted/60 hover:border-border hover:bg-muted/80"
                  )}
                >
                  <span className={cn("block text-sm font-bold", active ? "text-gold-light" : "text-foreground")}>
                    {s.label}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{s.hint}</span>
                  <span className="block text-xs font-mono text-muted-foreground mt-1.5">
                    {s.width} × {s.height}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target date card */}
        <div className="lg:col-span-5 card-surface p-6 rounded-3xl border border-border">
          <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2 mb-3">
            <CalendarClock className="h-4 w-4 text-gold-light" /> Counting Down To
          </h2>
          <p className="font-display text-xl font-black text-foreground">November 19, 2026</p>
          <p className="text-xs text-muted-foreground mt-1">00:00:00 UTC &bull; expected launch window (estimate)</p>
          <p className="text-xs leading-relaxed text-muted-foreground mt-3 flex gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-gold-light" />
            Rockstar hasn&apos;t confirmed an exact hour, so this countdown targets the expected launch window. We&apos;ll tighten it the moment an official time drops.
          </p>
        </div>
      </div>

      {/* Live preview */}
      <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
            <Timer className="h-4 w-4 text-gold-light" /> Live Preview
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live
          </span>
        </div>

        {/* Widget preview (dark by design — this is how the embed looks on any site) */}
        <div className="flex justify-center overflow-x-auto py-2">
          <div
            className="bg-slate-950 rounded-2xl border border-gold/30 shadow-xl px-6 py-5 flex flex-col items-center gap-3 shrink-0"
            style={{ width: "100%", maxWidth: previewSize.width }}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-400">
              GTA 6 Launches In
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              {units.map((u) => (
                <div key={u.label} className="text-center">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-gold-light tabular-nums">
                    {u.value}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-0.5">
                    {u.label}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/"
              className="text-[10px] font-semibold text-neutral-500 hover:text-gold-light transition-colors inline-flex items-center gap-1"
            >
              Powered by Taish Gaming <ExternalLink className="h-2.5 w-2.5" />
            </Link>
            {!parts.live && (
              <span className="text-xs font-bold text-emerald-400">GTA 6 is out now — see you in Leonida!</span>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Preview shown at {previewSize.label} size ({previewSize.width} × {previewSize.height}). The real embed scales cleanly to its frame.
        </p>
      </div>

      {/* Embed code */}
      <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border">
        <h2 className="font-display text-base font-black uppercase text-foreground mb-3">Your Embed Code</h2>
        <textarea
          readOnly
          value={embedCode}
          rows={4}
          className="w-full rounded-xl border border-border bg-muted/70 p-4 text-xs font-mono text-foreground focus:border-gold/40 focus:outline-none resize-none"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Button
            onClick={handleCopy}
            className="min-h-[44px] bg-gold/20 hover:bg-gold/30 text-foreground border border-gold/40 text-xs font-bold"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1.5" />
            )}
            {copied ? "Embed code copied!" : "Copy embed code"}
          </Button>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-gold-light" />
            Copy the code above and paste it into your website to show the live countdown.
          </p>
        </div>
      </div>
    </div>
  );
}
