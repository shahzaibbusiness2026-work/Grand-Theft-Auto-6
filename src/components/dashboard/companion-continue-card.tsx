"use client";

import Link from "next/link";
import { PlayCircle, MoreHorizontal, MapPin, Clock, ArrowRight } from "lucide-react";

interface CompanionContinueCardProps {
  missionTitle?: string;
  missionType?: string;
  completedObjectives?: number;
  totalObjectives?: number;
  location?: string;
  playTime?: string;
  protagonist?: string;
  objectivesText?: string;
}

export function CompanionContinueCard({
  missionTitle = "Welcome to Leonida",
  missionType = "Main Story",
  completedObjectives = 3,
  totalObjectives = 4,
  location = "Vice City Downtown",
  playTime = "45m",
  protagonist = "Lucia",
  objectivesText,
}: CompanionContinueCardProps) {
  const percent = Math.round((completedObjectives / totalObjectives) * 100);

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-4 sm:p-5 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
          <PlayCircle className="h-4 w-4 text-[#00F0FF]" />
          <span>CONTINUE WHERE YOU LEFT OFF</span>
        </div>
        <button
          type="button"
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="my-3 space-y-3">
        {/* Mission image preview */}
        <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-white/10">
          <img
            src="/img/char-lucia.jpg"
            alt="Mission thumbnail"
            className="h-full w-full object-cover brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent" />
          <div className="absolute top-2 left-2.5 flex items-center gap-1.5">
            <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-sm">
              {missionType}
            </span>
            <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-sm">
              {protagonist}
            </span>
          </div>
        </div>

        {/* Title & Objectives bar */}
        <div>
          <h3 className="font-display text-base font-extrabold text-white">
            {missionTitle}
          </h3>

          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Objectives</span>
              <span className="font-mono text-[#00F0FF]">
                {completedObjectives}/{totalObjectives} Objectives
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#38bdf8] transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-2 border border-white/5">
            <MapPin className="h-3.5 w-3.5 text-[#00F0FF] shrink-0" />
            <div className="truncate">
              <span className="block text-xs text-slate-400 font-medium">Last Location</span>
              <span className="block font-bold text-slate-200 truncate">{location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-2 border border-white/5">
            <Clock className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <div className="truncate">
              <span className="block text-xs text-slate-400 font-medium">Play Time</span>
              <span className="block font-bold text-slate-200 truncate">{playTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Mission Button */}
      <Link
        href="/missions"
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gold py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_16px_rgba(201,168,106,0.35)] transition-all hover:brightness-105 active:scale-95"
      >
        <span>Continue Mission</span>
        <ArrowRight className="h-3.5 w-3.5 text-slate-950" />
      </Link>
    </div>
  );
}
