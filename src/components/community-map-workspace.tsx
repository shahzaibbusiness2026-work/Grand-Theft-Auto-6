"use client";
import { useEffect, useState } from "react";
import { SatelliteInteractiveMap } from "./satellite-interactive-map";
import type { AdminMapMarker } from "@/lib/admin-store";
import { usePlayerState } from "@/lib/use-player-state";
import { COMMUNITY_MAP_CREDIT } from "@/lib/community-map";
export function CommunityMapWorkspace({
  markers = [],
  playerMode = false,
}: {
  markers?: AdminMapMarker[];
  playerMode?: boolean;
}) {
  const [edition, setEdition] = useState<"community" | "legacy">("community");
  const state = usePlayerState();
  useEffect(() => {
    if (new URLSearchParams(location.search).get("edition") === "legacy")
      setEdition("legacy");
    const id = new URLSearchParams(location.search).get("poi");
    if (
      id &&
      !id.startsWith("gtadb-") &&
      !id.startsWith("personal-") &&
      markers.some((marker) => marker.id === id)
    )
      setEdition("legacy");
  }, [markers]);
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("poi");
    if (
      id &&
      state?.personalMarkers.some((pin) => pin.id === id && !pin.mapSpace)
    )
      setEdition("legacy");
  }, [state?.personalMarkers]);
  const oldPins =
    state?.personalMarkers.filter((pin) => !pin.mapSpace).length || 0;
  return (
    <div className="space-y-3">
      <label className="sm:hidden flex min-w-0 items-center gap-3 text-sm font-bold">
        Map layer
        <select
          className="min-w-0 flex-1 rounded-lg border border-border bg-card px-2 py-2.5 text-card-foreground"
          value={edition}
          onChange={(event) => {
            const next = event.target.value as "community" | "legacy";
            setEdition(next);
            const url = new URL(location.href);
            url.searchParams.delete("poi");
            if (next === "legacy") url.searchParams.set("edition", "legacy");
            else url.searchParams.delete("edition");
            history.replaceState({}, "", url);
          }}
        >
          <option value="community">Community reconstruction</option>
          <option value="legacy">
            Original planning illustration
            {oldPins ? ` (${oldPins} private pins)` : ""}
          </option>
        </select>
      </label>
      <div className="hidden sm:flex flex-wrap items-center gap-3 text-sm">
        <span className="font-bold">Map layer</span>
        <button
          className="player-button"
          aria-pressed={edition === "community"}
          onClick={() => {
            setEdition("community");
            const url = new URL(location.href);
            url.searchParams.delete("poi");
            url.searchParams.delete("edition");
            history.replaceState({}, "", url);
          }}
        >
          Community reconstruction
        </button>
        <button
          className="player-button"
          aria-pressed={edition === "legacy"}
          onClick={() => {
            setEdition("legacy");
            const url = new URL(location.href);
            url.searchParams.delete("poi");
            url.searchParams.set("edition", "legacy");
            history.replaceState({}, "", url);
          }}
        >
          Original planning illustration
          {oldPins ? ` (${oldPins} private pins)` : ""}
        </button>
      </div>
      <SatelliteInteractiveMap
        key={edition}
        edition={edition}
        initialMarkers={markers}
        playerMode={playerMode}
      />
      <p className="text-xs text-muted-foreground">
        {edition === "community"
          ? COMMUNITY_MAP_CREDIT
          : "Original illustrative planning canvas; coordinates do not transfer to the community reconstruction."}{" "}
        <a
          className="underline"
          href="https://map.gtadb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source project
        </a>
        {" · "}
        <a
          className="underline"
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          License
        </a>
        {" · "}
        <a className="underline" href="/maps/gtadb-yanis17/source.json">
          Snapshot & changes
        </a>
      </p>
    </div>
  );
}
