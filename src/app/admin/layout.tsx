"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  FileText, 
  Database, 
  ExternalLink, 
  LayoutDashboard, 
  UserCheck,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Articles & Editorial", href: "/admin/articles", icon: FileText },
    { label: "Database Verification", href: "/admin/database", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FC] font-sans antialiased">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-[#33415C] bg-[#141C2E]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/admin" 
              className="flex items-center gap-2.5 font-display text-lg font-black tracking-wider text-white hover:opacity-90 transition-opacity"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#B8AAFF] to-[#6340CC] text-[#171127] font-black text-sm">
                VI
              </span>
              <span>ATLAS <span className="text-[#B8AAFF]">ADMIN</span></span>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1C2740] border border-[#33415C] text-[#B5C0D4]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8AAFF]" />
              Senior Editor / Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-[#94A3BD]">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Atlas Engine: <strong className="text-white">v1.4.2</strong></span>
            </div>

            <div className="h-4 w-px bg-[#33415C] hidden md:block" />

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#33415C] bg-[#1C2740] text-[#F5F7FC] hover:bg-[#253352] hover:border-[#B8AAFF]/50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#B8AAFF]" />
              <span>Public Site</span>
            </Link>

            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6340CC] to-[#B8AAFF] flex items-center justify-center text-[#171127] font-bold text-xs">
                ER
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto border-t border-[#33415C]/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap",
                  isActive
                    ? "border-[#B8AAFF] text-[#B8AAFF] bg-[#1C2740]/40"
                    : "border-transparent text-[#94A3BD] hover:text-white hover:border-[#33415C]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
