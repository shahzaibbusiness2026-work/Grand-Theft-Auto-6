"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Trophy,
  RotateCcw,
  Search,
  Download,
  Upload,
  BookOpen,
  MapPin,
  HelpCircle,
  FileEdit,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { Donut } from "@/components/ui/donut";
import { Progress } from "@/components/ui/progress";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { cn } from "@/lib/utils";
import {
  getStoredUserState,
  saveStoredUserState,
  toggleTrackerItem,
  type UserState,
} from "@/lib/user-store";

export interface TrackerMilestone {
  id: string;
  category:
    | "Story Missions"
    | "Strangers & Freaks"
    | "Collectibles"
    | "Hobbies & Pastimes"
    | "Random Events"
    | "Miscellaneous"
    | "Properties & Businesses"
    | "Weapon Masteries"
    | "Vehicle Collections"
    | "Map Exploration"
    | "Trophies & Achievements";
  title: string;
  district: string;
  description: string;
  reward: string;
  confidence: "OFFICIAL" | "CONFIRMED" | "REPORTED" | "RUMORED" | "SPECULATION";
  source: string;
  mapPoiId?: string;
}

export const TRACKER_CATEGORIES = [
  "All",
  "Story Missions",
  "Strangers & Freaks",
  "Collectibles",
  "Hobbies & Pastimes",
  "Random Events",
  "Miscellaneous",
  "Properties & Businesses",
  "Weapon Masteries",
  "Vehicle Collections",
  "Map Exploration",
  "Trophies & Achievements",
] as const;

// No completion requirement is published without a reviewed source.
// Do not repopulate this list with invented pre-release missions or rewards.
export const MILESTONES: TrackerMilestone[] = [];

export interface TrackerCategoryConfig {
  id: string;
  name: string;
  weight: number;
  totalItems: number;
  active: boolean;
}

interface TrackerClientProps {
  /** Admin-configured categories (CMS); when absent the built-in list is used. */
  config?: TrackerCategoryConfig[];
}

