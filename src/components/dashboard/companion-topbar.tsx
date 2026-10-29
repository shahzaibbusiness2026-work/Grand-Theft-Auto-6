"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Moon, Sun, ChevronDown, Menu, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { CommandPalette } from "@/components/command-palette";
import { logoutUser } from "@/lib/user-store";

import { cn } from "@/lib/utils";

interface CompanionTopBarProps {
  onMenuToggle?: () => void;
  userName?: string;
}

function initialsFor(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (!words.length) return "P";
  return words
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export function CompanionTopBar({ onMenuToggle, userName = "Player" }: CompanionTopBarProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  function handleSignOut() {
    logoutUser();
    setProfileOpen(false);
    router.push("/login");
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/[0.08] dark:border-white/[0.08] border-slate-200 bg-[#070b14]/85 dark:bg-[#070b14]/85 bg-white/90 px-4 sm:px-6 backdrop-blur-xl transition-colors">
        {/* Left: Mobile hamburger + Search bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {onMenuToggle && (
            <button
              type="button"
              onClick={onMenuToggle}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white md:hidden"
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
            <kbd className="hidden sm:inline-flex items-center rounded border border-white/20 bg-white/[0.06] px-1.5 py-0.5 font-mono text-xs font-bold text-slate-300">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Controls & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 ml-4">
          {/* Enhanced Theme switcher with Bright Mode Glow */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={cn(
              "flex h-11 px-2.5 items-center gap-1.5 rounded-xl border transition-all active:scale-95 shadow-sm",
              resolvedTheme === "light"
                ? "border-gold-light/60 bg-amber-50 text-gold-dark shadow-[0_0_12px_rgba(201,168,106,0.35)] ring-1 ring-gold-light/40"
                : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-[#00F0FF]/40 hover:bg-white/[0.08] hover:text-[#00F0FF]"
            )}
            title={`Switch to ${resolvedTheme === "dark" ? "Bright Mode" : "Dark Mode"}`}
          >
            {resolvedTheme === "light" ? (
              <>
                <Sun className="h-4 w-4 text-gold fill-gold-light drop-shadow-[0_0_8px_rgba(201,168,106,0.9)] animate-pulse" />
                <span className="hidden sm:inline font-mono text-xs font-black uppercase tracking-wider text-gold-dark">
                  Bright
                </span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]" />
                <span className="hidden sm:inline font-mono text-xs font-black uppercase tracking-wider text-slate-400">
                  Dark
                </span>
              </>
            )}
          </button>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-xl border border-transparent p-1 sm:px-2 sm:py-1 transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              {/* Avatar circle — initials of the account's own name */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-gold to-yellow-400 text-xs font-black text-slate-950 shadow-[0_0_12px_rgba(201,168,106,0.4)]">
                {initialsFor(userName)}
              </div>

              {/* Text info */}
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs text-slate-400 font-medium">Welcome back,</span>
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
                    className="block rounded-lg px-3 py-1.5 text-xs text-gold-light hover:bg-gold/10"
                  >
                    Membership
                  </a>
                </div>
                <div className="border-t border-white/10 pt-1">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign out
                  </button>
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
