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
  MapPin,
  Building2,
  Users,
  Newspaper,
  BookOpen,
  Wrench,
  Calculator,
  TrendingUp,
  DollarSign,
  Crosshair,
  Mail,
  LogIn,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/command-palette";
import { getStoredUserState, isLoggedIn, logoutUser } from "@/lib/user-store";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  /** Extra links revealed by the chevron: the label itself still navigates
   * to href. */
  menu?: { href: string; label: string }[];
};

const LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  {
    href: "/vehicles",
    label: "Vehicles",
    menu: [
      { href: "/compare/vehicles", label: "Compare Vehicles" },
      { href: "/rankings/fastest-vehicles", label: "Fastest Vehicles" },
      { href: "/rankings/best-vehicles-overall", label: "Best Vehicles Overall" },
      { href: "/rankings", label: "All Vehicle Rankings" },
    ],
  },
  {
    href: "/weapons",
    label: "Weapons",
    menu: [
      { href: "/compare/weapons", label: "Compare Weapons" },
      { href: "/rankings/highest-dps", label: "Highest DPS Weapons" },
      { href: "/rankings/best-weapons-overall", label: "Best Weapons Overall" },
      { href: "/rankings", label: "All Weapon Rankings" },
    ],
  },
  { href: "/missions", label: "Missions", menu: [{ href: "/tracker", label: "100% Tracker" }] },
  { href: "/rankings", label: "Rankings" },
  { href: "/map", label: "Map" },
];

type MoreLink = { href: string; label: string; icon: LucideIcon };
type MoreSection = { title: string; links: MoreLink[] };

const MORE_SECTIONS: MoreSection[] = [
  {
    title: "Discover",
    links: [
      { href: "/locations", label: "Locations & POIs", icon: MapPin },
      { href: "/properties", label: "Properties & Real Estate", icon: Building2 },
      { href: "/characters", label: "Characters", icon: Users },
      { href: "/news", label: "News", icon: Newspaper },
      { href: "/guides", label: "Guides", icon: BookOpen },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/tools", label: "All 15 Tools", icon: Wrench },
      { href: "/tools/money-calculator", label: "Money Calculator", icon: Calculator },
      { href: "/tools/business-profit-calculator", label: "Business Profit Calculator", icon: TrendingUp },
      { href: "/tools/money-maker", label: "Money-Making Method Finder", icon: DollarSign },
      { href: "/tools/loadout-builder", label: "Tactical Loadout Builder", icon: Crosshair },
    ],
  },
  {
    title: "More",
    links: [
      { href: "/ai", label: "Ask GTA 6 AI", icon: Bot },
      { href: "/pricing", label: "Vice City Pro", icon: Crown },
      { href: "/contact", label: "Contact", icon: Mail },
    ],
  },
];

/** Flat list of all More-menu hrefs, for active-state highlighting. */
const MORE_HREFS = MORE_SECTIONS.flatMap((s) => s.links.map((l) => l.href));

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

/**
 * Desktop nav item with an attached dropdown (Compare Vehicles/Weapons,
 * 100% Tracker under Missions): the label is a normal link to the listing
 * page, the chevron toggles a small menu of extra links. The container
 * carries the active/hover styling so the two halves read as one control.
 */
