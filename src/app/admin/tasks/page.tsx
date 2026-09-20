"use client";

import React, { useState, useMemo } from "react";
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
  Sparkles,
  Trash2,
  Filter,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import { Tooltip } from "@/components/admin/ui/tooltip";
import { cn } from "@/lib/utils";

interface AdminTask {
  id: string;
  title: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
  category: string;
}

const INITIAL_TASKS: AdminTask[] = [
  {
    id: "task-1",
    title: "Corroborate Banshee GTS speedometer in trailer 1 frame 0:42",
    assignee: "Morgan Kim",
    priority: "high",
    dueDate: "Sep 22, 2026",
    completed: false,
    category: "Vehicles",
  },
  {
    id: "task-2",
    title: "Recalibrate Vice City Metro station coordinates on interactive map",
    assignee: "Alex Rivera",
    priority: "high",
    dueDate: "Sep 23, 2026",
    completed: false,
    category: "Map",
  },
  {
    id: "task-3",
    title: "Complete editorial proofread on 'Trailer details to verify'",
    assignee: "Jamie Lee",
    priority: "medium",
    dueDate: "Sep 24, 2026",
    completed: false,
    category: "Articles",
  },
  {
    id: "task-4",
    title: "Audit license permissions for 24 trailer screenshots",
    assignee: "Elena Rostova",
    priority: "low",
    dueDate: "Sep 28, 2026",
    completed: true,
    category: "Media",
  },
];

export default function AdminTasksPage() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<AdminTask[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterStatus === "pending" && task.completed) return false;
      if (filterStatus === "completed" && !task.completed) return false;
      if (filterPriority !== "all" && task.priority !== filterPriority) return false;
      return true;
    });
  }, [tasks, filterStatus, filterPriority]);

  const hasActiveFilters = filterStatus !== "all" || filterPriority !== "all";

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    showToast({
      title: "Task Status Updated",
      description: "Task completion status changed.",
      type: "info",
    });
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const taskToDelete = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast({
      title: "Task Deleted",
      description: `"${taskToDelete?.title || "Task"}" removed from queue.`,
      type: "success",
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const created: AdminTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignee: "Administrator",
      priority: "medium",
      dueDate: "Sep 25, 2026",
      completed: false,
      category: "General",
    };
    setTasks([created, ...tasks]);
    setNewTaskTitle("");
    showToast({
      title: "Task Created",
      description: `"${created.title}" added to queue.`,
      type: "success",
    });
  };

  const resetFilters = () => {
    setFilterStatus("all");
    setFilterPriority("all");
  };

  const getPriorityBadgeVariant = (priority: AdminTask["priority"]) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Editorial Tasks & Triage</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Track verification workflows, editorial assignments, and database corroboration milestones.
          </p>
        </div>
      </div>

      {/* Add Task Input Form */}
      <form onSubmit={handleAddTask} className="flex gap-2">
        <label htmlFor="new-task-input" className="sr-only">
          Add new editorial verification task
        </label>
        <input
          id="new-task-input"
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new editorial verification task..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] transition-all"
        />
        <Button
          type="submit"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          disabled={!newTaskTitle.trim()}
        >
          Add Task
        </Button>
      </form>

      {/* Filter Tabs & Priority Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)]">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Filter tasks by completion status">
          <button
            type="button"
            role="tab"
            aria-selected={filterStatus === "all"}
            onClick={() => setFilterStatus("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
              filterStatus === "all"
                ? "bg-[var(--admin-primary)] text-white shadow-sm"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
            )}
          >
            All ({tasks.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filterStatus === "pending"}
            onClick={() => setFilterStatus("pending")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
              filterStatus === "pending"
                ? "bg-[var(--admin-primary)] text-white shadow-sm"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
            )}
          >
            Pending ({tasks.filter((t) => !t.completed).length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filterStatus === "completed"}
            onClick={() => setFilterStatus("completed")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
              filterStatus === "completed"
                ? "bg-[var(--admin-primary)] text-white shadow-sm"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
            )}
          >
            Completed ({tasks.filter((t) => t.completed).length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-xs font-bold text-[var(--admin-text-muted)] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Priority:
          </label>
          <select
            id="priority-filter"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Active Filters Reset Bar */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            <span>
              Filtered: {filterStatus !== "all" ? `Status: ${filterStatus}` : ""}
              {filterStatus !== "all" && filterPriority !== "all" ? " • " : ""}
              {filterPriority !== "all" ? `Priority: ${filterPriority}` : ""}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            leftIcon={<RotateCcw className="w-3 h-3" />}
            className="text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 h-7 px-2 text-[11px]"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Tasks List */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-4 space-y-3 shadow-sm">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <CheckSquare className="w-8 h-8 text-[var(--admin-text-muted)] mx-auto opacity-50" />
            <p className="text-xs font-bold text-[var(--admin-text)]">No tasks found</p>
            <p className="text-xs text-[var(--admin-text-muted)]">
              No tasks match your current filter criteria.
            </p>
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              role="button"
              tabIndex={0}
              aria-pressed={task.completed}
              onClick={() => toggleTask(task.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTask(task.id);
                }
              }}
              className={cn(
                "p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                task.completed
                  ? "bg-[var(--admin-surface)] border-[var(--admin-border-subtle)] opacity-60"
                  : "bg-[var(--admin-surface)] border-[var(--admin-border)] hover:border-[var(--admin-primary)]/40 hover:bg-[var(--admin-card)]"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  id={`task-check-${task.id}`}
                  checked={task.completed}
                  onChange={() => {}} // handled by row click & onKeyDown
                  tabIndex={-1}
                  aria-label={`Mark "${task.title}" as ${task.completed ? "pending" : "completed"}`}
                  className="rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-0 focus:ring-offset-0 pointer-events-none"
                />
                <div className="space-y-0.5 min-w-0">
                  <p
                    className={cn(
                      "text-xs font-bold truncate",
                      task.completed
                        ? "line-through text-[var(--admin-text-muted)]"
                        : "text-[var(--admin-text)]"
                    )}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--admin-text-muted)] font-medium">
                    <span>Assignee: {task.assignee}</span>
                    <span>•</span>
                    <span>Due: {task.dueDate}</span>
                    <span>•</span>
                    <Badge variant="neutral" size="sm">
                      {task.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={getPriorityBadgeVariant(task.priority)} size="sm">
                  {task.priority}
                </Badge>

                <Tooltip content="Delete task">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteTask(task.id, e)}
                    className="text-[var(--admin-text-muted)] hover:text-rose-400 hover:bg-rose-500/10 h-7 w-7"
                    aria-label={`Delete task: ${task.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
