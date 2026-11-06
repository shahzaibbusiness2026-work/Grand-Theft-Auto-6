"use client";

import { useState } from "react";
import {
  Bike,
  Car,
  ChevronDown,
  CircleHelp,
  Gamepad2,
  Crosshair,
  Footprints,
  LayoutGrid,
  Plane,
  Settings,
  Smartphone,
  Swords,
  Target,
  Umbrella,
  Waves,
  type LucideIcon,
} from "lucide-react";

type ControlRow = { action: string; note?: string; ps5: string; xbox: string };
type Section = {
  id: string;
  group: string;
  title: string;
  icon: LucideIcon;
  iconClass?: string;
  rows: ControlRow[];
  footnote?: string;
};

/**
 * Button values are the compact pill labels. Face buttons use the
 * PlayStation glyphs (△ ○ □ ✕) the way the design shows them;
 * Xbox keeps its A / B / X / Y letters. Longer detail lives in `note`.
 */
const SECTIONS: Section[] = [
  {
    id: "general",
    group: "general",
    title: "General & Menus",
    icon: Settings,
    iconClass: "text-violet-500 dark:text-[#FF2E9A]",
    rows: [
      { action: "Pause menu", ps5: "Options", xbox: "Menu" },
      { action: "Change camera", note: "cycles to first-person in GTA V", ps5: "Touchpad (press)", xbox: "View (press)" },
      { action: "Interaction menu (GTA Online)", ps5: "Touchpad (hold)", xbox: "View (hold)" },
      { action: "Open map", ps5: "Options → Map", xbox: "Menu → Map" },
    ],
  },
  {
    id: "on-foot",
    group: "on-foot",
    title: "On Foot",
    icon: Footprints,
    rows: [
      { action: "Move", ps5: "L Stick", xbox: "L Stick" },
      { action: "Look / camera", ps5: "R Stick", xbox: "R Stick" },
      { action: "Sprint", note: "tap repeatedly, or hold — depends on Sprint Mode", ps5: "✕", xbox: "A" },
      { action: "Jump / Climb", ps5: "□", xbox: "X" },
      { action: "Stealth mode", ps5: "L3", xbox: "L Stick" },
      { action: "Look behind", ps5: "R3", xbox: "R Stick" },
      { action: "Enter / exit vehicle", ps5: "△", xbox: "Y" },
      { action: "Take cover", ps5: "R1", xbox: "RB" },
      { action: "Contextual interaction", note: "talk, pick up, open doors", ps5: "D-Pad Right", xbox: "D-Pad Right" },
    ],
  },
  {
    id: "combat",
    group: "combat",
    title: "Combat",
    icon: Swords,
    rows: [
      { action: "Aim weapon", ps5: "L2", xbox: "LT" },
      { action: "Fire weapon", ps5: "R2", xbox: "RT" },
      { action: "Reload", ps5: "○", xbox: "B" },
      { action: "Melee attack", note: "close to a target", ps5: "○", xbox: "B" },
      { action: "Dodge / combat roll", note: "while aiming", ps5: "□", xbox: "X" },
      { action: "Weapon wheel", ps5: "L1 (hold)", xbox: "LB (hold)" },
      { action: "Quick weapon cycle", ps5: "L1 (tap)", xbox: "LB (tap)" },
      { action: "Switch weapon within a category", note: "while wheel open", ps5: "D-Pad L / R", xbox: "D-Pad L / R" },
      { action: "Throw equipped explosive", note: "with a throwable equipped", ps5: "R2", xbox: "RT" },
      { action: "Throw explosive while aiming a gun", ps5: "D-Pad Left", xbox: "D-Pad Left" },
      { action: "Weapon flashlight", note: "while aiming", ps5: "D-Pad Right", xbox: "D-Pad Right" },
      { action: "Sniper scope zoom in / out", note: "while aiming", ps5: "D-Pad ↑ / ↓", xbox: "D-Pad ↑ / ↓" },
      { action: "Drop weapon / drop ammo", note: "while wheel open", ps5: "△ / □", xbox: "Y / X" },
      { action: "Special ability — GTA V protagonists only", ps5: "L3 + R3", xbox: "L + R Stick" },
    ],
    footnote: "Lucia and Jason's abilities, if any, are unconfirmed — the special-ability row is GTA V only.",
  },
  {
    id: "driving",
    group: "driving",
    title: "Driving",
    icon: Car,
    rows: [
      { action: "Steer", ps5: "L Stick", xbox: "L Stick" },
      { action: "Accelerate", ps5: "R2", xbox: "RT" },
      { action: "Brake / Reverse", ps5: "L2", xbox: "LT" },
      { action: "Handbrake", ps5: "R1", xbox: "RB" },
      { action: "Horn", ps5: "L3", xbox: "L Stick" },
      { action: "Look behind", ps5: "R3 (hold)", xbox: "R Stick (hold)" },
      { action: "Change camera", ps5: "R3 (tap)", xbox: "R Stick (tap)" },
      { action: "Duck inside vehicle", ps5: "✕", xbox: "A" },
      { action: "Headlights", ps5: "D-Pad Right", xbox: "D-Pad Right" },
      { action: "Radio — next / previous station", note: "tap to change station", ps5: "D-Pad L / R", xbox: "D-Pad L / R" },
      { action: "Radio wheel", ps5: "D-Pad L (hold)", xbox: "D-Pad L (hold)" },
      { action: "Cinematic camera", note: "while driving", ps5: "○", xbox: "B" },
      { action: "Phone", ps5: "D-Pad Up", xbox: "D-Pad Up" },
      { action: "Exit vehicle", ps5: "△", xbox: "Y" },
    ],
  },
  {
    id: "drive-by",
    group: "drive-by",
    title: "Drive-By & Vehicle Weapons",
    icon: Crosshair,
    rows: [
      { action: "Aim drive-by weapon", ps5: "L1", xbox: "LB" },
      { action: "Fire drive-by weapon", ps5: "R1", xbox: "RB" },
      { action: "Fire mounted vehicle weapon", ps5: "✕", xbox: "A" },
      { action: "Switch vehicle weapon", ps5: "□", xbox: "X" },
      { action: "Aim mounted weapon", ps5: "R Stick", xbox: "R Stick" },
      { action: "Drop mine / secondary weapon", ps5: "D-Pad Right", xbox: "D-Pad Right" },
      { action: "Vehicle boost", note: "where equipped", ps5: "L3", xbox: "L Stick" },
    ],
  },
  {
    id: "motorcycles",
    group: "motorcycles",
    title: "Motorcycles & Bicycles",
    icon: Bike,
    rows: [
      { action: "Lean forward / back (wheelie)", ps5: "L Stick ↑ / ↓", xbox: "L Stick ↑ / ↓" },
      { action: "Bicycle sprint", note: "tap repeatedly", ps5: "✕", xbox: "A" },
      { action: "Bicycle jump", ps5: "R1", xbox: "RB" },
    ],
    footnote: "All other motorcycle inputs match the driving table.",
  },
  {
    id: "planes",
    group: "flying",
    title: "Flying — Planes",
    icon: Plane,
    rows: [
      { action: "Throttle up / down", ps5: "R2 / L2", xbox: "RT / LT" },
      { action: "Pitch & roll", ps5: "L Stick", xbox: "L Stick" },
      { action: "Yaw left / right", ps5: "L1 / R1", xbox: "LB / RB" },
      { action: "Landing gear", ps5: "D-Pad Right", xbox: "D-Pad Right" },
      { action: "Fire aircraft weapon", ps5: "✕", xbox: "A" },
      { action: "Next aircraft weapon", ps5: "□", xbox: "X" },
      { action: "Change camera / look behind", ps5: "R3", xbox: "R Stick" },
      { action: "Exit aircraft", ps5: "△", xbox: "Y" },
    ],
  },
  {
    id: "helicopters",
    group: "flying",
    title: "Flying — Helicopters",
    icon: Plane,
    rows: [
      { action: "Ascend / descend", ps5: "R2 / L2", xbox: "RT / LT" },
      { action: "Pitch & roll", ps5: "L Stick", xbox: "L Stick" },
      { action: "Yaw left / right", ps5: "L1 / R1", xbox: "LB / RB" },
      { action: "Fire weapon", ps5: "✕", xbox: "A" },
      { action: "Switch weapon", ps5: "□", xbox: "X" },
      { action: "Exit helicopter", ps5: "△", xbox: "Y" },
    ],
  },
  {
    id: "swimming",
    group: "swimming",
    title: "Swimming & Diving",
    icon: Waves,
    iconClass: "text-violet-500 dark:text-[#FF2E9A]",
    rows: [
      { action: "Swim (direction)", ps5: "L Stick", xbox: "L Stick" },
      { action: "Swim faster", note: "tap repeatedly", ps5: "✕", xbox: "A" },
      { action: "Ascend / surface", ps5: "L Stick Up / ✕", xbox: "L Stick Up / A" },
      { action: "Descend / dive", ps5: "L Stick Down", xbox: "L Stick Down" },
    ],
  },
  {
    id: "parachute",
    group: "parachute",
    title: "Parachute",
    icon: Umbrella,
    rows: [
      { action: "Deploy parachute", ps5: "✕", xbox: "A" },
      { action: "Steer", ps5: "L Stick", xbox: "L Stick" },
      { action: "Sharp turn left / right", ps5: "L1 / R1", xbox: "LB / RB" },
      { action: "Precision landing brake", ps5: "L1 + R1", xbox: "LB + RB" },
      { action: "Detach parachute", ps5: "△", xbox: "Y" },
      { action: "Smoke trail", ps5: "✕", xbox: "A" },
    ],
  },
  {
    id: "phone",
    group: "phone",
    title: "Phone",
    icon: Smartphone,
    rows: [
      { action: "Open phone", ps5: "D-Pad Up", xbox: "D-Pad Up" },
      { action: "Navigate phone", ps5: "D-Pad", xbox: "D-Pad" },
      { action: "Select", ps5: "✕", xbox: "A" },
      { action: "Back / hang up", ps5: "○", xbox: "B" },
      { action: "Answer call", ps5: "✕", xbox: "A" },
      { action: "Decline call", ps5: "○", xbox: "B" },
    ],
  },
];

