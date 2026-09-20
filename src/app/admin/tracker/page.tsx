"use client";

import React, { useState } from "react";
import { CheckCircle2, Plus, Sliders, Trophy, Sparkles } from "lucide-react";
import { useToast } from "@/components/admin/toast";

export default function AdminTrackerPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([
    { id: "trk-1", name: "Story Missions", weight: "50%", totalItems: 68, active: true },
    { id: "trk-2", name: "Strangers & Freaks", weight: "20%", totalItems: 32, active: true },
    { id: "trk-3", name: "Collectibles & Hidden Packages", weight: "15%", totalItems: 100, active: true },
    { id: "trk-4", name: "Random World Encounters", weight: "10%", totalItems: 40, active: true },
    { id: "trk-5", name: "Hobbies & Pastimes", weight: "5%", totalItems: 25, active: true },
  ]);

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

      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
          Completion Formula Weighting
        </h2>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-xs text-[var(--admin-text)]">{cat.name}</p>
                <p className="text-[11px] text-[var(--admin-text-muted)]">
                  {cat.totalItems} items tracked in database
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-[var(--admin-primary)]">
                  {cat.weight}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
