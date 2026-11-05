"use client";

import React, { useId, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { ADMIN_NAV_SECTIONS } from "@/lib/admin-navigation";
import { cn } from "@/lib/utils";
import { Tooltip } from "./ui/tooltip";
import type { AdminIdentity } from "./admin-layout";

interface AdminSidebarProps {
  identity?: AdminIdentity | null;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  identity,
  isCollapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const id = useId();
  const profileName = identity?.name || "Loading profile…";
  const profileInitials = profileName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";

  const collapsed = isCollapsed && !mobileOpen;
  const drawer = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    const prior = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLButtonElement>("[data-close-admin-menu]")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onCloseMobile?.(); }
      if (event.key !== "Tab") return;
      const items = [...(drawer.current?.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input,select,textarea") || [])].filter(item => item.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (first && event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (last && !event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; prior?.focus(); };
  }, [mobileOpen, onCloseMobile]);

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
        ref={drawer}
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen ? true : undefined}
        aria-label="Admin Navigation"
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out",
          "bg-[#0B0E14] border-[#1C2436] text-[#F8FAFC]",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "visible translate-x-0" : "invisible -translate-x-full lg:visible lg:translate-x-0"
        )}
      >
        {/* Floating Edge Collapse Button (Desktop Only, Never Overlaps Content) */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar navigation (⌘B)" : "Collapse sidebar navigation (⌘B)"}
            title={collapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
            className={cn(
              "hidden lg:flex items-center justify-center absolute -right-3 top-5 z-50",
              "w-6 h-6 rounded-full bg-[#111622] border border-[#1C2436] text-[#94A3B8]",
              "hover:text-white hover:border-[#6366F1] hover:bg-[#182030] shadow-md transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            )}
          >
            {collapsed ? (
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
            collapsed ? "justify-center px-0" : "justify-between"
          )}
        >
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded-xl p-1",
              collapsed && "justify-center"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white font-black text-xs shadow-md shadow-purple-500/20">
              VI
            </div>
            {!collapsed && (
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-sm tracking-tight text-white truncate">
                  Taish Gaming
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#1C2336] text-[#818CF8] border border-[#2B3652] shrink-0">
                  Admin
                </span>
              </div>
            )}
          </Link>
          <button type="button" data-close-admin-menu onClick={onCloseMobile} aria-label="Close admin navigation" className="rounded-lg p-2 text-white focus-visible:ring-2 focus-visible:ring-pink-500 lg:hidden">
            <X className="h-5 w-5" />
          </button>
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
                aria-labelledby={!collapsed ? headingId : undefined}
                className="space-y-1"
              >
                {!collapsed && (
                  <p
                    id={headingId}
                    className="px-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 select-none"
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
                        : (pathname === item.href || pathname.startsWith(`${item.href}/`));

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
                          collapsed && "justify-center px-0 w-10 h-10 mx-auto"
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
                        {!collapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                        {!collapsed && item.badge && (
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded-full text-xs font-bold shrink-0 transition-colors",
                              isActive
                                ? "bg-[#4F46E5] text-white"
                                : item.badgeVariant === "warning"
                                ? "bg-amber-950/60 text-gold-light border border-gold/30"
                                : "bg-[#1C2436] text-[#94A3B8]"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );

                    if (collapsed) {
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
          {collapsed ? (
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

          {collapsed ? (
            <Tooltip content={identity ? `${profileName} (${identity.role})` : "Loading admin profile"} position="right">
              <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner cursor-pointer">
                {profileInitials}
              </div>
            </Tooltip>
          ) : (
            <div className="p-2.5 rounded-xl bg-[#111622] border border-[#1C2436] flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {profileInitials}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#111622]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{identity?.name || "Loading profile…"}</p>
                <p className="text-xs text-[#64748B] truncate">{identity?.email || ""}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
