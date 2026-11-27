"use client";

import { useState } from "react";
import {
  Bike,
  Car,
  ChevronDown,
  CircleHelp,
  Gamepad2,
  Footprints,
  LayoutGrid,
  Plane,
  Settings,
  Smartphone,
  Swords,
  Umbrella,
  Waves,
  type LucideIcon,
} from "lucide-react";

type ControlRow = { action: string; ps5: string; xbox: string };
type Section = { id: string; title: string; icon: LucideIcon; rows: ControlRow[] };

// Default inputs from the published retail game control scheme screens.
const SECTIONS: Section[] = [
  {
    id: "general", title: "Menus and Map", icon: Settings,
    rows: [
      { action: "Pause", ps5: "Options", xbox: "Menu" },
      { action: "Open map", ps5: "Touchpad", xbox: "View" },
      { action: "Show objective", ps5: "D-pad Down", xbox: "D-pad Down" },
      { action: "Activate Focus", ps5: "L3 + R3", xbox: "Click both sticks" },
    ],
  },
  {
    id: "on-foot", title: "On Foot", icon: Footprints,
    rows: [
      { action: "Run on foot", ps5: "Click L3", xbox: "Click left stick" },
      { action: "Jump or climb", ps5: "✕", xbox: "A" },
      { action: "Crouch", ps5: "○", xbox: "B" },
      { action: "Interact or get in a vehicle", ps5: "△", xbox: "Y" },
      { action: "Enter or leave cover", ps5: "R1", xbox: "RB" },
      { action: "Switch character when available", ps5: "Hold D-pad Right + R1", xbox: "Hold D-pad Right + RB" },
    ],
  },
  {
    id: "combat", title: "Combat", icon: Swords,
    rows: [
      { action: "Aim", ps5: "Hold L2", xbox: "Hold LT" },
      { action: "Fire on foot", ps5: "R2", xbox: "RT" },
      { action: "Melee", ps5: "□", xbox: "X" },
      { action: "Open loadout", ps5: "Hold L1", xbox: "Hold LB" },
    ],
  },
  {
    id: "driving", title: "Driving", icon: Car,
    rows: [
      { action: "Steer", ps5: "Left stick", xbox: "Left stick" },
      { action: "Accelerate", ps5: "R2", xbox: "RT" },
      { action: "Brake or reverse", ps5: "L2", xbox: "LT" },
      { action: "Handbrake", ps5: "✕", xbox: "A" },
      { action: "Open vehicle menu", ps5: "Hold D-pad Left", xbox: "Hold D-pad Left" },
      { action: "Exit vehicle", ps5: "△", xbox: "Y" },
    ],
  },
  {
    id: "flying", title: "Aircraft", icon: Plane,
    rows: [
      { action: "Increase throttle or gain altitude", ps5: "R2", xbox: "RT" },
      { action: "Reduce throttle or descend", ps5: "L2", xbox: "LT" },
      { action: "Turn left or right", ps5: "□ / ○", xbox: "X / B" },
      { action: "Toggle plane landing gear", ps5: "Click L3", xbox: "Click left stick" },
    ],
  },
  {
    id: "bicycles", title: "Bicycles", icon: Bike,
    rows: [
      { action: "Pedal", ps5: "R2", xbox: "RT" },
      { action: "Sprint on a bicycle", ps5: "✕", xbox: "A" },
      { action: "Bunnyhop", ps5: "○", xbox: "B" },
    ],
  },
  {
    id: "swimming", title: "Swimming", icon: Waves,
    rows: [
      { action: "Swim faster", ps5: "L3", xbox: "Left stick click" },
      { action: "Dive deeper", ps5: "Hold R1", xbox: "Hold RB" },
      { action: "Surface", ps5: "✕", xbox: "A" },
    ],
  },
  {
    id: "parachute", title: "Parachuting", icon: Umbrella,
    rows: [
      { action: "Deploy parachute", ps5: "✕", xbox: "A" },
      { action: "Steer", ps5: "Left stick", xbox: "Left stick" },
      { action: "Brake left or right", ps5: "L2 / R2", xbox: "LT / RT" },
    ],
  },
  {
    id: "phone", title: "Phone", icon: Smartphone,
    rows: [
      { action: "Open phone", ps5: "D-pad Up", xbox: "D-pad Up" },
      { action: "Open the WAiNK app", ps5: "Hold D-pad Up", xbox: "Hold D-pad Up" },
    ],
  },
];

