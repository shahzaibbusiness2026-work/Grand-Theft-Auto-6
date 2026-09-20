"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({ rows = 5, className }: LoadingSkeletonProps) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl border border-[var(--admin-border-subtle)] bg-[var(--admin-card)]/50 animate-pulse"
        >
          {/* Checkbox */}
          <div className="w-4 h-4 rounded bg-[var(--admin-elevated)] shrink-0" />

          {/* Avatar or Icon */}
          <div className="w-10 h-10 rounded-xl bg-[var(--admin-elevated)] shrink-0" />

          {/* Name & Subtext */}
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/4 rounded bg-[var(--admin-elevated)]" />
            <div className="h-2.5 w-1/3 rounded bg-[var(--admin-elevated)]/60" />
          </div>

          {/* Badges */}
          <div className="hidden sm:block h-6 w-16 rounded-full bg-[var(--admin-elevated)] shrink-0" />
          <div className="hidden md:block h-6 w-24 rounded-full bg-[var(--admin-elevated)] shrink-0" />
          <div className="hidden lg:block h-6 w-20 rounded-full bg-[var(--admin-elevated)] shrink-0" />

          {/* Action icon */}
          <div className="w-8 h-8 rounded-lg bg-[var(--admin-elevated)] shrink-0" />
        </div>
      ))}
    </div>
  );
}