function SplitNavDropdown({
  href,
  label,
  menu,
  pathname,
}: {
  href: string;
  label: string;
  menu: { href: string; label: string }[];
  pathname: string;
}) {
  const { open, setOpen, ref } = useDropdown();
  const active =
    pathname.startsWith(href) || menu.some((m) => pathname === m.href);
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center rounded-lg transition-all duration-200",
        active
          ? "border border-gold/40 bg-gold/10 text-gold-dark dark:text-gold-light font-bold shadow-[0_0_12px_rgba(201,168,106,0.15)]"
          : "border border-transparent text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      )}
    >
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="rounded-lg py-1.5 pl-2.5 pr-px text-xs font-semibold tracking-wide lg:text-[13px]"
      >
        {label}
      </Link>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Show ${label} menu`}
        className="flex items-center rounded-lg py-1.5 pr-1.5"
      >
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200 opacity-70",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 mt-2.5 w-56 -translate-x-1/2 rounded-xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-2xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
        >
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-xs font-medium tracking-wide transition-colors",
                pathname === m.href
                  ? "bg-gold/15 text-gold-dark dark:text-gold-light font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {m.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const more = useDropdown();

  useEffect(() => {
    setMounted(true);
    setIsPro(getStoredUserState().isPro);
    setLoggedIn(isLoggedIn());

    const handleSync = () => {
      setIsPro(getStoredUserState().isPro);
      setLoggedIn(isLoggedIn());
    };
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
    return pathname.startsWith(href);
  };

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
              className="hidden lg:inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/15 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-gold-light"
              title="Vice City Pro Active"
            >
              <Crown className="h-3 w-3" /> PRO
            </Link>
          )}
        </div>

        <nav aria-label="Main navigation" className="hidden items-center gap-2 lg:gap-3 md:flex">
          {LINKS.map((l) =>
            l.menu ? (
              <SplitNavDropdown
                key={l.href}
                href={l.href}
                label={l.label}
                menu={l.menu}
                pathname={pathname}
              />
            ) : (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 lg:text-[13px]",
                  isActive(l.href)
                    ? "border border-gold/40 bg-gold/10 text-gold-dark dark:text-gold-light font-bold shadow-[0_0_12px_rgba(201,168,106,0.15)]"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            )
          )}

          {/* More dropdown */}
          <div className="relative" ref={more.ref}>
            <button
              type="button"
              onClick={() => more.setOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={more.open}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 lg:text-[13px]",
                MORE_HREFS.some((href) => isActive(href))
                  ? "border border-gold/40 bg-gold/10 text-gold-dark dark:text-gold-light font-bold shadow-[0_0_12px_rgba(201,168,106,0.15)]"
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
                className="absolute right-0 top-full z-50 mt-2.5 w-[38rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-2xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="grid grid-cols-3 gap-4">
                  {MORE_SECTIONS.map((section) => (
                    <div key={section.title}>
                      <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
                        {section.title}
                      </p>
                      <div className="space-y-0.5">
                        {section.links.map((l) => {
                          const Icon = l.icon;
                          const active = isActive(l.href);
                          return (
                            <Link
                              key={l.href}
                              href={l.href}
                              role="menuitem"
                              onClick={() => more.setOpen(false)}
                              className={cn(
                                "flex items-center gap-2.5 rounded-xl px-2 py-2 text-[13px] font-medium tracking-wide transition-colors",
                                active
                                  ? "bg-gold/15 text-gold-dark dark:text-gold-light font-bold"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
                                  active
                                    ? "border-gold/40 bg-gold/15 text-gold-dark dark:text-gold-light"
                                    : "border-border/70 bg-muted/60 text-muted-foreground"
                                )}
                                aria-hidden="true"
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              {l.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Ask AI Quick Button */}
          <Link
            href="/ai"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-gold/40 bg-gold/10 px-2.5 py-1.5 text-xs font-bold text-gold-dark dark:text-gold-light hover:bg-gold hover:text-slate-950 transition-all shadow-sm"
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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-all duration-200 hover:border-gold/50 hover:bg-gold/10 hover:text-gold dark:hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
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
              <Sun className="h-4 w-4 text-gold" />
            ) : (
              <Moon className="h-4 w-4 text-cyan-400" />
            )}
          </button>

          {/* Auth: Login/Signup when logged out, Dashboard when logged in */}
          {mounted && loggedIn ? (
            <Link
              href="/dashboard"
              prefetch={true}
              className="hidden h-9 items-center gap-1.5 rounded-lg bg-gold px-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_2px_12px_rgba(201,168,106,0.25)] transition-all duration-200 hover:brightness-105 active:scale-95 sm:inline-flex"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
          ) : (
            mounted && (
              <Link
                href="/login"
                prefetch={true}
                className="hidden h-9 items-center gap-1.5 rounded-lg bg-gold px-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_2px_12px_rgba(201,168,106,0.25)] transition-all duration-200 hover:brightness-105 active:scale-95 sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login / Sign Up</span>
              </Link>
            )
          )}

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
              className="mb-2 flex w-full items-center gap-2.5 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-dark dark:text-gold-light transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Search All 15 Tools, Rides, Guns...</span>
            </button>
            {LINKS.flatMap((l) => [{ href: l.href, label: l.label }, ...(l.menu || [])])
              .concat(MORE_SECTIONS.flatMap((s) => s.links.map((l) => ({ href: l.href, label: l.label }))))
              .map((l) => {
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
                      ? "bg-gold/15 text-gold-dark dark:text-gold-light font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            {/* Mobile auth */}
            <div className="mt-3 border-t border-border/60 pt-3">
              {mounted && loggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-black uppercase tracking-wider text-slate-950"
                  >
                    <LayoutGrid className="h-4 w-4" /> Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logoutUser();
                      setMobileOpen(false);
                    }}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                mounted && (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-black uppercase tracking-wider text-slate-950"
                  >
                    <LogIn className="h-4 w-4" /> Login / Sign Up
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Command Palette Modal */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
