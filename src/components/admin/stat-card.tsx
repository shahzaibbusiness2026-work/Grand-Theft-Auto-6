"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
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
    primary: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
    success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    warning: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    danger: "text-rose-400 bg-rose-500/10 border-rose-500/25",
    info: "text-sky-400 bg-sky-500/10 border-sky-500/25",
  };

  const glowGradients = {
    primary: "from-indigo-500/5 to-transparent",
    success: "from-emerald-500/5 to-transparent",
    warning: "from-amber-500/5 to-transparent",
    danger: "from-rose-500/5 to-transparent",
    info: "from-sky-500/5 to-transparent",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 relative overflow-hidden transition-all duration-200 hover:border-[var(--admin-primary)]/40 hover:shadow-lg hover:shadow-black/20 group",
        className
      )}
    >
      {/* Subtle top-right glow */}
      <div
        className={cn(
          "absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br blur-2xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-60",
          glowGradients[accentColor]
        )}
      />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
          {label}
        </span>
        <span className={cn("p-2.5 rounded-xl border shadow-sm transition-transform group-hover:scale-105", iconColorClasses[accentColor])}>
          <Icon className="w-4 h-4" />
        </span>
      </div>

      <div className="mt-3.5 flex items-baseline gap-2.5 relative z-10">
        <span className="text-3xl sm:text-4xl font-mono font-black text-[var(--admin-text)] tracking-tight tabular-nums">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border",
              trend.isPositive
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                : "text-rose-400 bg-rose-500/10 border-rose-500/25"
            )}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{trend.value}</span>
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs text-[var(--admin-text-muted)] font-medium truncate relative z-10">
          {subtext}
        </p>
      )}
    </div>
  );
}
