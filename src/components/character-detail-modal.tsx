"use client";

import { useEffect } from "react";
import Image from "next/image";
import { 
  X, 
  Shield, 
  Zap, 
  Car, 
  Crosshair, 
  MapPin, 
  Radio, 
  Sparkles, 
  Quote, 
  Check, 
  Share2 
} from "lucide-react";
import { Character, roleColor } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CharacterDetailModalProps {
  character: Character | null;
  onClose: () => void;
}

export function CharacterDetailModal({ character, onClose }: CharacterDetailModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (character) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [character, onClose]);

  if (!character) return null;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-character-name"
    >
      <div 
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#0B1020] text-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.85)] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-gradient-to-r from-pink-500/25 via-purple-500/20 to-cyan-500/20 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 hover:border-pink-500/50 transition-all backdrop-blur-md"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-12 gap-0">
          {/* Left Column: Perfectly Framed Character Portrait */}
          <div className="relative md:col-span-5 bg-gradient-to-b from-black/80 to-[#141C2E] min-h-[380px] md:min-h-[540px] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative w-full h-full min-h-[380px] md:min-h-[540px]">
              <Image
                src={character.img}
                alt={character.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
              />
              {/* Subtle Atmospheric Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0B1020]/90 pointer-events-none" />
              
              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/40 bg-pink-950/60 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-pink-400 backdrop-blur-md shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  {character.role}
                </span>

                {character.status && (
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm",
                    character.status === "Active" 
                      ? "border-emerald-500/40 bg-emerald-950/60 text-emerald-400"
                      : "border-amber-500/40 bg-amber-950/60 text-amber-400"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      character.status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    )} />
                    {character.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Full Profile Dossier */}
          <div className="p-6 sm:p-8 md:col-span-7 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-5">
              
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-black uppercase tracking-[0.25em] text-pink-400">
                    OFFICIAL CHARACTER DOSSIER
                  </span>
                  {character.alias && (
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg">
                      {character.alias}
                    </span>
                  )}
                </div>

                <h2 id="modal-character-name" className="mt-1 font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                  {character.name}
                </h2>

                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {character.desc}
                </p>
              </div>

              {/* Quote Block */}
              {character.quote && (
                <blockquote className="flex items-start gap-3 rounded-2xl border border-pink-500/25 bg-pink-950/15 p-4 text-xs sm:text-sm italic text-pink-200/90 shadow-sm">
                  <Quote className="h-5 w-5 shrink-0 text-pink-400 mt-0.5" />
                  <span>&ldquo;{character.quote}&rdquo;</span>
                </blockquote>
              )}

              {/* Biography Section */}
              {character.bio && character.bio.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-400">
                    Background & Narrative Role
                  </h3>
                  {character.bio.map((paragraph, idx) => (
                    <p key={idx} className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Technical Dossier Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {character.origin && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Territory / Origin</span>
                      <strong className="text-xs font-semibold text-white">{character.origin}</strong>
                    </div>
                  </div>
                )}

                {character.vehicle && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-start gap-2.5">
                    <Car className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Signature Ride</span>
                      <strong className="text-xs font-semibold text-white">{character.vehicle}</strong>
                    </div>
                  </div>
                )}

                {character.perk && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Special Perk / Ability</span>
                      <strong className="text-xs font-semibold text-white">{character.perk}</strong>
                    </div>
                  </div>
                )}

                {character.specialty && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Specialty</span>
                      <strong className="text-xs font-semibold text-white">{character.specialty}</strong>
                    </div>
                  </div>
                )}

                {character.affiliation && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-start gap-2.5 sm:col-span-2">
                    <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Known Affiliation</span>
                      <strong className="text-xs font-semibold text-white">{character.affiliation}</strong>
                    </div>
                  </div>
                )}

                {character.weapons && character.weapons.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:col-span-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-[10px] font-mono uppercase text-slate-400">Weapon Loadout</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {character.weapons.map((w) => (
                        <span key={w} className="px-2 py-0.5 rounded-md bg-black/50 border border-white/15 text-[11px] font-mono text-slate-200">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {character.tags && character.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {character.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Voice Actor: <strong className="text-white">{character.voiceActor || "Rockstar Games Cast"}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-pink-400" />
                      <span>Share Profile</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white transition-all shadow-md shadow-pink-500/20"
                >
                  Close Dossier
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
