"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Zap, Car, MapPin, Sparkles, ArrowRight, Quote } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROTAGONISTS = [
  {
    id: "lucia",
    name: "Lucia Caminos",
    role: "Lead Protagonist",
    alias: "The Mastermind",
    quote: "The only way we're gonna get through this is by sticking together, being a team.",
    voiceActor: "Manni L. Perez (Confirmed Leak / Casting)",
    origin: "Vice City Metro / Leonida Penitentiary",
    specialty: "High-stakes Armed Robberies & Lockpicking",
    perk: "Tactical Reflexes (Bullet Time) & Infiltration",
    vehicle: "Bravado Banshee (Modified)",
    img: "/img/char-lucia.jpg",
    accentColor: "from-rose-600 via-amber-500 to-orange-500",
    borderGlow: "border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    tagColor: "bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30",
  },
  {
    id: "jason",
    name: "Jason Duval",
    role: "Co-Protagonist",
    alias: "The Enforcer",
    quote: "Trust. That's what it comes down to. You and me against the whole damn state.",
    voiceActor: "Gregory Connors (Confirmed / Speculated)",
    origin: "Port Gellhorn & Keys Smuggling Routes",
    specialty: "Off-Road Getaway & Heavy Weapons Logistics",
    perk: "Smuggler Eagle Eye (POI & Cache Detection)",
    vehicle: "Declasse Tulip 1972 Muscle Car",
    img: "/img/char-jason.jpg",
    accentColor: "from-[#00F0FF] to-[#0284c7]",
    borderGlow: "border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.25)]",
    tagColor: "bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/30",
  },
];

export function ProtagonistsShowcase() {
  const [activeTab, setActiveTab] = useState<"both" | "lucia" | "jason">("both");

  return (
    <section aria-labelledby="protagonists-heading" className="container-site pt-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400">
            <Sparkles className="h-3 w-3" /> Modern Bonnie & Clyde
          </div>
          <h2
            id="protagonists-heading"
            className="mt-3 font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground"
          >
            Meet the <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent">Protagonists</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Two criminals bound by fate, trust, and ambition in the unforgiving underworld of Leonida.
          </p>
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          <button
            onClick={() => setActiveTab("both")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              activeTab === "both"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dual View
          </button>
          <button
            onClick={() => setActiveTab("lucia")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              activeTab === "lucia"
                ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Lucia
          </button>
          <button
            onClick={() => setActiveTab("jason")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              activeTab === "jason"
                ? "bg-gradient-to-r from-sky-400 to-cyan-500 text-slate-950 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Jason
          </button>
        </div>
      </div>

      {/* Showcase Cards Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {PROTAGONISTS.filter(
          (p) => activeTab === "both" || activeTab === p.id
        ).map((p) => (
          <div
            key={p.id}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-card/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1",
              p.borderGlow,
              activeTab !== "both" && "lg:col-span-2"
            )}
          >
            {/* Ambient background glow */}
            <div
              className={cn(
                "pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl bg-gradient-to-br",
                p.accentColor
              )}
            />

            <div className="grid sm:grid-cols-12 gap-0 sm:gap-6">
              {/* Character Portrait */}
              <div className="relative h-64 sm:h-auto sm:min-h-[280px] sm:col-span-5 overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-card pointer-events-none" />
                
                {/* Badge Overlay */}
                <div className="absolute top-3 left-3">
                  <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm", p.tagColor)}>
                    {p.role}
                  </span>
                </div>
              </div>

              {/* Character Dossier Content */}
              <div className="p-6 sm:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                      CONFIRMED DOSSIER
                    </span>
                    <span className="font-mono text-xs font-semibold text-accent">
                      {p.alias}
                    </span>
                  </div>

                  <h3 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase tracking-wide text-foreground">
                    {p.name}
                  </h3>

                  {/* Character Quote */}
                  <blockquote className="mt-3 flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs italic text-muted-foreground">
                    <Quote className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400 opacity-80 mt-0.5" />
                    <span>&ldquo;{p.quote}&rdquo;</span>
                  </blockquote>

                  {/* Attribute Specs */}
                  <div className="mt-5 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span className="text-muted-foreground">Special Ability:</span>
                      <strong className="text-foreground font-semibold">{p.perk}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="text-muted-foreground">Specialty:</span>
                      <strong className="text-foreground font-semibold">{p.specialty}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="text-muted-foreground">Signature Ride:</span>
                      <strong className="text-foreground font-semibold">{p.vehicle}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span className="text-muted-foreground">Territory:</span>
                      <strong className="text-foreground font-semibold">{p.origin}</strong>
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Actor: <strong className="text-foreground">{p.voiceActor}</strong>
                  </span>
                  <Link
                    href="/characters"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-amber-400 hover:text-cyan-400 transition-colors"
                  >
                    View Lore <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
