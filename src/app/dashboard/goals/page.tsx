"use client";
import { useState } from "react";
import { usePlayerState } from "@/lib/use-player-state";
import { getStoredUserState, saveStoredUserState } from "@/lib/user-store";
export default function PlayerGoalsPage() {
  const state = usePlayerState();
  const [text, setText] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [priority, setPriority] = useState<"normal" | "high">("normal");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  if (!state)
    return <div className="player-panel">Loading goals and notes…</div>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Goals and private notes</h1>
        <p className="mt-2 text-sm text-slate-400">
          Plan your own tasks and keep notes in your player account.
        </p>
      </div>
      {message && (
        <p role="status" className="text-sm text-emerald-200">
          {message}
        </p>
      )}
      <section className="player-panel">
        <h2 className="text-lg font-bold">Your goals</h2>
        <form
          className="my-4 flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const current = getStoredUserState();
            if (!text.trim() || current.goals.length >= 200) return;
            saveStoredUserState({
              ...current,
              goals: [
                {
                  id: crypto.randomUUID(),
                  text: text.trim(),
                  completed: false,
                  createdAt: new Date().toISOString(),
                  targetDate,
                  priority,
                },
                ...current.goals,
              ],
            });
            setText("");
            setTargetDate("");
            setMessage(
              "Goal added; check the sync status for account save confirmation.",
            );
          }}
        >
          <label className="flex-1">
            <span className="sr-only">New goal</span>
            <input
              required
              maxLength={500}
              className="player-input"
              value={text}
              placeholder="What would you like to do next?"
              onChange={(event) => setText(event.target.value)}
            />
          </label>
          <label className="player-label">
            Target date
            <input
              type="date"
              className="player-input"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
            />
          </label>
          <label className="player-label">
            Priority
            <select
              className="player-input"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as typeof priority)
              }
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </label>
          <button
            disabled={state.goals.length >= 200}
            className="player-button player-button-primary"
          >
            Add goal
          </button>
        </form>
        {!state.goals.length && (
          <p className="text-sm text-slate-400">
            You haven’t added any goals. Start with something you want to
            explore or save.
          </p>
        )}
        <ul className="space-y-2">
          {[...state.goals]
            .sort(
              (a, b) =>
                Number(a.completed) - Number(b.completed) ||
                Number(b.priority === "high") - Number(a.priority === "high") ||
                (a.targetDate || "9999").localeCompare(b.targetDate || "9999"),
            )
            .map((goal) => (
              <li
                key={goal.id}
                className="flex items-start gap-3 rounded-xl border border-white/10 p-3"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  aria-label={`Complete ${goal.text}`}
                  checked={goal.completed}
                  onChange={() => {
                    const current = getStoredUserState();
                    saveStoredUserState({
                      ...current,
                      goals: current.goals.map((item) =>
                        item.id === goal.id
                          ? { ...item, completed: !item.completed }
                          : item,
                      ),
                    });
                  }}
                />
                <span
                  className={`min-w-0 flex-1 break-words text-sm ${goal.completed ? "text-slate-500 line-through" : ""}`}
                >
                  {goal.text}
                  {(goal.targetDate || goal.priority === "high") && (
                    <span className="mt-1 block text-xs text-gold-light">
                      {goal.priority === "high" ? "High priority" : ""}
                      {goal.targetDate ? ` · Target ${goal.targetDate}` : ""}
                    </span>
                  )}
                </span>
                <button
                  className="text-xs text-rose-300"
                  onClick={() => {
                    const current = getStoredUserState();
                    saveStoredUserState({
                      ...current,
                      goals: current.goals.filter(
                        (item) => item.id !== goal.id,
                      ),
                    });
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          {state.goals.filter((goal) => goal.completed).length} of{" "}
          {state.goals.length} personal goals complete · 200 goal limit
        </p>
      </section>
      <section className="player-panel">
        <h2 className="text-lg font-bold">Notes library</h2>
        <form
          className="my-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim()) return;
            const current = getStoredUserState();
            const note = {
              id: editing || crypto.randomUUID(),
              title: title.trim(),
              body,
              updatedAt: new Date().toISOString(),
            };
            if (!editing && current.personalNotes.length >= 200) return;
            saveStoredUserState({
              ...current,
              personalNotes: [
                note,
                ...current.personalNotes.filter((item) => item.id !== note.id),
              ],
            });
            setEditing(null);
            setTitle("");
            setBody("");
            setMessage(
              "Note saved in this browser; check sync status for account save confirmation.",
            );
          }}
        >
          <label className="player-label">
            Note title
            <input
              required
              maxLength={120}
              className="player-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="player-label">
            Note
            <textarea
              maxLength={5000}
              rows={5}
              className="player-input"
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <button
              disabled={!editing && state.personalNotes.length >= 200}
              className="player-button player-button-primary"
            >
              {editing ? "Save note changes" : "Add note"}
            </button>
            {editing && (
              <button
                type="button"
                className="player-button"
                onClick={() => {
                  setEditing(null);
                  setTitle("");
                  setBody("");
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
        {!state.personalNotes.length && (
          <p className="text-sm text-slate-400">Your notes library is empty.</p>
        )}
        <div className="grid gap-3 lg:grid-cols-2">
          {state.personalNotes.map((note) => (
            <article
              key={note.id}
              className="rounded-xl border border-white/10 p-4"
            >
              <h3 className="break-words font-bold">{note.title}</h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-300">
                {note.body}
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  className="text-xs text-gold-light"
                  onClick={() => {
                    setEditing(note.id);
                    setTitle(note.title);
                    setBody(note.body);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-xs text-rose-300"
                  onClick={() => {
                    if (!window.confirm(`Permanently delete “${note.title}”?`))
                      return;
                    const current = getStoredUserState();
                    saveStoredUserState({
                      ...current,
                      personalNotes: current.personalNotes.filter(
                        (item) => item.id !== note.id,
                      ),
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
