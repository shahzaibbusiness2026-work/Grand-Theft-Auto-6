"use client";
import { useEffect, useState } from "react";
import Link from "@/components/player-tool-link";
import { usePlayerState } from "@/lib/use-player-state";
import { getStoredUserState, saveStoredUserState } from "@/lib/user-store";
import {
  sessionTaskDone,
  setSessionTaskDone,
} from "@/lib/player-session-planning";
import type { PlayerSessionPlan, PlayerSessionTask } from "@/lib/player-state";
import type { ReviewedProgressItem } from "@/lib/reviewed-progress";

export function NextSessionCard() {
  const state = usePlayerState();
  const [message, setMessage] = useState("");
  const plan = state?.sessionPlans.find((item) => !item.finishedAt);
  const next = plan?.tasks.find(
    (task) => state && !sessionTaskDone(task, state),
  );
  return (
    <section className="player-panel border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-card">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-light">
        Your next session
      </p>
      <h2 className="my-3 text-2xl font-bold">
        {plan ? plan.title : "Turn your saved ideas into a plan"}
      </h2>
      <p className="max-w-2xl text-sm text-slate-300">
        {next
          ? `Next up: ${next.label}`
          : plan
            ? "Review your checklist and finish your session when you’re ready."
            : "Choose your time budget, gather your goals, private map pins and saved guides, then follow one personal checklist."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          className="player-button player-button-primary"
          href="/dashboard/session"
        >
          {plan?.startedAt
            ? "Resume my session"
            : plan
              ? "Open my session plan"
              : "Plan my next session"}
        </Link>
        {next && (
          <Link className="player-button" href={next.path}>
            Open next task →
          </Link>
        )}
        {next && plan && (
          <button className="player-button" onClick={() => {
            const current = getStoredUserState();
            const latest = current.sessionPlans.find((item) => item.id === plan.id);
            const task = latest?.tasks.find((item) => item.id === next.id);
            if (!task || !latest || latest.finishedAt) return;
            const updated = setSessionTaskDone(current, latest.id, task.id, true);
            setMessage(saveStoredUserState({ ...current, ...updated }) ? "Task checked off in your personal plan." : "Your browser could not save this change. Please retry.");
          }}>Check off next task</button>
        )}
      </div>
      {message && <p className="mt-3 text-sm" role="status">{message}</p>}
      {plan && state && (
        <p className="mt-3 text-xs text-slate-400">
          {plan.tasks.filter((task) => sessionTaskDone(task, state)).length}/
          {plan.tasks.length} tasks complete · {plan.plannedMinutes} minutes
          planned by you
        </p>
      )}
    </section>
  );
}

export function SessionPlanner({
  requirements,
}: {
  requirements: ReviewedProgressItem[];
}) {
  const state = usePlayerState();
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(60);
  const [focus, setFocus] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [message, setMessage] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);
  if (!state) return <div className="player-panel">Loading your plans…</div>;
  const candidates: PlayerSessionTask[] = [
    ...[...state.goals]
      .filter((goal) => !goal.completed)
      .sort(
        (a, b) =>
          Number(b.priority === "high") - Number(a.priority === "high") ||
          (a.targetDate || "9999").localeCompare(b.targetDate || "9999"),
      )
      .map((goal) => ({
        id: `goal:${goal.id}`,
        source: "goal" as const,
        refId: goal.id,
        label: goal.text,
        path: "/dashboard/goals",
        done: false,
      })),
    ...state.personalMarkers
      .filter((pin) => !state.mapCompletedIds.includes(pin.id))
      .map((pin) => ({
        id: `pin:${pin.id}`,
        source: "pin" as const,
        refId: pin.id,
        label: `Visit: ${pin.title}`,
        path: `/dashboard/map?poi=${pin.id}`,
        done: false,
      })),
    ...requirements
      .filter((item) => !state.tracker.completedIds.includes(item.id))
      .map((item) => ({
        id: `requirement:${item.id}`,
        source: "requirement" as const,
        refId: item.id,
        label: item.title,
        path: `/dashboard/progress#${item.id}`,
        done: false,
      })),
    ...state.bookmarks.map((item) => ({
      id: `bookmark:${item.id}`,
      source: "bookmark" as const,
      refId: item.id,
      label: `Read: ${item.title}`,
      path: item.path,
      done: false,
    })),
    ...state.savedLoadouts.map((item) => ({
      id: `loadout:${item.id}`,
      source: "loadout" as const,
      refId: item.id,
      label: `Review loadout: ${item.name}`,
      path: "/dashboard/loadouts",
      done: false,
    })),
  ];
  const shown = candidates.filter(
    (task) => focus === "all" || task.source === focus,
  );
  const plan =
    state.sessionPlans.find((item) => item.id === openId) ||
    state.sessionPlans.find((item) => !item.finishedAt);
  const elapsed = plan?.startedAt
    ? Math.max(
        0,
        Math.floor(
          ((plan.finishedAt ? Date.parse(plan.finishedAt) : now) -
            Date.parse(plan.startedAt)) /
            60000,
        ),
      )
    : 0;
  const changePlan = (id: string, change: Partial<PlayerSessionPlan>) => {
    const current = getStoredUserState();
    saveStoredUserState({
      ...current,
      sessionPlans: current.sessionPlans.map((item) =>
        item.id === id ? { ...item, ...change } : item,
      ),
    });
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plan my next session</h1>
        <p className="mt-2 text-sm text-slate-400">
          A personal plan from your own goals, private pins and reviewed
          checklist records. Your time budget is a choice, not a prediction of
          game completion time.
        </p>
      </div>
      {message && (
        <p role="status" className="text-sm text-emerald-200">
          {message}
        </p>
      )}
      {plan && (
        <section className="player-panel border-pink-500/30">
          <p className="text-xs uppercase text-gold-light">
            {plan.finishedAt
              ? "Session summary"
              : plan.startedAt
                ? "Session in progress"
                : "Your session plan"}
          </p>
          <h2 className="my-3 text-xl font-bold">{plan.title}</h2>
          <p className="text-sm text-slate-400">
            {plan.plannedMinutes} minutes planned
            {plan.startedAt ? ` · ${elapsed} minutes elapsed` : ""}
            {plan.startedAt &&
            !plan.finishedAt &&
            elapsed >= plan.plannedMinutes
              ? " · Planned time reached"
              : ""}
          </p>
          <ul className="my-4 space-y-2">
            {plan.tasks.map((task) => {
              const done = plan.finishedAt
                ? task.done
                : sessionTaskDone(task, state);
              return (
                <li
                  key={task.id}
                  className="flex items-start gap-3 rounded-xl border border-white/10 p-3"
                >
                  <input
                    className="mt-1"
                    type="checkbox"
                    disabled={!!plan.finishedAt}
                    checked={done}
                    aria-label={`Complete ${task.label}`}
                    onChange={(event) => {
                      const current = getStoredUserState();
                      saveStoredUserState({
                        ...current,
                        ...setSessionTaskDone(
                          current,
                          plan.id,
                          task.id,
                          event.target.checked,
                        ),
                      });
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className={`block break-words text-sm ${done ? "text-slate-500 line-through" : ""}`}
                    >
                      {task.label}
                    </span>
                    <Link
                      href={task.path}
                      className="mt-1 inline-block text-xs text-gold-light"
                    >
                      Open related tool →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-2">
            {!plan.startedAt && !plan.finishedAt && (
              <button
                className="player-button player-button-primary"
                onClick={() =>
                  changePlan(plan.id, { startedAt: new Date().toISOString() })
                }
              >
                Start this session
              </button>
            )}
            {!plan.finishedAt && (
              <button
                className="player-button"
                onClick={() =>
                  changePlan(plan.id, {
                    finishedAt: new Date().toISOString(),
                    tasks: plan.tasks.map((task) => ({
                      ...task,
                      done: sessionTaskDone(task, state),
                    })),
                  })
                }
              >
                Finish session
              </button>
            )}
            <button
              className="player-button text-rose-200"
              onClick={() => {
                if (
                  !window.confirm(
                    "Delete this session plan? Your linked goals and map records remain.",
                  )
                )
                  return;
                const current = getStoredUserState();
                saveStoredUserState({
                  ...current,
                  sessionPlans: current.sessionPlans.filter(
                    (item) => item.id !== plan.id,
                  ),
                });
                setOpenId(null);
              }}
            >
              Delete plan
            </button>
          </div>
        </section>
      )}
      <form
        className="player-panel space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const tasks = candidates.filter((task) => selected.includes(task.id));
          if (custom.trim())
            tasks.push({
              id: crypto.randomUUID(),
              source: "custom",
              refId: "",
              label: custom.trim(),
              path: "/dashboard/session",
              done: false,
            });
          if (!tasks.length || tasks.length > 20) {
            setMessage("Choose one to twenty tasks for the session.");
            return;
          }
          const current = getStoredUserState();
          if (current.sessionPlans.length >= 50) {
            setMessage(
              "You can keep 50 saved sessions. Export a backup or remove an old plan first.",
            );
            return;
          }
          const next: PlayerSessionPlan = {
            id: crypto.randomUUID(),
            title: title.trim() || "My next session",
            plannedMinutes: minutes,
            tasks,
            createdAt: new Date().toISOString(),
            startedAt: null,
            finishedAt: null,
          };
          if (
            saveStoredUserState({
              ...current,
              sessionPlans: [next, ...current.sessionPlans],
            })
          ) {
            setOpenId(next.id);
            setTitle("");
            setSelected([]);
            setCustom("");
            setMessage(
              "Your session plan is ready. Check sync status before continuing on another device.",
            );
          }
        }}
      >
        <h2 className="text-lg font-bold">Build a new plan</h2>
        <label className="player-label">
          Session name
          <input
            maxLength={120}
            className="player-input"
            value={title}
            placeholder="Name your next session"
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="player-label">
            Your available time
            <select
              className="player-input"
              value={minutes}
              onChange={(event) => setMinutes(Number(event.target.value))}
            >
              {[15, 30, 45, 60, 90, 120, 180, 240].map((value) => (
                <option key={value} value={value}>
                  {value} minutes
                </option>
              ))}
            </select>
          </label>
          <label className="player-label">
            Focus
            <select
              className="player-input"
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
            >
              <option value="all">Mix of my saved items</option>
              <option value="goal">Personal goals</option>
              <option value="pin">My private map pins</option>
              <option value="requirement">Reviewed requirements</option>
              <option value="bookmark">Saved reading</option>
              <option value="loadout">Loadout planning</option>
            </select>
          </label>
        </div>
        <div>
          <button
            type="button"
            className="player-button mb-3"
            disabled={!shown.length}
            onClick={() =>
              setSelected(shown.slice(0, 5).map((task) => task.id))
            }
          >
            Choose next priorities
          </button>
          <p className="mb-3 text-xs text-slate-400">
            Unfinished goals with high priority or earlier target dates come
            first. You decide what fits your available time.
          </p>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {shown.map((task) => (
              <label
                key={task.id}
                className="flex items-start gap-3 rounded-lg border border-white/10 p-3 text-sm"
              >
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={selected.includes(task.id)}
                  onChange={(event) =>
                    setSelected(
                      event.target.checked
                        ? [...selected, task.id].slice(0, 20)
                        : selected.filter((id) => id !== task.id),
                    )
                  }
                />
                <span>{task.label}</span>
              </label>
            ))}
            {!shown.length && (
              <p className="text-sm text-slate-400">
                No saved items for this focus yet. Add a goal, create a private
                map pin, or write a task below.
              </p>
            )}
          </div>
        </div>
        <label className="player-label">
          Optional task you define
          <input
            maxLength={500}
            className="player-input"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            placeholder="Write your own next step"
          />
        </label>
        <button className="player-button player-button-primary">
          Save session plan
        </button>
      </form>
      {!!state.sessionPlans.length && (
        <section className="player-panel">
          <h2 className="mb-3 text-lg font-bold">Your sessions</h2>
          <div className="space-y-2">
            {state.sessionPlans.map((item) => (
              <button
                key={item.id}
                className="player-button w-full justify-between text-left"
                onClick={() => setOpenId(item.id)}
              >
                <span>{item.title}</span>
                <span className="text-xs">
                  {item.finishedAt
                    ? "Finished"
                    : item.startedAt
                      ? "In progress"
                      : "Planned"}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
