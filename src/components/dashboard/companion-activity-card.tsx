"use client";

import Link from "next/link";
import { Clock, Car, Package, Flag, FileText, CheckCircle2, ArrowRight } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  icon: typeof Car;
  iconBg: string;
  iconColor: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    title: "Unlocked: Bravado Banshee",
    time: "2 hours ago",
    icon: Car,
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    iconColor: "text-[#00F0FF]",
  },
  {
    id: "act-2",
    title: "Found: Hidden Stash",
    time: "5 hours ago",
    icon: Package,
    iconBg: "bg-amber-500/15 border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    id: "act-3",
    title: "Completed: The Maze (Side Mission)",
    time: "1 day ago",
    icon: Flag,
    iconBg: "bg-amber-500/15 border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    id: "act-4",
    title: "Added Note: Ocean Drive",
    time: "1 day ago",
    icon: FileText,
    iconBg: "bg-sky-500/15 border-sky-500/30",
    iconColor: "text-sky-400",
  },
  {
    id: "act-5",
    title: "Marked Collectible Complete",
    time: "2 days ago",
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
];

export function CompanionActivityCard() {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
          <Clock className="h-4 w-4 text-[#00F0FF]" />
          <span>RECENT ACTIVITY</span>
        </div>
        <Link
          href="/tracker"
          className="flex items-center gap-1 text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Activities list */}
      <div className="my-3 space-y-3">
        {ACTIVITIES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.03] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-3 truncate">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${item.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {item.title}
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 shrink-0">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
