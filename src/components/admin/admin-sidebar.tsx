"use client";

import React, { useId, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "./ui/tooltip";

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
      { label: "Media", href: "/admin/media", icon: ImageIcon, badge: "2.4k" },
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
      { label: "SEO", href: "/admin/seo", icon: Search },
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
  const id = useId();

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        onToggleCollapse?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggleCollapse]);

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
        aria-label="Admin Navigation"
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out",
          "bg-[#0B0E14] border-[#1C2436] text-[#F8FAFC]",
          isCollapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Floating Edge Collapse Button (Desktop Only, Never Overlaps Content) */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand sidebar navigation (⌘B)" : "Collapse sidebar navigation (⌘B)"}
            title={isCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
            className={cn(
              "hidden lg:flex items-center justify-center absolute -right-3 top-5 z-50",
              "w-6 h-6 rounded-full bg-[#111622] border border-[#1C2436] text-[#94A3B8]",
              "hover:text-white hover:border-[#6366F1] hover:bg-[#182030] shadow-md transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {/* Brand Header */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-[#1C2436] px-4",
            isCollapsed ? "justify-center px-0" : "justify-between"
          )}
        >
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded-xl p-1",
              isCollapsed && "justify-center"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white font-black text-xs shadow-md shadow-purple-500/20">
              VI
            </div>
            {!isCollapsed && (
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-sm tracking-tight text-white truncate">
                  GTA 6 Atlas
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1C2336] text-[#818CF8] border border-[#2B3652] shrink-0">
                  Admin
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav
          aria-label="Main Navigation Menu"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-[#1C2436]"
        >
          {ADMIN_NAV_SECTIONS.map((section, sectionIdx) => {
            const headingId = `nav-heading-${id}-${sectionIdx}`;

            return (
              <div
                key={section.title}
                role="group"
                aria-labelledby={!isCollapsed ? headingId : undefined}
                className="space-y-1"
              >
                {!isCollapsed && (
                  <p
                    id={headingId}
                    className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B] select-none"
                  >
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

                    const navLink = (
                      <Link
                        href={item.href}
                        onClick={() => onCloseMobile?.()}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]",
                          isActive
                            ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 font-bold shadow-sm"
                            : "text-[#94A3B8] hover:text-white hover:bg-[#141B2A]",
                          isCollapsed && "justify-center px-0 w-10 h-10 mx-auto"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110",
                            isActive
                              ? "text-[#818CF8]"
                              : "text-[#64748B] group-hover:text-[#94A3B8]"
                          )}
                        />
                        {!isCollapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                        {!isCollapsed && item.badge && (
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-colors",
                              isActive
                                ? "bg-[#4F46E5] text-white"
                                : item.badgeVariant === "warning"
                                ? "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                                : "bg-[#1C2436] text-[#94A3B8]"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );

                    if (isCollapsed) {
                      return (
                        <Tooltip key={item.href} content={item.label} position="right">
                          {navLink}
                        </Tooltip>
                      );
                    }

                    return <React.Fragment key={item.href}>{navLink}</React.Fragment>;
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#1C2436] space-y-2 bg-[#0B0E14]">
          {isCollapsed ? (
            <Tooltip content="View Public Site" position="right">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#141B2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
                aria-label="View Public Site (opens in new tab)"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
              </Link>
            </Tooltip>
          ) : (
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#141B2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span className="truncate">Public Portal</span>
            </Link>
          )}

          {isCollapsed ? (
            <Tooltip content="Jason Vance (Administrator)" position="right">
              <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner cursor-pointer">
                AD
              </div>
            </Tooltip>
          ) : (
            <div className="p-2.5 rounded-xl bg-[#111622] border border-[#1C2436] flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  AD
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#111622]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">Administrator</p>
                <p className="text-[10px] text-[#64748B] truncate">admin@atlas-gta6.com</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
