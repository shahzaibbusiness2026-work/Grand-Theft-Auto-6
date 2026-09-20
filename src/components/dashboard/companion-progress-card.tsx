"use client";

import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";

interface CompanionProgressCardProps {
  overallPercent?: number;
}

const CATEGORIES = [
  { name: "Missions", percent: 80, color: "bg-amber-500" },
  { name: "Collectibles", percent: 65, color: "bg-purple-500" },
  { name: "Vehicles", percent: 40, color: "bg-[#00F0FF]" },
  { name: "Weapons", percent: 35, color: "bg-orange-500" },
  { name: "Properties", percent: 20, color: "bg-emerald-500" },
  { name: "Achievements", percent: 30, color: "bg-yellow-500" },
];

export function CompanionProgressCard({
  overallPercent = 72,
}: CompanionProgressCardProps) {
  // Donut SVG circumference calculation
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercent / 100) * circumference;

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-4 sm:p-5 shadow-xl backdrop-blur-xl">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
          <BarChart3 className="h-4 w-4 text-amber-400" />
          <span>YOUR PROGRESS</span>
        </div>
        <Link
          href="/tracker"
          className="text-slate-400 transition-colors hover:text-[#00F0FF]"
          aria-label="View Full Progress"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main Body: Donut on left, categories list on right */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4 min-w-0">
        {/* Donut Chart */}
        <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 shrink-0 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 128 128">
            {/* Background Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="11"
              fill="transparent"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="60%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#00F0FF" />
              </linearGradient>
            </defs>
            {/* Progress Stroke */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="url(#progress-gradient)"
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-display text-2xl sm:text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              {overallPercent}%
            </span>
            <span className="text-[9px] font-semibold text-slate-400 leading-tight">
              Overall<br />Completion
            </span>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between text-[11px] font-semibold min-w-0"
            >
              <div className="flex items-center gap-1.5 min-w-0 truncate pr-1">
                <span className={`h-2 w-2 shrink-0 rounded-full ${cat.color}`} />
                <span className="text-slate-300 truncate">{cat.name}</span>
              </div>
              <span className="font-mono text-slate-400 shrink-0">{cat.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <Link
        href="/tracker"
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] py-2 text-xs font-bold text-slate-200 shadow-sm transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
      >
        <span>View Full Progress</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
