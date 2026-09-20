"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
  Sparkles
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
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

export default function AdminTasksPage() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<AdminTask[]>([
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
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    showToast({
      title: "Task Updated",
      description: "Task completion status changed.",
      type: "info",
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const created: AdminTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
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

      {/* Add Task Input */}
      <form onSubmit={handleAddTask} className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new editorial verification task..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[var(--admin-primary)] text-white text-xs font-bold hover:opacity-90 shadow-md shadow-[var(--admin-primary)]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Tasks List */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-4 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={cn(
              "p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors",
              task.completed
                ? "bg-[var(--admin-surface)] border-[var(--admin-border-subtle)] opacity-60"
                : "bg-[var(--admin-surface)] border-[var(--admin-border)] hover:border-[var(--admin-primary)]/40"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}} // handled by row click
                className="rounded border-[var(--admin-border)] text-[var(--admin-primary)]"
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
                  <span className="px-1.5 py-0.2 rounded bg-[var(--admin-elevated)] border border-[var(--admin-border-subtle)]">
                    {task.category}
                  </span>
                </div>
              </div>
            </div>

            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 border",
                task.priority === "high" &&
                  "bg-rose-500/10 text-rose-400 border-rose-500/30",
                task.priority === "medium" &&
                  "bg-amber-500/10 text-amber-400 border-amber-500/30",
                task.priority === "low" &&
                  "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
              )}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
