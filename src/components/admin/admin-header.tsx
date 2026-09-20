"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
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
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
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

export function AdminHeader({
  onOpenMobileMenu,
  isSidebarCollapsed = false,
  onToggleSidebar,
}: AdminHeaderProps) {
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
      <header className="sticky top-0 z-40 h-16 border-b border-[#1C2436] bg-[#0B0E14]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
        {/* Left Side: Sidebar Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Universal Sidebar Toggle Button (Mobile: drawer, Desktop: collapse/expand) */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.innerWidth < 1024) {
                onOpenMobileMenu?.();
              } else {
                onToggleSidebar?.();
              }
            }}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#141B2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] shrink-0"
            aria-label={isSidebarCollapsed ? "Expand sidebar navigation (⌘B)" : "Collapse sidebar navigation (⌘B)"}
            title={isSidebarCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 hidden lg:block" />
            ) : (
              <PanelLeftClose className="w-5 h-5 hidden lg:block" />
            )}
            <Menu className="w-5 h-5 lg:hidden" />
          </button>

          {/* Breadcrumbs (matching Image 1: Home icon > Workspace > Overview) */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[#94A3B8] overflow-hidden truncate"
          >
            <Link
              href="/admin"
              className="hover:text-white font-medium transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded shrink-0"
            >
              <svg className="w-3.5 h-3.5 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </Link>
            {breadcrumbs.length > 1 ? (
              breadcrumbs.slice(1).map((crumb, i) => (
                <React.Fragment key={crumb.url}>
                  <span className="text-[#64748B] text-[11px] font-normal" aria-hidden="true">&gt;</span>
                  <Link
                    href={crumb.url}
                    aria-current={i === breadcrumbs.length - 2 ? "page" : undefined}
                    className={cn(
                      "truncate transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded text-xs",
                      i === breadcrumbs.length - 2
                        ? "text-white font-semibold"
                        : "hover:text-white text-[#94A3B8] font-medium"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </React.Fragment>
              ))
            ) : (
              <>
                <span className="text-[#64748B] text-[11px] font-normal" aria-hidden="true">&gt;</span>
                <span className="text-[#94A3B8] font-medium text-xs">Workspace</span>
                <span className="text-[#64748B] text-[11px] font-normal" aria-hidden="true">&gt;</span>
                <span className="text-white font-semibold text-xs" aria-current="page">
                  Overview
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Right Side: Search Bar, Notifications, User Profile (Image 1) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Bar matching Image 1: "Search records... ⌘ K" */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-keyshortcuts="Control+K Meta+K"
            className="hidden sm:flex items-center justify-between w-56 md:w-64 lg:w-72 px-3.5 py-1.5 rounded-xl border border-[#1C2436] bg-[#111622] text-xs text-[#94A3B8] hover:border-[#6366F1]/50 hover:text-white transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#818CF8]" />
              <span className="truncate">Search records...</span>
            </div>
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium bg-[#182030] border border-[#243048] rounded text-[#64748B] shrink-0">
              ⌘ K
            </kbd>
          </button>

          {/* Notifications Bell with unread dot */}
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
              className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#141B2A] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-[#0B0E14]" />
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
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#111622] border border-[#1C2436] shadow-2xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#1C2436]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">Notifications</span>
                      {unreadCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6366F1] text-white">
                          {unreadCount} new
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#182030] text-[#94A3B8]">
                          All caught up
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[11px] text-[#6366F1] font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 text-xs max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-[#64748B]">
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
                              ? "bg-[#0E131D]/50 border-[#1C2436]/60 opacity-70"
                              : "bg-[#0E131D] border-[#1C2436]"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              {!item.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                              )}
                              {item.title}
                            </span>
                            <span className="text-[10px] text-[#64748B]">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8]">{item.desc}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#1C2436] text-center">
                    <Link
                      href="/admin/activity"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs font-bold text-[#6366F1] hover:underline"
                    >
                      View full audit activity →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Menu (Image 1: circle avatar AD + "Administrator" + ChevronDown) */}
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
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-[#141B2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-[11px] shadow-sm shrink-0">
                AD
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-white">
                Administrator
              </span>
              <svg className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
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
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#111622] border border-[#1C2436] shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 border-b border-[#1C2436]">
                    <p className="text-xs font-bold text-white">Administrator</p>
                    <p className="text-[10px] text-[#64748B] truncate">admin@atlas-gta6.com</p>
                    <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      <ShieldCheck className="w-3 h-3" /> Senior Editor
                    </span>
                  </div>

                  <Link
                    role="menuitem"
                    href="/admin/users"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-white hover:bg-[#182030] transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile & Team</span>
                  </Link>

                  <Link
                    role="menuitem"
                    href="/admin/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-white hover:bg-[#182030] transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5" />
                    <span>Site Settings</span>
                  </Link>

                  <div className="border-t border-[#1C2436] my-1" />

                  <Link
                    role="menuitem"
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-white hover:bg-[#182030] transition-colors"
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
