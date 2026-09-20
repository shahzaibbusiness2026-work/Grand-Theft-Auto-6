"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ExternalLink,
  Settings as SettingsIcon,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandMenu } from "./command-menu";

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Source Verified",
    desc: "Morgan Kim verified source for Bravado Banshee GTS.",
    time: "12m ago",
    read: false,
  },
  {
    id: "2",
    title: "Marker Displaced",
    desc: "Vice City Metro map marker coordinates require recalibration.",
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    title: "Article Scheduled",
    desc: '"Comparing database records" scheduled for Sep 24, 2026.',
    time: "3h ago",
    read: false,
  },
];

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Close dropdowns on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isNotificationsOpen) setIsNotificationsOpen(false);
        if (isProfileOpen) setIsProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNotificationsOpen, isProfileOpen]);

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
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)] overflow-hidden truncate"
          >
            <Link
              href="/admin"
              className="hover:text-[var(--admin-text)] font-semibold transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] rounded"
            >
              <span>Atlas</span>
            </Link>
            {breadcrumbs.length > 1 ? (
              breadcrumbs.slice(1).map((crumb, i) => (
                <React.Fragment key={crumb.url}>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" aria-hidden="true" />
                  <Link
                    href={crumb.url}
                    aria-current={i === breadcrumbs.length - 2 ? "page" : undefined}
                    className={cn(
                      "truncate transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] rounded",
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
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" aria-hidden="true" />
                <span className="text-[var(--admin-text)] font-bold" aria-current="page">
                  Overview
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Right Side: Search Trigger, System Status, Theme Toggle, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-keyshortcuts="Control+K Meta+K"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:border-[var(--admin-primary)] transition-all shadow-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
          >
            <Search className="w-3.5 h-3.5 text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)]" />
            <span className="hidden md:inline font-medium">Quick search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[var(--admin-elevated)] border border-[var(--admin-border)] rounded text-[var(--admin-text-muted)]">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 animate-in spin-in-90 duration-200" />
            )}
          </button>

          {/* Notifications Popover Trigger */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                if (isProfileOpen) setIsProfileOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={isNotificationsOpen}
              aria-label={
                unreadCount > 0
                  ? `Notifications (${unreadCount} unread)`
                  : "Notifications (none unread)"
              }
              className="p-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors shadow-sm relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--admin-primary)] ring-2 ring-[var(--admin-surface)]" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationsOpen(false)}
                  aria-hidden="true"
                />
                <div
                  role="region"
                  aria-label="Notification Center"
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--admin-surface)] border border-[var(--admin-border)] shadow-xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--admin-border-subtle)]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[var(--admin-text)]">Notifications</span>
                      {unreadCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--admin-primary)] text-white">
                          {unreadCount} new
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[var(--admin-elevated)] text-[var(--admin-text-muted)]">
                          All caught up
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[11px] text-[var(--admin-primary)] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)] rounded"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 text-xs max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-[var(--admin-text-muted)]">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400 opacity-60" />
                        <p className="text-xs font-semibold">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "p-2.5 rounded-xl border space-y-1 transition-colors",
                            item.read
                              ? "bg-[var(--admin-card)]/50 border-[var(--admin-border-subtle)] opacity-70"
                              : "bg-[var(--admin-elevated)] border-[var(--admin-border)]"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[var(--admin-text)] flex items-center gap-1.5">
                              {!item.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--admin-primary)]" />
                              )}
                              {item.title}
                            </span>
                            <span className="text-[10px] text-[var(--admin-text-muted)]">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-[var(--admin-text-muted)]">{item.desc}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-[var(--admin-border-subtle)] text-center">
                    <Link
                      href="/admin/activity"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs font-bold text-[var(--admin-primary)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)] rounded"
                    >
                      View full audit activity →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                if (isNotificationsOpen) setIsNotificationsOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
              aria-label="User profile menu"
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] hover:bg-[var(--admin-elevated)] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-[10px]">
                AD
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[var(--admin-text)]">
                Admin
              </span>
              <span className="text-[10px] text-[var(--admin-text-muted)]" aria-hidden="true">
                ▾
              </span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                  aria-hidden="true"
                />
                <div
                  role="menu"
                  aria-label="User actions"
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--admin-surface)] border border-[var(--admin-border)] shadow-xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 border-b border-[var(--admin-border-subtle)]">
                    <p className="text-xs font-bold text-[var(--admin-text)]">Administrator</p>
                    <p className="text-[10px] text-[var(--admin-text-muted)] truncate">admin@atlas-gta6.com</p>
                    <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      <ShieldCheck className="w-3 h-3" /> Senior Editor
                    </span>
                  </div>

                  <Link
                    role="menuitem"
                    href="/admin/users"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile & Team</span>
                  </Link>

                  <Link
                    role="menuitem"
                    href="/admin/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
                  >
                    <SettingsIcon className="w-3.5 h-3.5" />
                    <span>Site Settings</span>
                  </Link>

                  <div className="border-t border-[var(--admin-border-subtle)] my-1" />

                  <Link
                    role="menuitem"
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
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
