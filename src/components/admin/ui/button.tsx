"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "danger"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all duration-150 rounded-xl select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--admin-bg)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-[var(--admin-primary)] text-white hover:opacity-90 shadow-md shadow-[var(--admin-primary)]/25 active:shadow-sm",
      secondary:
        "bg-[var(--admin-elevated)] text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-[var(--admin-card)] hover:border-[var(--admin-border-subtle)]",
      tertiary:
        "bg-transparent text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]",
      outline:
        "bg-transparent text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-[var(--admin-elevated)] hover:border-[var(--admin-primary)]/50",
      ghost:
        "bg-transparent text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 active:shadow-sm",
      link:
        "bg-transparent text-[var(--admin-primary)] hover:underline p-0 h-auto rounded-none",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 sm:h-10 px-4 text-xs gap-2",
      lg: "h-11 px-5 text-sm gap-2.5",
      icon: "h-9 w-9 p-0 shrink-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
