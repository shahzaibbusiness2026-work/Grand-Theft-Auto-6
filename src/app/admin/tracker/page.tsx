"use client";

import React, { useState } from "react";
import { CheckCircle2, Plus, Sliders, Trophy, Sparkles, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import { cn } from "@/lib/utils";

interface TrackerCategory {
  id: string;
  name: string;
  weight: number;
  totalItems: number;
  active: boolean;
}

export default function AdminTrackerPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<TrackerCategory[]>([
    { id: "trk-1", name: "Story Missions", weight: 50, totalItems: 68, active: true },
    { id: "trk-2", name: "Strangers & Freaks", weight: 20, totalItems: 32, active: true },
    { id: "trk-3", name: "Collectibles & Hidden Packages", weight: 15, totalItems: 100, active: true },
    { id: "trk-4", name: "Random World Encounters", weight: 10, totalItems: 40, active: true },
    { id: "trk-5", name: "Hobbies & Pastimes", weight: 5, totalItems: 25, active: true },
  ]);

  const totalWeight = categories.filter((c) => c.active).reduce((sum, c) => sum + c.weight, 0);
  const totalItems = categories.filter((c) => c.active).reduce((sum, c) => sum + c.totalItems, 0);

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    const cat = categories.find((c) => c.id === id);
    showToast({
      title: `Category ${cat?.active ? "Disabled" : "Enabled"}`,
      description: `"${cat?.name}" ${cat?.active ? "excluded from" : "included in"} completion formula.`,
      type: "info",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>100% Completion Tracker Manager</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Configure weighting and categories for public checklist completion milestones.
          </p>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] mb-1">Active Categories</p>
          <p className="text-2xl font-black text-[var(--admin-text)]">{categories.filter((c) => c.active).length}<span className="text-sm font-medium text-[var(--admin-text-muted)]">/{categories.length}</span></p>
        </div>
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] mb-1">Total Weight</p>
          <p className={cn("text-2xl font-black", totalWeight === 100 ? "text-emerald-400" : "text-amber-400")}>{totalWeight}%</p>
          {totalWeight !== 100 && (
            <p className="text-[10px] text-amber-400 font-medium mt-0.5">⚠ Weights should sum to 100%</p>
          )}
        </div>
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] mb-1">Tracked Items</p>
          <p className="text-2xl font-black text-[var(--admin-text)]">{totalItems}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 space-y-4 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
          Completion Formula Weighting
        </h2>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={cn(
                "p-4 rounded-xl border flex items-center justify-between transition-all",
                cat.active
                  ? "bg-[var(--admin-surface)] border-[var(--admin-border)] hover:border-[var(--admin-primary)]/30"
                  : "bg-[var(--admin-surface)] border-[var(--admin-border-subtle)] opacity-50"
              )}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={cat.active}
                  aria-label={`Toggle ${cat.name} ${cat.active ? "off" : "on"}`}
                  onClick={() => toggleCategory(cat.id)}
                  className={cn(
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--admin-surface)]",
                    cat.active ? "bg-[var(--admin-primary)]" : "bg-[var(--admin-border)]"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform shadow-sm",
                      cat.active ? "translate-x-[18px]" : "translate-x-[3px]"
                    )}
                  />
                </button>
                <div>
                  <p className="font-bold text-xs text-[var(--admin-text)]">{cat.name}</p>
                  <p className="text-[11px] text-[var(--admin-text-muted)]">
                    {cat.totalItems} items tracked in database
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-[var(--admin-primary)]">
                  {cat.weight}%
                </span>
                <div className="w-24 h-1.5 bg-[var(--admin-border)] rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full rounded-full bg-[var(--admin-primary)] transition-all"
                    style={{ width: `${cat.weight}%` }}
                  />
                </div>
                <Badge variant={cat.active ? "success" : "neutral"} size="sm">
                  {cat.active ? "Active" : "Disabled"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
