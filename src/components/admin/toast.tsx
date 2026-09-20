"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "warning" | "danger" | "info";
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ duration = 4000, ...toast }: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, duration, ...toast };

      // Keep max 3 concurrent toasts to prevent clutter
      setToasts((prev) => [...prev.slice(-2), newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Accessible Toast Container */}
      <div
        role="region"
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none"
      >
        {toasts.map((t) => {
          const typeIcons = {
            success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
            warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
            danger: <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />,
            info: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
          };

          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-xl bg-[var(--admin-surface)] text-[var(--admin-text)] border-[var(--admin-border)] animate-in slide-in-from-bottom-2 fade-in duration-200"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {typeIcons[t.type || "info"]}
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{t.title}</p>
                  {t.description && (
                    <p className="text-[11px] text-[var(--admin-text-muted)] truncate">
                      {t.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {t.action && (
                  <button
                    type="button"
                    onClick={() => {
                      t.action?.onClick();
                      removeToast(t.id);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[var(--admin-primary)] bg-[var(--admin-primary)]/10 hover:bg-[var(--admin-primary)]/20 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] focus-visible:outline-none"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.action.label}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="p-1 rounded-md text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] focus-visible:outline-none"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
