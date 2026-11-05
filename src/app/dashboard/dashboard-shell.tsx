"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { CompanionSidebar } from "@/components/dashboard/companion-sidebar";
import { CompanionTopBar } from "@/components/dashboard/companion-topbar";
import {
  PlayerSyncStatus,
  usePlayerSync,
  type PlayerProfile,
} from "@/components/player-sync-provider";
export function DashboardShell({
  children,
  initialProfile,
}: {
  children: React.ReactNode;
  initialProfile: PlayerProfile;
}) {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const { profile } = usePlayerSync();
  const name =
    (profile || initialProfile).displayName ||
    (profile || initialProfile).firstName ||
    "Player";
  useEffect(() => {
    if (!open) return;
    const prior = document.activeElement as HTMLElement;
    closeButton.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        const focusable =
          closeButton.current?.parentElement?.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled]), input, select, textarea",
          );
        if (!focusable?.length) return;
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      prior?.focus();
    };
  }, [open]);
  return (
    <div className="dashboard-type flex h-dvh w-full overflow-hidden bg-background text-foreground">
      <div className="hidden shrink-0 md:flex">
        <CompanionSidebar />
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard navigation"
        >
          <button
            tabIndex={-1}
            className="fixed inset-0 bg-black/80"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <div className="player-drawer relative z-10 flex w-72 flex-col bg-card">
            <button
              ref={closeButton}
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg border border-white/20 p-3"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
            <CompanionSidebar onItemClick={() => setOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <CompanionTopBar onMenuToggle={() => setOpen(true)} userName={name} />
        <main
          id="player-main"
          className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-[1540px] space-y-6 pb-12">
            <PlayerSyncStatus />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
