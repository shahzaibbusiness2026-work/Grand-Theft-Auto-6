"use client";

import { useState } from "react";
import { Search, Moon, Sun, Bell, ChevronDown, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { CommandPalette } from "@/components/command-palette";

interface CompanionTopBarProps {
  onMenuToggle?: () => void;
  userName?: string;
}

export function CompanionTopBar({ onMenuToggle, userName = "Zuhaib" }: CompanionTopBarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/[0.08] bg-[#070b14]/85 px-4 sm:px-6 backdrop-blur-xl">
        {/* Left: Mobile hamburger + Search bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {onMenuToggle && (
            <button
              type="button"
              onClick={onMenuToggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-slate-400 shadow-inner transition-all hover:border-[#00F0FF]/40 hover:bg-white/[0.06] hover:text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-slate-400" />
              <span className="truncate">Search anything in GTA 6...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center rounded border border-white/20 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-300">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Controls & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 ml-4">
          {/* Theme switcher */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-all hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            title="Toggle theme"
          >
            {resolvedTheme === "light" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-[#00F0FF]" />
            )}
          </button>

          {/* Notifications button with badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationOpen((prev) => !prev)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-all hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                1
              </span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/15 bg-[#0c1220]/95 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-display text-xs font-bold text-white">Notifications</span>
                  <span className="text-[10px] text-amber-400 font-semibold">1 New</span>
                </div>
                <div className="mt-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/5 text-xs">
                  <p className="font-semibold text-white">Trailer 2 Breakdown Active</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">24 verified locations mapped in Vice City.</p>
                  <span className="text-[9px] text-slate-500 mt-1 block">10m ago</span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-xl border border-transparent p-1 sm:px-2 sm:py-1 transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              {/* Avatar circle */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-xs font-black text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                ZB
              </div>

              {/* Text info */}
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-slate-400 font-medium">Welcome back,</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white tracking-wide">{userName}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/15 bg-[#0c1220]/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 z-50">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-bold text-white">{userName}</p>
                  <p className="text-[10px] text-cyan-400 font-mono">Vice City Legend · Lvl 12</p>
                </div>
                <div className="py-1">
                  <a
                    href="/tracker"
                    className="block rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white"
                  >
                    100% Tracker
                  </a>
                  <a
                    href="/pricing"
                    className="block rounded-lg px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/10"
                  >
                    Vice City Pro
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette modal */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
