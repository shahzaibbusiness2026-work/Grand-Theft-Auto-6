"use client";
import { useState } from "react";
import Link from "@/components/player-tool-link";
import { usePlayerState } from "@/lib/use-player-state";
import {
  getStoredUserState,
  saveStoredUserState,
  toggleFavorite,
} from "@/lib/user-store";
import { PLAYER_TOOLS } from "@/lib/player-state";
export function SavedWorkspace({
  labels,
  links,
  initialType,
  catalogUnavailable,
}: {
  labels: Record<string, string>;
  links: Record<string, string>;
  initialType: string;
  catalogUnavailable: boolean;
}) {
  const state = usePlayerState();
  const [type, setType] = useState(
    [
      "all",
      "vehicles",
      "weapons",
      "locations",
      "properties",
      "bookmarks",
      "loadouts",
    ].includes(initialType)
      ? initialType
      : "all",
  );
  const [search, setSearch] = useState("");
  if (!state)
    return <div className="player-panel">Loading your saved items…</div>;
  const favorites = (
    ["vehicles", "weapons", "locations", "properties"] as const
  ).flatMap((category) =>
    state.favorites[category].map((id) => ({
      category,
      id,
      title:
        (category === "locations"
          ? state.personalMarkers.find((marker) => marker.id === id)?.title
          : undefined) ||
        labels[`${category}:${id}`] ||
        `Saved ${category.slice(0, -1)} · ${id}`,
      path:
        category === "locations" &&
        state.personalMarkers.some((marker) => marker.id === id)
          ? `/dashboard/map?poi=${id}`
          : links[`${category}:${id}`] || `/${category}`,
    })),
  );
  const match = (title: string) =>
    title.toLowerCase().includes(search.toLowerCase());
  const visibleFavorites = favorites.filter(
    (item) => (type === "all" || type === item.category) && match(item.title),
  );
  const bookmarks = state.bookmarks.filter(
    (item) => (type === "all" || type === "bookmarks") && match(item.title),
  );
  const loadouts = state.savedLoadouts.filter(
    (item) => (type === "all" || type === "loadouts") && match(item.name),
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved items and tools</h1>
        <p className="mt-2 text-sm text-slate-400">
          Your favorite records, article bookmarks and loadouts.
        </p>
      </div>
      <section className="player-panel">
        <h2 className="text-lg font-bold">Pin your quick tools</h2>
        <p className="my-2 text-sm text-slate-400">
          Pinned tools appear on your dashboard.
        </p>
        <div className="flex flex-wrap gap-2">
          {PLAYER_TOOLS.map((tool) => (
            <button
              key={tool.path}
              className={`player-button ${state.pinnedTools.includes(tool.path) ? "player-button-primary" : ""}`}
              aria-pressed={state.pinnedTools.includes(tool.path)}
              onClick={() => {
                const current = getStoredUserState();
                saveStoredUserState({
                  ...current,
                  pinnedTools: current.pinnedTools.includes(tool.path)
                    ? current.pinnedTools.filter((path) => path !== tool.path)
                    : [...current.pinnedTools, tool.path],
                });
              }}
            >
              {state.pinnedTools.includes(tool.path) ? "✓ " : "+ "}
              {tool.label}
            </button>
          ))}
        </div>
      </section>
      <section className="player-panel">
        <div className="flex flex-wrap gap-3">
          <label className="flex-1">
            <span className="sr-only">Search saved items</span>
            <input
              className="player-input"
              placeholder="Search saved items…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label>
            <span className="sr-only">Item type</span>
            <select
              className="player-input"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {[
                "all",
                "vehicles",
                "weapons",
                "locations",
                "properties",
                "bookmarks",
                "loadouts",
              ].map((value) => (
                <option key={value} value={value}>
                  {value === "all" ? "All saved items" : value}
                </option>
              ))}
            </select>
          </label>
        </div>
        {catalogUnavailable && (
          <p className="my-3 text-sm text-amber-200">
            Some catalog names could not be loaded. Your saved records are
            retained.
          </p>
        )}
        {!visibleFavorites.length && !bookmarks.length && !loadouts.length && (
          <div className="py-10 text-center text-sm text-slate-400">
            No saved items match this view. Use the save button on a catalog
            record or article to add one.
          </div>
        )}
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {visibleFavorites.map((item) => (
            <article
              key={`${item.category}:${item.id}`}
              className="rounded-xl border border-white/10 p-4"
            >
              <p className="text-xs uppercase text-slate-400">
                {item.category}
              </p>
              <h2 className="my-2 break-words font-semibold">{item.title}</h2>
              <div className="flex flex-wrap gap-3">
                <Link href={item.path} className="text-sm text-gold-light">
                  {links[`${item.category}:${item.id}`] ||
                  item.path.includes("?poi=")
                    ? "Open record →"
                    : "Browse catalog →"}
                </Link>
                <button
                  className="text-sm text-rose-300"
                  onClick={() => toggleFavorite(item.category, item.id)}
                >
                  Remove saved item
                </button>
              </div>
            </article>
          ))}
          {bookmarks.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-white/10 p-4"
            >
              <p className="text-xs uppercase text-slate-400">{item.kind}</p>
              <Link
                href={item.path}
                className="my-2 block break-words font-semibold text-gold-light"
              >
                {item.title}
              </Link>
              <button
                className="text-sm text-rose-300"
                onClick={() => {
                  const current = getStoredUserState();
                  saveStoredUserState({
                    ...current,
                    bookmarks: current.bookmarks.filter(
                      (bookmark) => bookmark.id !== item.id,
                    ),
                  });
                }}
              >
                Remove bookmark
              </button>
            </article>
          ))}
          {loadouts.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-white/10 p-4"
            >
              <p className="text-xs uppercase text-slate-400">Loadout</p>
              <h2 className="my-2 break-words font-semibold">{item.name}</h2>
              <Link
                href="/tools/loadout-builder"
                className="text-sm text-gold-light"
              >
                Open loadout builder →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
