"use client";
import { useState } from "react";
import { getStoredUserState, saveStoredUserState } from "@/lib/user-store";
import { usePlayerState } from "@/lib/use-player-state";
import type { ReviewedProgressItem } from "@/lib/reviewed-progress";
export function PlayerProgress({
  items,
  title = "Your reviewed completion checklist",
  embeddedHeading = false,
}: {
  items: ReviewedProgressItem[];
  title?: string;
  embeddedHeading?: boolean;
}) {
  const state = usePlayerState();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const status = (id: string) =>
    state?.tracker.completedIds.includes(id)
      ? "completed"
      : state?.tracker.inProgressIds?.includes(id)
        ? "in-progress"
        : "not-started";
  const complete = items.filter(
    (item) => status(item.id) === "completed",
  ).length;
  const filtered = items.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      (statusFilter === "all" || statusFilter === status(item.id)) &&
      item.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section className="player-panel space-y-4">
      {embeddedHeading ? (
        <h2 className="text-2xl font-bold">{title}</h2>
      ) : (
        <h1 className="text-2xl font-bold">{title}</h1>
      )}
      <p className="text-sm text-slate-400">
        Track your own progress against source-reviewed requirements. This list
        may be incomplete; its percentage is checklist coverage, not an official
        full-game completion figure.
      </p>
      {!items.length ? (
        <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-300">
          No source-reviewed requirements have been published yet. Your saved
          data is retained. Missions and rewards will appear only after
          editorial review.
        </p>
      ) : (
        <>
          <p className="text-sm text-emerald-300">
            {complete} of {items.length} reviewed items completed ·{" "}
            {Math.round((complete / items.length) * 100)}% of this checklist
          </p>
          <div className="flex flex-wrap gap-3">
            <label className="flex-1">
              <span className="sr-only">Search requirements</span>
              <input
                className="player-input"
                value={search}
                placeholder="Search requirements…"
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label>
              <span className="sr-only">Category</span>
              <select
                className="player-input"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                {[...new Set(items.map((item) => item.category))].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              <span className="sr-only">Progress status</span>
              <select
                className="player-input"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="not-started">Not started</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
          {!filtered.length && (
            <p className="text-sm text-slate-400">
              No requirements match your filters.
            </p>
          )}
          {filtered.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="rounded-xl border border-white/10 p-4"
            >
              <p className="text-xs text-slate-400">
                {item.category} ·{" "}
                {item.confidence === "OFFICIAL"
                  ? "Official source"
                  : "Observed and reviewed"}
              </p>
              <h2 className="mt-2 font-bold">{item.title}</h2>
              <p className="my-2 text-sm text-slate-300">{item.description}</p>
              <a
                href={item.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gold-light"
              >
                Review source ↗
              </a>
              <label className="player-label mt-4">
                Progress
                <select
                  disabled={!state}
                  className="player-input"
                  value={status(item.id)}
                  onChange={(event) => {
                    const next = getStoredUserState();
                    next.tracker.completedIds =
                      next.tracker.completedIds.filter((id) => id !== item.id);
                    next.tracker.inProgressIds = (
                      next.tracker.inProgressIds || []
                    ).filter((id) => id !== item.id);
                    if (event.target.value === "completed") {
                      next.tracker.completedIds.push(item.id);
                      next.tracker.checkedAt = {
                        ...next.tracker.checkedAt,
                        [item.id]: new Date().toISOString(),
                      };
                    } else if (event.target.value === "in-progress")
                      next.tracker.inProgressIds.push(item.id);
                    saveStoredUserState(next);
                  }}
                >
                  <option value="not-started">Not started</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <label className="player-label mt-3">
                Your private note
                <textarea
                  className="player-input"
                  rows={2}
                  maxLength={5000}
                  value={state?.tracker.notes[item.id] || ""}
                  onChange={(event) => {
                    const next = getStoredUserState();
                    next.tracker.notes[item.id] = event.target.value;
                    saveStoredUserState(next);
                  }}
                />
              </label>
            </article>
          ))}
        </>
      )}
    </section>
  );
}
