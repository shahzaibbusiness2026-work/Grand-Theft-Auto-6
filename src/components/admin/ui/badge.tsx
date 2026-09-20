"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  pulse = false,
  icon,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-bold font-mono tracking-wider uppercase rounded-full border select-none shrink-0 transition-colors";

  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    success: {
      container:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
      dot: "bg-emerald-400",
    },
    warning: {
      container:
        "bg-amber-500/10 text-amber-400 border-amber-500/25",
      dot: "bg-amber-400",
    },
    danger: {
      container:
        "bg-rose-500/10 text-rose-400 border-rose-500/25",
      dot: "bg-rose-400",
    },
    info: {
      container:
        "bg-sky-500/10 text-sky-400 border-sky-500/25",
      dot: "bg-sky-400",
    },
    neutral: {
      container:
        "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      dot: "bg-zinc-400",
    },
    primary: {
      container:
        "bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] border-[var(--admin-primary)]/25",
      dot: "bg-[var(--admin-primary)]",
    },
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "h-5 px-2 text-[10px] gap-1",
    md: "h-6 px-2.5 text-xs gap-1.5",
    lg: "h-7 px-3 text-xs gap-2",
  };

  const current = variantStyles[variant];

  return (
    <span
      className={cn(
        baseStyles,
        current.container,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                current.dot
              )}
            />
          )}
          <span
            className={cn("relative inline-flex rounded-full h-1.5 w-1.5", current.dot)}
          />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
