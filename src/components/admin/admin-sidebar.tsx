"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  FileText,
  Tag,
  Image as ImageIcon,
  Car,
  Crosshair,
  MapPin,
  Users,
  Compass,
  GitCompare,
  Map,
  CheckCircle2,
  Shield,
  BarChart3,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "primary" | "warning" | "default";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Tasks", href: "/admin/tasks", icon: CheckSquare, badge: "3", badgeVariant: "warning" },
      { label: "Activity", href: "/admin/activity", icon: Activity },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Articles", href: "/admin/articles", icon: FileText, badge: "128" },
      { label: "Categories & Tags", href: "/admin/categories", icon: Tag },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon, badge: "2.4k" },
    ],
  },
  {
    title: "Game Database",
    items: [
      { label: "Vehicles", href: "/admin/vehicles", icon: Car, badge: "84" },
      { label: "Weapons", href: "/admin/weapons", icon: Crosshair, badge: "36" },
      { label: "Locations", href: "/admin/locations", icon: MapPin, badge: "52" },
      { label: "Characters", href: "/admin/characters", icon: Users, badge: "18" },
      { label: "Missions", href: "/admin/missions", icon: Compass },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Comparisons", href: "/admin/comparisons", icon: GitCompare },
      { label: "Interactive Map", href: "/admin/map", icon: Map },
      { label: "Completion Tracker", href: "/admin/tracker", icon: CheckCircle2 },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Users & Roles", href: "/admin/users", icon: Shield, badge: "5" },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "SEO Settings", href: "/admin/seo", icon: Search },
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({
  isCollapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out",
          "bg-[var(--admin-surface)] border-[var(--admin-border)] text-[var(--admin-text)]",
          isCollapsed ? "w-20" : "w-64",
          // Mobile responsive slide-over
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--admin-border)]">
          <Link
            href="/admin"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] rounded-lg p-1"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white font-black text-sm shadow-md shadow-purple-500/20">
              VI
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-display font-black tracking-wider text-sm text-[var(--admin-text)] flex items-center gap-1.5">
                  ATLAS <span className="text-[var(--admin-primary)]">ADMIN</span>
                </span>
                <span className="text-[10px] text-[var(--admin-text-muted)] font-medium truncate">
                  Leonida Research Hub
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center h-7 w-7 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-[var(--admin-border)]">
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] select-none">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onCloseMobile?.()}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative overflow-hidden",
                        isActive
                          ? "bg-[var(--admin-primary)] text-white shadow-md shadow-[var(--admin-primary)]/25 font-bold"
                          : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white/90 shadow-sm" />
                      )}
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110",
                          isActive ? "text-white" : "text-[var(--admin-text-muted)] group-hover:text-[var(--admin-text)]"
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

                      {!isCollapsed && item.badge && (
                        <span
                          className={cn(
                            "px-1.5 py-0.5 text-[10px] font-black rounded-full transition-colors",
                            isActive
                              ? "bg-white/20 text-white"
                              : item.badgeVariant === "warning"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-[var(--admin-elevated)] text-[var(--admin-text-muted)] border border-[var(--admin-border-subtle)]"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[var(--admin-border)] space-y-2 bg-[var(--admin-surface)]">
          <Link
            href="/"
            target="_blank"
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors",
              isCollapsed && "justify-center px-2"
            )}
            title="View Public Site"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">Public Portal</span>}
          </Link>

          {!isCollapsed && (
            <div className="p-2.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  AD
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--admin-card)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[var(--admin-text)] truncate">Administrator</p>
                <p className="text-[10px] text-[var(--admin-text-muted)] truncate">admin@atlas-gta6.com</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