export function TrackerClient({ config }: TrackerClientProps) {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>("");

  // Load and sync user state
  useEffect(() => {
    setUserState(getStoredUserState());

    const handleSync = () => {
      setUserState(getStoredUserState());
    };

    window.addEventListener("gta6_user_state_change", handleSync);
    return () =>
      window.removeEventListener("gta6_user_state_change", handleSync);
  }, []);

  const completedIds = useMemo(() => {
    return userState?.tracker.completedIds || [];
  }, [userState]);

  const personalNotes = useMemo(() => {
    return userState?.tracker.notes || {};
  }, [userState]);

  // Admin-configured active category names (CMS-driven). Falls back to the
  // built-in list when no config exists or the admin disabled everything.
  const visibleCategories = useMemo(() => {
    if (!config || config.length === 0) {
      return TRACKER_CATEGORIES.filter(
        (c) => c !== "All",
      ) as unknown as string[];
    }
    const names = config.filter((c) => c.active !== false).map((c) => c.name);
    return names.length > 0
      ? names
      : (TRACKER_CATEGORIES.filter((c) => c !== "All") as unknown as string[]);
  }, [config]);

  const categoryWeights = useMemo(() => {
    const map: Record<string, number> = {};
    config?.forEach((c) => {
      map[c.name] = c.weight;
    });
    return map;
  }, [config]);

  // Milestones restricted to admin-enabled categories (CMS config mode) so
  // deactivated categories are excluded from the list and completion formula.
  const activeMilestones = useMemo(() => {
    if (!config || config.length === 0) return MILESTONES;
    const names = new Set(visibleCategories);
    return MILESTONES.filter((m) => names.has(m.category));
  }, [config, visibleCategories]);

  // Overall Completion Calculations (restricted to admin-enabled categories)
  const totalMilestones = activeMilestones.length;
  const totalCompleted = useMemo(() => {
    return activeMilestones.filter((m) => completedIds.includes(m.id)).length;
  }, [completedIds, activeMilestones]);

  const overallPercent = Math.round(
    (totalCompleted / (totalMilestones || 1)) * 100,
  );

  // Category-specific stats
  const categoryStats = useMemo(() => {
    const map: Record<
      string,
      { total: number; completed: number; percent: number }
    > = {};
    for (const cat of visibleCategories) {
      if (cat === "All") continue;
      const catItems = MILESTONES.filter((m) => m.category === cat);
      const done = catItems.filter((m) => completedIds.includes(m.id)).length;
      map[cat] = {
        total: catItems.length,
        completed: done,
        percent: Math.round((done / (catItems.length || 1)) * 100),
      };
    }
    return map;
  }, [completedIds, visibleCategories]);

  // Filtered Milestones
  const filteredMilestones = useMemo(() => {
    return activeMilestones.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      const isDone = completedIds.includes(item.id);
      if (filterStatus === "completed" && !isDone) return false;
      if (filterStatus === "pending" && isDone) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDistrict = item.district.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchReward = item.reward.toLowerCase().includes(q);
        const matchNote = (personalNotes[item.id] || "")
          .toLowerCase()
          .includes(q);
        return (
          matchTitle || matchDistrict || matchDesc || matchReward || matchNote
        );
      }

      return true;
    });
  }, [
    activeMilestones,
    selectedCategory,
    filterStatus,
    searchQuery,
    completedIds,
    personalNotes,
  ]);

  // Actions
  const handleToggle = (id: string) => {
    toggleTrackerItem(id);
  };

  const handleSaveNote = (id: string) => {
    if (!userState) return;
    const current = { ...userState };
    if (!current.tracker.notes) current.tracker.notes = {};
    if (noteText.trim()) {
      current.tracker.notes[id] = noteText.trim();
    } else {
      delete current.tracker.notes[id];
    }
    saveStoredUserState(current);
    setEditingNoteId(null);
  };

  const handleResetAll = () => {
    if (
      !confirm(
        "Are you sure you want to reset all checklist progress? Your saved personal notes will be preserved.",
      )
    ) {
      return;
    }
    if (!userState) return;
    const current = { ...userState };
    current.tracker.completedIds = [];
    saveStoredUserState(current);
  };

  const handleExportJSON = () => {
    if (!userState) return;
    const payload = {
      version: "1.0",
      app: "Taish Gaming 100% Completion Tracker",
      exportedAt: new Date().toISOString(),
      stats: {
        total: totalMilestones,
        completed: totalCompleted,
        percent: overallPercent,
      },
      completedIds: userState.tracker.completedIds,
      notes: userState.tracker.notes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gta6-atlas-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed && Array.isArray(parsed.completedIds)) {
          if (!userState) return;
          const current = { ...userState };
          current.tracker.completedIds = Array.from(
            new Set([...current.tracker.completedIds, ...parsed.completedIds]),
          );
          if (parsed.notes && typeof parsed.notes === "object") {
            current.tracker.notes = {
              ...current.tracker.notes,
              ...parsed.notes,
            };
          }
          saveStoredUserState(current);
          alert(
            `Success! Restored ${parsed.completedIds.length} completed checklist items.`,
          );
        } else {
          alert(
            "Invalid backup file format. Expected a valid Taish Gaming JSON export.",
          );
        }
      } catch (err) {
        alert("Failed to parse the backup JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (totalMilestones === 0)
    return (
      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-2xl font-bold">
          Checklist not yet available
        </h2>
        <p>
          No completion percentage, mission reward or achievement requirement is
          asserted.
        </p>
        <p className="text-sm text-muted-foreground">
          Saved records on this device: {completedIds.length} checked items and{" "}
          {Object.keys(personalNotes).length} notes. They are retained for
          export and review, and are not counted as verified GTA VI progress.
        </p>
        <button
          type="button"
          onClick={handleExportJSON}
          className="min-h-11 rounded-xl border border-border px-4 font-semibold"
        >
          Export saved progress
        </button>
        <Link className="block underline" href="/editorial-policy">
          How requirements will be reviewed
        </Link>
      </section>
    );

  return (
    <div className="space-y-8">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Progress Donut */}
        <div className="card-carbon p-6 flex flex-col sm:flex-row items-center gap-6 border-accent/30">
          <div className="relative flex-shrink-0">
            <Donut
              value={overallPercent}
              size={130}
              strokeWidth={12}
              color="var(--primary)"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display text-3xl font-black text-foreground">
                {overallPercent}%
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total
              </span>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <Trophy className="h-5 w-5 text-gold-dark dark:text-gold-light" />
              <h2 className="font-display text-xl font-extrabold uppercase tracking-wider text-foreground">
                100% Leonida Completion
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Track all story milestones, submerged caches, high-stakes
              robberies, and pastimes across Leonida.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-mono">
              <span className="text-primary font-bold">
                {totalCompleted} Done
              </span>
              <span className="text-muted-foreground/60">/</span>
              <span className="text-muted-foreground">
                {totalMilestones} Total Items
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="card-carbon p-6 flex flex-col justify-between border-primary/20">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Data Sync & Backup
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                Local Auto-Save
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your tracker is securely persisted in your browser. Export anytime
              to back up or transfer between devices.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
            <button
              onClick={handleExportJSON}
              className="btn-secondary text-xs px-3 py-3 flex items-center gap-1.5 flex-1 justify-center"
              title="Export completion progress as JSON"
            >
              <Download className="h-3.5 w-3.5 text-accent" /> Export JSON
            </button>
            <label className="btn-secondary text-xs px-3 py-3 flex items-center gap-1.5 flex-1 justify-center cursor-pointer">
              <Upload className="h-3.5 w-3.5 text-primary" /> Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
            <button
              onClick={handleResetAll}
              className="btn-ghost text-xs px-3 py-3 text-rose-500 dark:text-rose-400 hover:text-rose-600 hover:bg-rose-500/10 flex items-center gap-1"
              title="Reset all checkboxes"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Interactive Map Link Box */}
        <div className="card-carbon p-6 flex flex-col justify-between bg-gradient-to-br from-card via-card to-primary/10 border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-accent mb-2">
              <MapPin className="h-3.5 w-3.5" /> Live Map Sync
            </div>
            <h3 className="font-display text-base font-black text-foreground mb-2">
              Locate Milestones on Map
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Many checklist items feature direct pins on the high-res Leonida
              satellite atlas with live coordinate waypoints.
            </p>
          </div>
          <Link
            href="/map"
            className="btn-primary text-xs px-4 py-3 mt-4 flex items-center justify-center gap-2 font-bold tracking-wide"
          >
            Launch Interactive Map <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Category Progress Badges */}
      <div className="card-carbon p-5">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Category Completion
          Breakdown ({visibleCategories.length}
          {visibleCategories.length === 1 ? " Category" : " Categories"})
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {visibleCategories.map((cat) => {
            const stat = categoryStats[cat] || {
              total: 0,
              completed: 0,
              percent: 0,
            };
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isSelected ? "All" : cat)}
                className={cn(
                  "text-left p-3 rounded-xl border transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/15 text-foreground shadow-sm ring-1 ring-primary/30"
                    : "border-border bg-card/60 hover:border-border hover:bg-muted/50 text-card-foreground",
                )}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-foreground truncate pr-1">
                    {cat}
                  </span>
                  <span className="font-mono font-black text-accent">
                    {stat.percent}%
                  </span>
                </div>
                <Progress value={stat.percent} className="h-1.5 bg-muted" />
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-1.5 font-mono">
                  <span>
                    {stat.completed} / {stat.total}
                    {categoryWeights[cat] != null && (
                      <span className="text-primary/80 ml-1.5">
                        • {categoryWeights[cat]}% wt
                      </span>
                    )}
                  </span>
                  {stat.percent === 100 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="h-2.5 w-2.5" /> 100%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search objectives, locations, rewards, or personal notes..."
            className="input-search pl-10 pr-4 py-2.5 w-full text-xs bg-background text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="bg-muted/80 p-1 rounded-xl border border-border flex text-xs">
            <button
              onClick={() => setFilterStatus("all")}
              className={cn(
                "px-3 py-2.5 rounded-lg font-medium transition-colors",
                filterStatus === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              All ({activeMilestones.length})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={cn(
                "px-3 py-2.5 rounded-lg font-medium transition-colors",
                filterStatus === "pending"
                  ? "bg-gold/20 text-gold-dark dark:text-gold-light font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Pending ({activeMilestones.length - totalCompleted})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={cn(
                "px-3 py-2.5 rounded-lg font-medium transition-colors",
                filterStatus === "completed"
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Completed ({totalCompleted})
            </button>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {filteredMilestones.length === 0 ? (
          <div className="card-carbon p-12 text-center">
            <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-foreground">
              No Milestones Found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No checklist objectives matched your current search and category
              filters. Try clearing your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setFilterStatus("all");
              }}
              className="btn-secondary text-xs px-4 py-3 mt-4 inline-flex items-center gap-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMilestones.map((item) => {
            const isDone = completedIds.includes(item.id);
            const userNote = personalNotes[item.id];
            const isEditing = editingNoteId === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  "card-carbon p-4 transition-all duration-200 border",
                  isDone
                    ? "border-emerald-500/30 bg-emerald-500/[0.05] dark:bg-emerald-950/20"
                    : "border-border hover:border-border/80 bg-card hover:bg-card/90 shadow-sm",
                )}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Toggle Checkbox Button */}
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="mt-0.5 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    aria-label={`Mark ${item.title} as ${isDone ? "incomplete" : "complete"}`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 dark:text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground/40 hover:text-primary transition-colors" />
                    )}
                  </button>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {item.category}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-accent" />{" "}
                        {item.district}
                      </span>
                      <ConfidenceBadge
                        confidence={item.confidence}
                        source={item.source}
                        size="sm"
                      />
                    </div>

                    <h3
                      className={cn(
                        "font-display text-base font-bold text-foreground transition-all",
                        isDone && "line-through text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-gold-dark dark:text-gold-light font-mono text-xs">
                        <Trophy className="h-3.5 w-3.5 text-gold-dark dark:text-gold-light" />
                        <span>Reward: {item.reward}</span>
                      </div>

                      {item.mapPoiId && (
                        <Link
                          href={`/map?poi=${item.mapPoiId}`}
                          className="text-xs font-medium text-accent hover:underline flex items-center gap-1 py-2"
                        >
                          <MapPin className="h-3 w-3" /> View On Live Map
                        </Link>
                      )}

                      {/* Personal Note Button */}
                      <button
                        onClick={() => {
                          setEditingNoteId(isEditing ? null : item.id);
                          setNoteText(userNote || "");
                        }}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 py-2"
                      >
                        <FileEdit className="h-3 w-3" />
                        {userNote ? "Edit Personal Note" : "+ Add Note"}
                      </button>
                    </div>

                    {/* Personal Note Box */}
                    {userNote && !isEditing && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-muted/50 border border-border text-xs text-foreground font-mono">
                        <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-1">
                          Personal Field Note:
                        </span>
                        {userNote}
                      </div>
                    )}

                    {/* Note Editor Drawer */}
                    {isEditing && (
                      <div className="mt-3 p-3 rounded-lg bg-card border border-primary/40 shadow-lg space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                          Add Field Note for: {item.title}
                        </label>
                        <textarea
                          rows={2}
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="e.g., Hidden package located underneath eastern dock piling at low tide..."
                          className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono transition-all"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="btn-ghost text-xs px-4 py-2.5 text-muted-foreground hover:text-foreground"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(item.id)}
                            className="btn-primary text-xs px-4 py-2.5 font-bold"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
