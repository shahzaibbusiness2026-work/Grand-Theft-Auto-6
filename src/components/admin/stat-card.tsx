"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  accentColor = "primary",
  className,
}: StatCardProps) {
  const iconColorClasses = {
    primary: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    danger: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    info: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 relative overflow-hidden transition-all duration-200 hover:border-[var(--admin-border-subtle)] hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
          {label}
        </span>
        <span className={cn("p-2 rounded-xl border", iconColorClasses[accentColor])}>
          <Icon className="w-4 h-4" />
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-mono font-black text-[var(--admin-text)] tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded-md",
              trend.isPositive
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-rose-400 bg-rose-500/10"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-[var(--admin-text-muted)] font-medium truncate">
          {subtext}
        </p>
      )}
    </div>
  );
}