const FILTERS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All Sections", icon: LayoutGrid },
  { id: "general", label: "General & Menus", icon: Settings },
  { id: "on-foot", label: "On Foot", icon: Footprints },
  { id: "combat", label: "Combat", icon: Swords },
  { id: "driving", label: "Driving", icon: Car },
  { id: "drive-by", label: "Drive-By", icon: Target },
  { id: "motorcycles", label: "Motorcycles", icon: Bike },
  { id: "flying", label: "Flying", icon: Plane },
  { id: "swimming", label: "Swimming", icon: Waves },
  { id: "parachute", label: "Parachute", icon: Umbrella },
  { id: "phone", label: "Phone", icon: Smartphone },
];

const FAQS = [
  {
    q: "Is this the official GTA 6 control layout?",
    a: "No. Rockstar has not published one. This is GTA 5's default layout, which Rockstar has kept consistent for a decade. It will be corrected against the real in-game layout from PS5 play at launch on 19 November 2026.",
  },
  {
    q: "How do you switch between Lucia and Jason?",
    a: "Switching is shown in Trailer 2, mid-mission — but the button is not confirmed. The GTA V method, holding Down on the D-Pad and picking with the right stick, is the provisional guess.",
  },
  {
    q: "Does GTA 6 have first-person mode?",
    a: "Not confirmed. GTA 5 added first-person on PS4, Xbox One and PC; Rockstar has said nothing about it for GTA VI.",
  },
  {
    q: "Can I remap controls on PS5 or Xbox?",
    a: "Only through presets and settings (targeting mode, sprint mode, sensitivity, adaptive triggers). Full button-by-button remapping needs the console's accessibility controller settings.",
  },
  {
    q: "Will this page change at launch?",
    a: "Yes. Every mapping will be checked against the real game on PS5 from 19 November and corrected where Rockstar changed it.",
  },
];

