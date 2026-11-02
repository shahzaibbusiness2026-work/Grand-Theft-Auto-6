"use client";
import { useEffect, useState } from "react";
import {
  getReviewedProgressItems,
  saveReviewedProgressItem,
  deleteReviewedProgressItem,
} from "@/lib/services/player-progress";
import {
  PROGRESS_CATEGORIES,
  type ReviewedProgressItem,
} from "@/lib/reviewed-progress";
const emptyForm = (): ReviewedProgressItem => ({
  id: "",
  title: "",
  category: "Story Missions",
  description: "",
  source: "",
  confidence: "OFFICIAL",
});
export default function AdminTrackerPage() {
  const [items, setItems] = useState<ReviewedProgressItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function load() {
    try {
      setItems(await getReviewedProgressItems());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load requirements.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h1 className="text-2xl font-bold">Reviewed completion requirements</h1>
        <p className="mt-2 text-sm text-slate-400">
          Publish sourced checklist entries for the player dashboard and public
          tracker. Checklist coverage is calculated from real entries; no game
          completion weights or totals are assumed.
        </p>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-rose-400/30 p-4 text-sm text-rose-200"
        >
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="text-sm text-emerald-200">
          {message}
        </p>
      )}
      <form
        className="player-panel space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!reviewed) return;
          setBusy(true);
          setError("");
          setMessage("");
          try {
            const result = await saveReviewedProgressItem({
              ...form,
              id: form.id || `reviewed-${crypto.randomUUID()}`,
            });
            if (!result.success) throw new Error(result.error);
            setForm(emptyForm());
            setReviewed(false);
            setMessage("Reviewed requirement published.");
            await load();
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Could not publish requirement.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <h2 className="text-lg font-bold">
          {form.id ? "Edit requirement" : "Add reviewed requirement"}
        </h2>
        <label className="player-label">
          Requirement title
          <input
            required
            maxLength={200}
            className="player-input"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="player-label">
            Category
            <select
              className="player-input"
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
            >
              {PROGRESS_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="player-label">
            Evidence status
            <select
              className="player-input"
              value={form.confidence}
              onChange={(event) =>
                setForm({
                  ...form,
                  confidence: event.target
                    .value as ReviewedProgressItem["confidence"],
                })
              }
            >
              <option value="OFFICIAL">Official source</option>
              <option value="CONFIRMED">Observed and reviewed</option>
            </select>
          </label>
        </div>
        <label className="player-label">
          Source URL
          <input
            type="url"
            required
            maxLength={500}
            className="player-input"
            value={form.source}
            onChange={(event) =>
              setForm({ ...form, source: event.target.value })
            }
          />
        </label>
        <label className="player-label">
          Requirement description and source context
          <textarea
            rows={4}
            required
            maxLength={3000}
            className="player-input"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
          />
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input
            className="mt-1"
            type="checkbox"
            required
            checked={reviewed}
            onChange={(event) => setReviewed(event.target.checked)}
          />
          I reviewed the linked source and confirmed this requirement. It is not
          an illustrative or invented objective.
        </label>
        <div className="flex gap-2">
          <button
            disabled={busy || !reviewed}
            className="player-button player-button-primary"
          >
            {busy ? "Publishing…" : "Publish reviewed requirement"}
          </button>
          {form.id && (
            <button
              type="button"
              className="player-button"
              onClick={() => {
                setForm(emptyForm());
                setReviewed(false);
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
      <section className="player-panel">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold">
            Published requirements · {items.length}
          </h2>
          <button className="player-button" onClick={() => void load()}>
            Refresh
          </button>
        </div>
        {loading ? (
          <p className="mt-4 text-sm">Loading…</p>
        ) : !items.length ? (
          <p className="mt-4 text-sm text-slate-400">
            No reviewed requirements are published. Players see an empty state.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-white/10 p-4"
              >
                <h3 className="font-bold">{item.title}</h3>
                <p className="my-2 text-sm text-slate-400">
                  {item.category} · {item.confidence}
                </p>
                <a
                  className="break-all text-sm text-gold-light"
                  href={item.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.source}
                </a>
                <div className="mt-3 flex gap-3">
                  <button
                    className="player-button"
                    onClick={() => {
                      setForm(item);
                      setReviewed(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    disabled={busy}
                    className="player-button text-rose-200"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          `Remove “${item.title}” from the published checklist?`,
                        )
                      )
                        return;
                      setBusy(true);
                      try {
                        const result = await deleteReviewedProgressItem(
                          item.id,
                        );
                        if (!result.success) throw new Error(result.error);
                        await load();
                        setMessage(
                          "Requirement removed. Historical player data is preserved.",
                        );
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Could not remove requirement.",
                        );
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
