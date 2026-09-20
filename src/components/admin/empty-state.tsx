"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  guidelines?: string[];
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  guidelines,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-card)]/30 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--admin-elevated)] border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-primary)] shadow-inner mb-4">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-[var(--admin-text)]">{title}</h3>
      <p className="text-xs text-[var(--admin-text-muted)] mt-1.5 max-w-md leading-relaxed">
        {description}
      </p>

      {guidelines && guidelines.length > 0 && (
        <div className="mt-6 text-left w-full bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl p-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
            Guidelines:
          </p>
          <ul className="text-xs text-[var(--admin-text-muted)] space-y-1.5 list-disc list-inside">
            {guidelines.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      {action && (
        <div className="mt-6">
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--admin-primary)] hover:opacity-90 text-white text-xs font-bold shadow-md shadow-[var(--admin-primary)]/20 transition-all"
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            <span>{action.label}</span>
          </button>
        </div>
      )}
    </div>
  );
}
