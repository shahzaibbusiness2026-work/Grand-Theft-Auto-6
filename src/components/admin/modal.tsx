"use client";

import React, { useEffect, useRef, useId } from "react";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "danger" | "warning";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  variant = "default",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const id = useId();
  const titleId = `modal-title-${id}`;
  const descId = `modal-desc-${id}`;

  useEffect(() => {
    if (!isOpen) return;

    // Store previous focus to restore on close
    previousActiveElement.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    // Focus initial element in dialog
    const focusTimer = setTimeout(() => {
      if (dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          dialogRef.current.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      // Trap focus
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === "function") {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Dialog box */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "relative w-full rounded-2xl bg-[var(--admin-surface)] border border-[var(--admin-border)] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 focus:outline-none",
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--admin-border)] flex items-start justify-between bg-[var(--admin-card)]">
          <div className="flex items-start gap-3">
            {variant === "danger" && (
              <div
                className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0"
                aria-hidden="true"
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            {variant === "warning" && (
              <div
                className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0"
                aria-hidden="true"
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 id={titleId} className="text-base font-bold text-[var(--admin-text)]">
                {title}
              </h3>
              {description && (
                <p id={descId} className="text-xs text-[var(--admin-text-muted)] mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] focus-visible:outline-none"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {children && <div className="p-6">{children}</div>}

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--admin-border)] bg-[var(--admin-card)] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
