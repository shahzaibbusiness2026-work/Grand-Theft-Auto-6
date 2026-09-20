"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Menu,
  Moon,
  Search,
  Sun,
  X,
  LayoutGrid,
  Sparkles,
  Crown,
  Bot,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/command-palette";
import { getStoredUserState } from "@/lib/user-store";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/weapons", label: "Weapons" },
  { href: "/missions", label: "Missions" },
  { href: "/map", label: "Map" },
  { href: "/tracker", label: "100% Tracker" },
];

const COMPARE_LINKS = [
  { href: "/compare/vehicles", label: "Vehicle Comparison" },
  { href: "/compare/weapons", label: "Weapon Comparison" },
];

const MORE_LINKS = [
  { href: "/locations", label: "Locations & POIs" },
  { href: "/properties", label: "Properties & Real Estate" },
  { href: "/tools", label: "All 15 Tools" },
  { href: "/tools/money-calculator", label: "Money Calculator" },
  { href: "/tools/business-profit-calculator", label: "Business Profit Calculator" },
  { href: "/tools/money-maker", label: "Money-Making Method Finder" },
  { href: "/tools/loadout-builder", label: "Tactical Loadout Builder" },
  { href: "/ai", label: "Ask GTA 6 AI" },
  { href: "/pricing", label: "Vice City Pro" },
  { href: "/characters", label: "Characters" },
  { href: "/news", label: "News" },
  { href: "/guides", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return { open, setOpen, ref };
}

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const compare = useDropdown();
  const more = useDropdown();

  useEffect(() => {
    setMounted(true);
    setIsPro(getStoredUserState().isPro);

    const handleSync = () => setIsPro(getStoredUserState().isPro);
    window.addEventListener("gta6_user_state_change", handleSync);
    return () => window.removeEventListener("gta6_user_state_change", handleSync);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if ((href === "/vehicles" || href === "/weapons") && pathname.endsWith("/compare")) return false;
    return pathname.startsWith(href);
  };
  const compareActive = pathname.endsWith("/compare");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl transition-colors">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00F0FF]/25 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="mr-3 lg:mr-6 flex items-center gap-2">
          <Logo />
          {isPro && (
            <Link
              href="/pricing"
              className="hidden lg:inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-400"
              title="Vice City Pro Active"
            >
              <Crown className="h-3 w-3" /> PRO
            </Link>
          )}
        </div>

        <nav aria-label="Main navigation" className="hidden items-center gap-2 lg:gap-3 md:flex">
          {LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 lg:text-[13px]",
                  active
                    ? "border border-amber-500/40 bg-amber-500/10 text-amber-500 dark:text-amber-400 font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Compare dropdown */}
          <div className="relative" ref={compare.ref}>
            <button
              type="button"
              onClick={() => compare.setOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={compare.open}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 lg:text-[13px]",
                compareActive
                  ? "border border-amber-500/40 bg-amber-500/10 text-amber-500 dark:text-amber-400 font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <span>Compare</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200 opacity-70",
                  compare.open && "rotate-180"
                )}
              />
            </button>
            {compare.open && (
              <div
                role="menu"
                className="absolute left-1/2 top-full z-50 mt-2.5 w-56 -translate-x-1/2 rounded-xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-2xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
              >
                {COMPARE_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    role="menuitem"
                    onClick={() => compare.setOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-xs font-medium tracking-wide transition-colors",
                      pathname === l.href
                        ? "bg-amber-500/15 text-amber-500 dark:text-amber-400 font-bold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* More dropdown */}
          <div className="relative" ref={more.ref}>
            <button
              type="button"
              onClick={() => more.setOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={more.open}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 lg:text-[13px]",
                MORE_LINKS.some((l) => isActive(l.href))
                  ? "border border-amber-500/40 bg-amber-500/10 text-amber-500 dark:text-amber-400 font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <span>More</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200 opacity-70",
                  more.open && "rotate-180"
                )}
              />
            </button>
            {more.open && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2.5 w-56 rounded-xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-2xl text-card-foreground animate-in fade-in zoom-in-95 duration-150 max-h-96 overflow-y-auto"
              >
                {MORE_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    role="menuitem"
                    onClick={() => more.setOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-xs font-medium tracking-wide transition-colors",
                      isActive(l.href)
                        ? "bg-amber-500/15 text-amber-500 dark:text-amber-400 font-bold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Ask AI Quick Button */}
          <Link
            href="/ai"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-500 dark:text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all shadow-sm"
            title="Ask GTA 6 AI"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>AI</span>
          </Link>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Search the Atlas (⌘K)"
            title="Search the Atlas (⌘K)"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-all duration-200 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-500 dark:hover:text-amber-400 focus-visible:outline-none active:scale-95"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            suppressHydrationWarning
            aria-label={mounted && resolvedTheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            title={mounted && resolvedTheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-none active:scale-95"
          >
            {mounted && resolvedTheme === "light" ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-cyan-400" />
            )}
          </button>

          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            prefetch={true}
            className="hidden h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 px-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_2px_12px_rgba(245,158,11,0.25)] transition-all duration-200 hover:brightness-105 active:scale-95 sm:inline-flex"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground hover:border-border hover:text-foreground md:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-card/98 backdrop-blur-2xl text-card-foreground md:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto flex w-full max-w-[1240px] flex-col gap-1.5 px-6 py-5 max-h-[75vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setPaletteOpen(true);
              }}
              className="mb-2 flex w-full items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Search All 15 Tools, Rides, Guns...</span>
            </button>
            {[...LINKS, ...COMPARE_LINKS, ...MORE_LINKS].map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch={true}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide transition-colors",
                    active
                      ? "bg-amber-500/15 text-amber-500 dark:text-amber-400 font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Command Palette Modal */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
