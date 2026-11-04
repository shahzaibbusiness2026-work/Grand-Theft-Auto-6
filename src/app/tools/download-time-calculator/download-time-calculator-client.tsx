"use client";

import { useMemo, useState } from "react";

function formatDuration(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds <= 0) return "—";
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${Math.round(totalSeconds)}s`;
}

const SPEED_PRESETS = [25, 50, 100, 200, 500, 1000];
const PRELOAD_WINDOW_SECONDS = 9 * 86400;

export function DownloadTimeCalculatorClient() {
  const [speedMbps, setSpeedMbps] = useState(100);
  const [sizeGb, setSizeGb] = useState(212);
  const [efficiency, setEfficiency] = useState(85);

  const { idealSeconds, realisticSeconds, recommendedFreeGb, fitsWindow } =
    useMemo(() => {
      const ideal =
        speedMbps > 0 && sizeGb > 0 ? (sizeGb * 8000) / speedMbps : 0;
      const realistic =
        efficiency > 0 ? ideal / (efficiency / 100) : 0;
      return {
        idealSeconds: ideal,
        realisticSeconds: realistic,
        recommendedFreeGb: Math.ceil((sizeGb * 1.2) / 10) * 10,
        fitsWindow: realistic > 0 && realistic <= PRELOAD_WINDOW_SECONDS,
      };
    }, [speedMbps, sizeGb, efficiency]);

  const inputClass =
    "w-full rounded-xl border border-border bg-muted/70 p-3 text-sm font-mono text-foreground focus:border-accent focus:outline-none";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="card-surface rounded-2xl p-5">
        <div>
          <label
            htmlFor="dl-speed"
            className="mb-1.5 block text-xs font-bold text-muted-foreground"
          >
            Sustained download speed (Mbps)
          </label>
          <input
            id="dl-speed"
            type="number"
            min={1}
            step={10}
            value={speedMbps}
            onChange={(e) => setSpeedMbps(Math.max(1, Number(e.target.value)))}
            className={inputClass}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {SPEED_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setSpeedMbps(preset)}
                className={`rounded-full border px-3 py-1 text-xs font-bold ${
                  speedMbps === preset
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {preset} Mbps
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Use your sustained speed, not the advertised peak — run a speed
            test during the evening if you want the honest number.
          </p>
        </div>

        <div className="mt-5">
          <label
            htmlFor="dl-size"
            className="mb-1.5 block text-xs font-bold text-muted-foreground"
          >
            Game size (GB)
          </label>
          <input
            id="dl-size"
            type="number"
            min={1}
            step={1}
            value={sizeGb}
            onChange={(e) => setSizeGb(Math.max(1, Number(e.target.value)))}
            className={inputClass}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Default 212 GB: Rockstar’s official up-to figure for the pre-load
            file (November 3, 2026). Actual size varies by device.
          </p>
        </div>

        <div className="mt-5">
          <label
            htmlFor="dl-efficiency"
            className="mb-1.5 block text-xs font-bold text-muted-foreground"
          >
            Network efficiency ({efficiency}%)
          </label>
          <input
            id="dl-efficiency"
            type="range"
            min={50}
            max={100}
            step={5}
            value={efficiency}
            onChange={(e) => setEfficiency(Number(e.target.value))}
            className="w-full"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Wi-Fi overhead, server load and other traffic mean real downloads
            rarely hold 100%. 85% is a sensible default; wired connections can
            use 95%.
          </p>
        </div>
      </div>

      <div className="card-surface rounded-2xl p-5">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Results
        </p>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-sm text-muted-foreground">
              Ideal time (100% of your speed)
            </dt>
            <dd className="mt-1 font-display text-3xl font-black">
              {formatDuration(idealSeconds)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">
              Realistic time (at {efficiency}% efficiency)
            </dt>
            <dd className="mt-1 font-display text-3xl font-black text-primary">
              {formatDuration(realisticSeconds)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">
              Free space to keep
            </dt>
            <dd className="mt-1 text-lg font-bold">
              About {recommendedFreeGb} GB
            </dd>
            <dd className="mt-1 text-xs text-muted-foreground">
              The download itself plus room for installation. The final
              installed size may differ from the pre-load file.
            </dd>
          </div>
        </dl>
        <p className="mt-5 rounded-xl border border-border bg-muted/50 p-4 text-sm leading-relaxed">
          {fitsWindow
            ? "That fits comfortably inside the 9-day pre-load window (November 10–19). Start on November 10 and it will be ready well before launch."
            : "That is longer than the 9-day pre-load window (November 10–19). Start the moment pre-loading opens, use a wired connection if you can, and avoid pausing the download."}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          How the math works: time = size in megabits ÷ speed. {sizeGb} GB is{" "}
          {(sizeGb * 8000).toLocaleString()} megabits; at {speedMbps} Mbps
          that is {formatDuration(idealSeconds)} before efficiency losses.
        </p>
      </div>
    </div>
  );
}