function ButtonPill({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-7 items-center justify-center px-1 py-1 font-mono text-xs font-semibold leading-tight text-slate-800 dark:rounded-full dark:border dark:border-white/10 dark:bg-white/5 dark:px-2.5 dark:text-[11px] dark:font-normal dark:text-slate-200">
      {label}
    </span>
  );
}

function SectionCard({ section }: { section: Section }) {
  const Icon = section.icon;
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#10102a]/90 dark:shadow-none">
      <span aria-hidden className="absolute inset-y-0 left-0 hidden w-1 bg-gradient-to-b from-[#FF2E9A] to-violet-500 dark:block" />
      <div className="p-5 pl-6">
        <div className="grid grid-cols-[minmax(0,1fr)_112px_112px] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_128px_128px]">
          <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
            <Icon className={`h-5 w-5 shrink-0 ${section.iconClass ?? "text-[#FF2E9A]"}`} aria-hidden />
            <span className="truncate">{section.title}</span>
          </h2>
          <span className="text-center text-[11px] font-bold tracking-wide text-slate-500 dark:text-slate-400">PS5</span>
          <span className="text-center text-[11px] font-bold tracking-wide text-slate-500 dark:text-slate-400">Xbox</span>
        </div>
        <div className="mt-3">
          {section.rows.map((r) => (
            <div
              key={r.action}
              className="grid grid-cols-[minmax(0,1fr)_112px_112px] items-center gap-2 border-b border-slate-100 py-2.5 last:border-b-0 dark:border-white/5 sm:grid-cols-[minmax(0,1fr)_128px_128px]"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.action}</p>
                {r.note ? <p className="text-xs text-slate-500">{r.note}</p> : null}
              </div>
              <div className="flex justify-center">
                <ButtonPill label={r.ps5} />
              </div>
              <div className="flex justify-center">
                <ButtonPill label={r.xbox} />
              </div>
            </div>
          ))}
        </div>
        {section.footnote ? (
          <p className="mt-3 text-xs text-slate-500">{section.footnote}</p>
        ) : null}
      </div>
    </section>
  );
}

