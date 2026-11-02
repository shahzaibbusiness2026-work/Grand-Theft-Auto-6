"use client";
import { useState } from "react";
import Link from "@/components/player-tool-link";
import { usePlayerState } from "@/lib/use-player-state";
import { getStoredUserState, saveStoredUserState } from "@/lib/user-store";
import { PlayerShareSummary } from "@/components/player-share-summary";
type Choice = { id: string; name: string };
export function PlayerCollections({
  vehicles,
  weapons,
}: {
  vehicles: Choice[];
  weapons: Choice[];
}) {
  const state = usePlayerState();
  const [name, setName] = useState("");
  const [comparisonName, setComparisonName] = useState("");
  const [kind, setKind] = useState<"vehicles" | "weapons">("vehicles");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  if (!state) return <div className="player-panel">Loading collections…</div>;
  const choices = kind === "vehicles" ? vehicles : weapons;
  const savedOptions = [
    ...(["vehicles", "weapons", "locations", "properties"] as const).flatMap(
      (category) =>
        state.favorites[category].map((id) => ({
          key: `${category}:${id}`,
          label: `${category} · ${[...vehicles, ...weapons].find((item) => item.id === id)?.name || state.personalMarkers.find((item) => item.id === id)?.title || id}`,
        })),
    ),
    ...state.bookmarks.map((item) => ({
      key: `bookmark:${item.id}`,
      label: item.title,
    })),
    ...state.savedLoadouts.map((item) => ({
      key: `loadout:${item.id}`,
      label: item.name,
    })),
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Collections and saved comparisons
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Advanced workspace tools are free. Organize your saved records and
          reopen named comparison sets.
        </p>
      </div>
      <PlayerShareSummary />
      {message && (
        <p role="status" className="text-sm text-emerald-200">
          {message}
        </p>
      )}
      <section className="player-panel">
        <h2 className="text-lg font-bold">Your collections</h2>
        <form
          className="my-4 flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            const current = getStoredUserState();
            if (current.collections.length >= 50) {
              setMessage("The limit is 50 collections.");
              return;
            }
            if (
              saveStoredUserState({
                ...current,
                collections: [
                  ...current.collections,
                  { id: crypto.randomUUID(), name: name.trim(), items: [] },
                ],
              })
            )
              setName("");
          }}
        >
          <label className="flex-1">
            <span className="sr-only">Collection name</span>
            <input
              required
              maxLength={100}
              className="player-input"
              value={name}
              placeholder="Name a collection"
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <button className="player-button player-button-primary">
            Create collection
          </button>
        </form>
        {!state.collections.length && (
          <p className="text-sm text-slate-400">
            Create a collection for a trip plan, a vehicle wishlist or articles
            to read later.
          </p>
        )}
        <div className="grid gap-3 lg:grid-cols-2">
          {state.collections.map((collection) => (
            <article
              key={collection.id}
              className="rounded-xl border border-white/10 p-4"
            >
              <label className="player-label">
                Collection name
                <input
                  maxLength={100}
                  className="player-input"
                  value={collection.name}
                  onChange={(event) => {
                    const current = getStoredUserState();
                    saveStoredUserState({
                      ...current,
                      collections: current.collections.map((item) =>
                        item.id === collection.id
                          ? { ...item, name: event.target.value }
                          : item,
                      ),
                    });
                  }}
                />
              </label>
              <p className="my-3 text-xs text-slate-400">
                {collection.items.length} items. Select saved records to
                include.
              </p>
              <div className="max-h-52 space-y-2 overflow-y-auto">
                {savedOptions.map((option) => (
                  <label
                    key={option.key}
                    className="flex items-start gap-2 text-sm"
                  >
                    <input
                      className="mt-1"
                      type="checkbox"
                      checked={collection.items.includes(option.key)}
                      onChange={() => {
                        const current = getStoredUserState();
                        saveStoredUserState({
                          ...current,
                          collections: current.collections.map((item) =>
                            item.id === collection.id
                              ? {
                                  ...item,
                                  items: item.items.includes(option.key)
                                    ? item.items.filter(
                                        (key) => key !== option.key,
                                      )
                                    : [...item.items, option.key],
                                }
                              : item,
                          ),
                        });
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
                {!savedOptions.length && (
                  <p className="text-sm text-slate-400">
                    Save a catalog record, article or loadout to add it here.
                  </p>
                )}
              </div>
              <button
                className="player-button mt-4 text-rose-200"
                onClick={() => {
                  if (
                    !window.confirm(
                      "Delete this collection? Its saved items remain in your account.",
                    )
                  )
                    return;
                  const current = getStoredUserState();
                  saveStoredUserState({
                    ...current,
                    collections: current.collections.filter(
                      (item) => item.id !== collection.id,
                    ),
                  });
                }}
              >
                Delete collection
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="player-panel">
        <h2 className="text-lg font-bold">Save a comparison</h2>
        <form
          className="my-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (
              !comparisonName.trim() ||
              selected.length < 2 ||
              selected.length > 4
            ) {
              setMessage("Name the comparison and select two to four records.");
              return;
            }
            const current = getStoredUserState();
            if (current.savedComparisons.length >= 100) {
              setMessage("The limit is 100 comparison sets.");
              return;
            }
            if (
              saveStoredUserState({
                ...current,
                savedComparisons: [
                  {
                    id: crypto.randomUUID(),
                    name: comparisonName.trim(),
                    kind,
                    ids: selected,
                    updatedAt: new Date().toISOString(),
                  },
                  ...current.savedComparisons,
                ],
              })
            ) {
              setComparisonName("");
              setSelected([]);
              setMessage(
                "Comparison saved. Account sync status shows when it is stored online.",
              );
            }
          }}
        >
          <label className="player-label">
            Comparison name
            <input
              required
              maxLength={120}
              className="player-input"
              value={comparisonName}
              onChange={(event) => setComparisonName(event.target.value)}
            />
          </label>
          <label className="player-label">
            Record type
            <select
              className="player-input"
              value={kind}
              onChange={(event) => {
                setKind(event.target.value as typeof kind);
                setSelected([]);
              }}
            >
              <option value="vehicles">Vehicles</option>
              <option value="weapons">Weapons</option>
            </select>
          </label>
          <label className="player-label">
            Choose two to four records
            <select
              multiple
              size={6}
              className="player-input"
              value={selected}
              onChange={(event) =>
                setSelected(
                  Array.from(event.target.selectedOptions)
                    .map((option) => option.value)
                    .slice(0, 4),
                )
              }
            >
              {choices.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-slate-400">
            Hold Ctrl or Command to select several records on desktop.{" "}
            {selected.length}/4 selected.
          </p>
          <button className="player-button player-button-primary">
            Save comparison
          </button>
        </form>
        <div className="grid gap-3 lg:grid-cols-2">
          {state.savedComparisons.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-white/10 p-4"
            >
              <h3 className="font-bold">{item.name}</h3>
              <p className="my-2 text-sm text-slate-400">
                {item.ids.length} {item.kind}
              </p>
              <div className="flex gap-3">
                <Link
                  href={`/compare/${item.kind}?ids=${encodeURIComponent(item.ids.join(","))}`}
                  className="player-button"
                >
                  Open comparison
                </Link>
                <button
                  className="player-button text-rose-200"
                  onClick={() => {
                    const current = getStoredUserState();
                    saveStoredUserState({
                      ...current,
                      savedComparisons: current.savedComparisons.filter(
                        (record) => record.id !== item.id,
                      ),
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
        {!state.savedComparisons.length && (
          <p className="text-sm text-slate-400">
            No named comparisons saved yet.
          </p>
        )}
      </section>
    </div>
  );
}
