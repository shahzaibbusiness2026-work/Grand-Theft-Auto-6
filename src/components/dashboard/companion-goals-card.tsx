"use client";

import { useState } from "react";
import { Target, Clock, Check, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalItem {
  id: string;
  label: string;
  progress: string;
  completed: boolean;
}

const INITIAL_GOALS: GoalItem[] = [
  { id: "g-1", label: "Find 3 collectibles", progress: "3/3", completed: true },
  { id: "g-2", label: "Complete 1 side mission", progress: "1/1", completed: true },
  { id: "g-3", label: "Visit 2 new locations", progress: "0/2", completed: false },
  { id: "g-4", label: "Earn $100,000", progress: "$0 / $100K", completed: false },
];

export function CompanionGoalsCard() {
  const [goals, setGoals] = useState<GoalItem[]>(INITIAL_GOALS);

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-4 sm:p-5 shadow-xl backdrop-blur-xl">
      {/* Header with timer badge */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
          <Target className="h-4 w-4 text-amber-400" />
          <span>TODAY&apos;S GOALS</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
          <Clock className="h-3 w-3" />
          <span>12h 34m left</span>
        </div>
      </div>

      {/* Goals Checklist */}
      <div className="my-4 space-y-2.5">
        {goals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-2xl border p-3 text-xs font-semibold transition-all duration-200",
              goal.completed
                ? "border-[#00F0FF]/30 bg-[#00F0FF]/[0.06] text-slate-200"
                : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/15 hover:bg-white/[0.04]"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Checkbox box */}
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-lg border transition-all",
                  goal.completed
                    ? "border-[#00F0FF] bg-[#00F0FF] text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                    : "border-white/20 bg-white/5"
                )}
              >
                {goal.completed && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
              <span className={cn(goal.completed && "line-through text-slate-300")}>
                {goal.label}
              </span>
            </div>

            <span className="font-mono text-[11px] text-slate-400">
              {goal.progress}
            </span>
          </div>
        ))}
      </div>

      {/* Reward Section Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-amber-500/25 bg-amber-500/[0.08] p-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]">
            <Star className="h-4 w-4 fill-current" />
          </div>
          <div className="leading-tight">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-300">
              REWARD
            </span>
            <span className="font-display text-xs font-extrabold text-white">
              +500 XP
            </span>
          </div>
        </div>

        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white transition-colors"
          aria-label="View rewards"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