export function ControlsClient() {
  const [filter, setFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const visible =
    filter === "all" ? SECTIONS : SECTIONS.filter((s) => s.group === filter);

  return (
    <>
      <div className="mt-10">
        <h2 className="flex items-center gap-2 font-bold text-2xl text-slate-900 dark:text-slate-100">
          <Gamepad2 className="h-6 w-6 text-[#FF2E9A]" aria-hidden />
          Controls Breakdown
        </h2>
        <div className="mt-2 h-[3px] w-10 rounded-full bg-gradient-to-r from-[#FF2E9A] to-violet-500" aria-hidden />
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Here&apos;s a complete breakdown of the controls, based on GTA 5&apos;s layout and current information.
        </p>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={
                active
                  ? "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF2E9A] to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-pink-500/25"
                  : "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none dark:hover:border-white/25 dark:hover:text-white"
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {visible.map((s) => (
          <SectionCard key={s.id} section={s} />
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-violet-100 bg-violet-50/70 p-5 shadow-sm dark:border-white/10 dark:bg-[#10102a]/90 dark:shadow-none sm:p-6">
        <h2 className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-slate-100">
          <CircleHelp className="h-6 w-6 text-[#FF2E9A]" aria-hidden />
          FAQs
        </h2>
        <div className="mt-2">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className="border-b border-slate-100 last:border-b-0 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {open ? (
                  <p className="pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