const FILTERS = [
  { id: "all", title: "All Controls", icon: LayoutGrid },
  ...SECTIONS,
];

const FAQS = [
  {
    q: "How do I run in GTA 6?",
    a: "With Default controls, click L3 on PS5 or the left stick on Xbox. Cross or A is the input for jumping on foot and sprinting on a bicycle.",
  },
  {
    q: "Where can I check my controller preset?",
    a: "Pause the game and open Settings → Control Scheme. The preview shows the bindings for the selected preset and activity.",
  },
  {
    q: "How do I switch between Jason and Lucia?",
    a: "When character switching is available, hold Right on the D-pad and press R1 on PS5 or RB on Xbox.",
  },
];

function ButtonPill({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-7 items-center justify-center px-1 py-1 font-mono text-[13px] font-bold leading-tight text-slate-800 dark:rounded-full dark:border dark:border-white/10 dark:bg-white/5 dark:px-2.5 dark:font-semibold dark:text-slate-200">
      {label}
    </span>
  );
}

function SectionCard({ section }: { section: Section }) {
  const Icon = section.icon;
  return (
    <section id={section.id} className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#10102a]/90 dark:shadow-none">
      <span aria-hidden className="absolute inset-y-0 left-0 hidden w-1 bg-gradient-to-b from-[#FF2E9A] to-violet-500 dark:block" />
      <div className="p-5 pl-6">
        <div className="grid grid-cols-[minmax(0,1fr)_120px_120px] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_140px_140px]">
          <h2 className="flex min-w-0 items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            <Icon className="h-5 w-5 shrink-0 text-[#FF2E9A]" aria-hidden />
            <span className="leading-tight">{section.title}</span>
          </h2>
          <span className="text-center text-xs font-extrabold tracking-wider text-slate-500 dark:text-slate-400">PS5</span>
          <span className="text-center text-xs font-extrabold tracking-wider text-slate-500 dark:text-slate-400">Xbox</span>
        </div>
        <div className="mt-3">
          {section.rows.map((r) => (
            <div
              key={r.action}
              className="grid grid-cols-[minmax(0,1fr)_120px_120px] items-center gap-2 border-b border-slate-100 py-3 last:border-b-0 dark:border-white/5 sm:grid-cols-[minmax(0,1fr)_140px_140px]"
            >
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                  {r.action}
                </p>
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
      </div>
    </section>
  );
}

export function ControlsClient() {
  const [filter, setFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const visible =
    filter === "all" ? SECTIONS : SECTIONS.filter((s) => s.id === filter);

  return (
    <>
      <div className="mt-10">
        <h2 className="flex items-center gap-2 font-bold text-3xl text-slate-900 dark:text-slate-100">
          <Gamepad2 className="h-7 w-7 text-[#FF2E9A]" aria-hidden />
          Controls Breakdown
        </h2>
        <div className="mt-2 h-[3px] w-10 rounded-full bg-gradient-to-r from-[#FF2E9A] to-violet-500" aria-hidden />
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
          Select the activity you’re doing. These are the Default PS5 and Xbox inputs shown in the game’s control scheme screens.
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
              {f.title}
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
        <h2 className="flex items-center gap-2 font-bold text-2xl text-slate-900 dark:text-slate-100">
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
                  <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {open ? (
                  <p className="pb-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{f.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
