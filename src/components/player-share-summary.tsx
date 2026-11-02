"use client";
import { useState } from "react";
import { usePlayerState } from "@/lib/use-player-state";
import { usePlayerSync } from "./player-sync-provider";
export function PlayerShareSummary() {
  const state = usePlayerState();
  const { profile } = usePlayerSync();
  const [includeName, setIncludeName] = useState(false);
  if (!state) return null;
  const rows = [
    ["Saved vehicles", state.favorites.vehicles.length],
    ["Saved weapons", state.favorites.weapons.length],
    [
      "Personal goals complete",
      state.goals.filter((goal) => goal.completed).length,
    ],
    ["Saved loadouts", state.savedLoadouts.length],
  ] as const;
  const title =
    includeName && profile?.displayName
      ? `${profile.displayName} · My workspace`
      : "My Taish Gaming workspace";
  const escape = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  return (
    <section className="player-panel">
      <h2 className="text-lg font-bold">Share a workspace summary</h2>
      <p className="my-2 text-sm text-slate-400">
        Preview exactly what goes into the downloaded card. Notes, private pins
        and account email are excluded.
      </p>
      <div className="my-4 rounded-xl border border-gold/30 bg-[#070b14] p-5">
        <p className="font-bold">{title}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {rows.map(([label, count]) => (
            <p key={label} className="text-sm">
              <strong className="block text-xl text-gold-light">{count}</strong>
              {label}
            </p>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Manual planning snapshot · not official game completion
        </p>
      </div>
      <label className="mb-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeName}
          onChange={(event) => setIncludeName(event.target.checked)}
        />
        Include my display name
      </label>
      <button
        className="player-button"
        onClick={() => {
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600" viewBox="0 0 1000 600"><rect width="1000" height="600" rx="32" fill="#070b14"/><text x="60" y="75" fill="#c9a86a" font-family="sans-serif" font-size="24">TAISH GAMING</text><text x="60" y="135" fill="#fff" font-family="sans-serif" font-size="${title.length > 40 ? 24 : 32}">${escape(title)}</text>${rows.map(([label, count], index) => `<text x="${60 + (index % 2) * 470}" y="${235 + Math.floor(index / 2) * 130}" fill="#c9a86a" font-family="sans-serif" font-size="54">${count}</text><text x="${60 + (index % 2) * 470}" y="${270 + Math.floor(index / 2) * 130}" fill="#cbd5e1" font-family="sans-serif" font-size="22">${escape(label)}</text>`).join("")}<text x="60" y="510" fill="#94a3b8" font-family="sans-serif" font-size="20">Manual planning snapshot · not official game completion</text><text x="60" y="550" fill="#94a3b8" font-family="sans-serif" font-size="18">taishgaming.com · ${new Date().toISOString().slice(0, 10)}</text></svg>`;
          const url = URL.createObjectURL(
            new Blob([svg], { type: "image/svg+xml" }),
          );
          const link = document.createElement("a");
          link.href = url;
          link.download = "taishgaming-workspace-summary.svg";
          link.click();
          URL.revokeObjectURL(url);
        }}
      >
        Download summary card
      </button>
    </section>
  );
}
