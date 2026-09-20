"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Car,
  Map,
  Settings,
  Shield,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Restore sidebar collapsed preference
  useEffect(() => {
    const stored = localStorage.getItem("atlas_admin_sidebar_collapsed");
    if (stored) {
      setIsSidebarCollapsed(stored === "true");
    }
  }, []);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("atlas_admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  const mobileNavItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Articles", href: "/admin/articles", icon: FileText },
    { label: "Vehicles", href: "/admin/vehicles", icon: Car },
    { label: "Map", href: "/admin/map", icon: Map },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] flex flex-col font-sans antialiased selection:bg-[var(--admin-primary)] selection:text-white transition-colors duration-200">
      {/* Desktop & Mobile Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Wrapper */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Sticky Header */}
        <AdminHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Image 17/21 mobile view) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--admin-surface)]/95 backdrop-blur-lg border-t border-[var(--admin-border)] px-2 py-1.5 flex items-center justify-around shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition-colors",
                isActive
                  ? "text-[var(--admin-primary)]"
                  : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "stroke-[2.5]" : "stroke-[1.8]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
