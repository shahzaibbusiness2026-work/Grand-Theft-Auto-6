"use client";

import { useState } from "react";
import Link from "@/components/player-tool-link";
import { usePlayerState } from "@/lib/use-player-state";
import { getStoredUserState, saveStoredUserState } from "@/lib/user-store";
import { PLAYER_TOOLS } from "@/lib/player-state";
import { Plus, Pin, Check, FileText } from "lucide-react";

export function PlayerQuickActions() {
  const state = usePlayerState();
  const [kind, setKind] = useState<"goal" | "note">("goal");
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");
  const pinned = PLAYER_TOOLS.filter((item) => state?.pinnedTools.includes(item.path));
  const goals = state?.goals.filter((item) => !item.completed) || [];

  function capture(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const current = getStoredUserState();
    if ((kind === "goal" ? current.goals.length : current.personalNotes.length) >= 200) {
      setMessage("Your list is full. Remove an older item in Goals & Notes first.");
      return;
    }
    const now = new Date().toISOString();
    const next = kind === "goal" ? {
      ...current,
      goals: [{ id: crypto.randomUUID(), text, completed: false, createdAt: now, priority: "normal" as const }, ...current.goals],
    } : {
      ...current,
      personalNotes: [{ id: crypto.randomUUID(), title: text.split("\n")[0].slice(0, 120), body: text, updatedAt: now }, ...current.personalNotes],
    };
    if (saveStoredUserState(next)) {
      setDraft("");
      setMessage(kind === "goal" ? "Goal added to your workspace." : "Private note saved to your workspace.");
    } else setMessage("Your browser could not save this change. Please retry.");
  }

  return <section className="player-panel space-y-6" aria-labelledby="player-quick-title">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-pink-700 dark:text-pink-300">Make it yours</p>
        <h2 id="player-quick-title" className="mt-1 text-xl font-bold">Your next move</h2>
      </div>
      <Link className="player-button" href="/dashboard/goals">All goals & notes</Link>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={capture} className="space-y-3">
        <div className="flex flex-wrap gap-2" aria-label="Capture type">
          <button type="button" className={`player-button ${kind === "goal" ? "player-button-primary" : ""}`} aria-pressed={kind === "goal"} onClick={() => setKind("goal")}><Plus className="mr-2 h-4 w-4" />Quick goal</button>
          <button type="button" className={`player-button ${kind === "note" ? "player-button-primary" : ""}`} aria-pressed={kind === "note"} onClick={() => setKind("note")}><FileText className="mr-2 h-4 w-4" />Private note</button>
        </div>
        <label className="player-label" htmlFor="quick-capture">{kind === "goal" ? "What do you want to do next?" : "What do you want to remember?"}</label>
        <textarea id="quick-capture" className="player-input min-h-24 resize-y" maxLength={500} required value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={kind === "goal" ? "Add your own plan…" : "Save a thought, finding or reminder…"} />
        <button disabled={!state || !draft.trim()} className="player-button player-button-primary">{kind === "goal" ? "Add goal" : "Save private note"}</button>
        <p className="text-xs text-muted-foreground">Your personal plans and notes. Account sync status appears above.</p>
      </form>
      <div>
        <h3 className="font-bold">Your open goals <span className="text-muted-foreground">({goals.length})</span></h3>
        {goals.length ? <ul className="mt-3 space-y-2">
          {goals.slice(0, 3).map((goal) => <li key={goal.id}>
            <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-border p-3">
              <input className="mt-1 h-4 w-4 shrink-0 accent-pink-700" type="checkbox" checked={false} aria-label={`Complete goal: ${goal.text}`} onChange={() => {
                const current = getStoredUserState();
                const saved = saveStoredUserState({ ...current, goals: current.goals.map((item) => item.id === goal.id ? { ...item, completed: true } : item) });
                setMessage(saved ? "Goal completed. You can reopen it in Goals & Notes." : "Your browser could not save this change. Please retry.");
              }} />
              <span className="min-w-0 break-words text-sm">{goal.text}</span>
            </label>
          </li>)}
        </ul> : <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Add a goal here, then include it in your next session plan.</p>}
        <Link href="/dashboard/session" className="mt-4 inline-block text-sm font-semibold text-pink-700 underline dark:text-pink-300">Build a session from my goals →</Link>
      </div>
    </div>
    {message && <p role="status" className="text-sm">{message}</p>}
    <div className="border-t border-border pt-5">
      <div className="mb-3 flex items-center gap-2 font-bold"><Pin className="h-4 w-4" />My shortcuts</div>
      {pinned.length ? <nav aria-label="My pinned dashboard tools" className="flex flex-wrap gap-2">{pinned.map((tool) => <Link key={tool.path} href={tool.path} className="player-button">{tool.label}</Link>)}</nav> : <p className="text-sm text-muted-foreground">Pin the tools you use most to open them directly next time.</p>}
      <details className="mt-3">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">Customize my shortcuts</summary>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYER_TOOLS.map((tool) => <button type="button" key={tool.path} aria-pressed={!!state?.pinnedTools.includes(tool.path)} disabled={!state} className="player-button justify-between gap-3 text-left" onClick={() => {
            const current = getStoredUserState();
            const selected = current.pinnedTools.includes(tool.path);
            if (!saveStoredUserState({ ...current, pinnedTools: selected ? current.pinnedTools.filter((path) => path !== tool.path) : [...current.pinnedTools, tool.path] })) setMessage("Your browser could not save this change. Please retry.");
          }}><span>{tool.label}</span>{state?.pinnedTools.includes(tool.path) ? <Check className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}</button>)}
        </div>
      </details>
    </div>
  </section>;
}
