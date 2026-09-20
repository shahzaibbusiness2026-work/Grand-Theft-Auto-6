"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  LogOut,
  Settings as SettingsIcon,
  User,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandMenu } from "./command-menu";

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Generate breadcrumbs from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => {
    const url = "/" + segments.slice(0, idx + 1).join("/");
    const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace("-", " ");
    return { label, url };
  });

  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
        {/* Left Side: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)] overflow-hidden truncate">
            <Link
              href="/admin"
              className="hover:text-[var(--admin-text)] font-semibold transition-colors flex items-center gap-1"
            >
              <span>Atlas</span>
            </Link>
            {breadcrumbs.length > 1 ? (
              breadcrumbs.slice(1).map((crumb, i) => (
                <React.Fragment key={crumb.url}>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
                  <Link
                    href={crumb.url}
                    className={cn(
                      "truncate transition-colors",
                      i === breadcrumbs.length - 2
                        ? "text-[var(--admin-text)] font-bold"
                        : "hover:text-[var(--admin-text)] font-medium"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </React.Fragment>
              ))
            ) : (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
                <span className="text-[var(--admin-text)] font-bold">Overview</span>
              </>
            )}
          </nav>
        </div>

        {/* Right Side: Search Trigger, System Status, Theme Toggle, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:border-[var(--admin-primary)] transition-all shadow-sm group"
          >
            <Search className="w-3.5 h-3.5 text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)]" />
            <span className="hidden md:inline font-medium">Quick search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[var(--admin-elevated)] border border-[var(--admin-border)] rounded text-[var(--admin-text-muted)]">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors shadow-sm"
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 animate-in spin-in-90 duration-200" />
            )}
          </button>

          {/* Notifications Popover Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors shadow-sm relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[var(--admin-surface)]" />
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--admin-surface)] border border-[var(--admin-border)] shadow-xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--admin-border-subtle)]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[var(--admin-text)]">Notifications</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--admin-primary)] text-white">
                        3 new
                      </span>
                    </div>
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-[11px] text-[var(--admin-primary)] font-semibold hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[var(--admin-elevated)] border border-[var(--admin-border-subtle)] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--admin-text)]">Source Verified</span>
                        <span className="text-[10px] text-[var(--admin-text-muted)]">12m ago</span>
                      </div>
                      <p className="text-[11px] text-[var(--admin-text-muted)]">
                        Morgan Kim verified source for <strong>Bravado Banshee GTS</strong>.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--admin-elevated)] border border-[var(--admin-border-subtle)] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--admin-text)]">Marker Displaced</span>
                        <span className="text-[10px] text-[var(--admin-text-muted)]">1h ago</span>
                      </div>
                      <p className="text-[11px] text-[var(--admin-text-muted)]">
                        Vice City Metro map marker coordinates require recalibration.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--admin-elevated)] border border-[var(--admin-border-subtle)] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--admin-text)]">Article Scheduled</span>
                        <span className="text-[10px] text-[var(--admin-text-muted)]">3h ago</span>
                      </div>
                      <p className="text-[11px] text-[var(--admin-text-muted)]">
                        &quot;Comparing database records&quot; scheduled for Sep 24, 2026.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--admin-border-subtle)] text-center">
                    <Link
                      href="/admin/activity"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs font-bold text-[var(--admin-primary)] hover:underline"
                    >
                      View full audit activity →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] hover:bg-[var(--admin-elevated)] transition-colors shadow-sm"
              aria-label="User profile"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-[10px]">
                AD
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[var(--admin-text)]">
                Admin
              </span>
              <span className="text-[10px] text-[var(--admin-text-muted)]">▾</span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--admin-surface)] border border-[var(--admin-border)] shadow-xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-[var(--admin-border-subtle)]">
                    <p className="text-xs font-bold text-[var(--admin-text)]">Administrator</p>
                    <p className="text-[10px] text-[var(--admin-text-muted)] truncate">admin@atlas-gta6.com</p>
                    <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      <ShieldCheck className="w-3 h-3" /> Senior Editor
                    </span>
                  </div>

                  <Link
                    href="/admin/users"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile & Team</span>
                  </Link>

                  <Link
                    href="/admin/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5" />
                    <span>Site Settings</span>
                  </Link>

                  <div className="border-t border-[var(--admin-border-subtle)] my-1" />

                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Public Site</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Search Modal */}
      <CommandMenu
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
