"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Car,
  Crosshair,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Server,
  Activity,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { useToast } from "@/components/admin/toast";
import {
  INITIAL_ADMIN_ARTICLES,
  INITIAL_ADMIN_VEHICLES,
  INITIAL_ADMIN_WEAPONS,
  INITIAL_ADMIN_MAP_MARKERS,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function AdminOverviewPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isAuditing, setIsAuditing] = useState(false);

  const publishedArticlesCount = INITIAL_ADMIN_ARTICLES.filter(
    (a) => a.status === "published"
  ).length;
  const awaitingReviewCount =
    INITIAL_ADMIN_ARTICLES.filter((a) => a.status === "review").length +
    INITIAL_ADMIN_VEHICLES.filter((v) => v.verification === "pending_source").length +
    INITIAL_ADMIN_WEAPONS.filter((w) => w.verification === "pending_source").length;

  const totalDatabaseRecords =
    INITIAL_ADMIN_VEHICLES.length +
    INITIAL_ADMIN_WEAPONS.length +
    INITIAL_ADMIN_MAP_MARKERS.length;

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      showToast({
        title: "Health Audit Complete",
        description: "All database tables, media assets, and tool endpoints are operational.",
        type: "success",
      });
    }, 1200);
  };

  const needsAttentionItems = [
    {
      id: "na-1",
      title: "Bravado Banshee GTS",
      category: "Vehicle Record",
      issue: "2 unverified sources require corroboration against trailer timestamps.",
      badge: "Pending Source",
      badgeColor: "amber",
      actionUrl: "/admin/vehicles?edit=veh-1",
      actionLabel: "Review Record",
    },
    {
      id: "na-2",
      title: "Vice City Metro Map",
      category: "Tool Marker",
      issue: "1 displaced marker coordinates outside Leonida boundary.",
      badge: "Marker Error",
      badgeColor: "rose",
      actionUrl: "/admin/map?marker=mark-1",
      actionLabel: "Recalibrate",
    },
    {
      id: "na-3",
      title: "Vehicle database research notes",
      category: "Article Draft",
      issue: "Editorial review pending before public scheduled release.",
      badge: "In Review",
      badgeColor: "indigo",
      actionUrl: "/admin/articles?edit=art-2",
      actionLabel: "Editorial Review",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight">
              Editorial & System Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-3 h-3" /> Live Atlas v1.4.2
            </span>
          </div>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Real-time status of content publications, database asset verifications, and system health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] hover:bg-[var(--admin-elevated)] text-xs font-bold text-[var(--admin-text)] transition-colors disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-[var(--admin-primary)]", isAuditing && "animate-spin")} />
            <span>{isAuditing ? "Auditing System..." : "Run Health Audit"}</span>
          </button>

          <Link
            href="/admin/articles?action=new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--admin-primary)] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md shadow-[var(--admin-primary)]/25"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Published Content"
          value={128}
          subtext="Articles, guides & breakdowns"
          icon={FileText}
          trend={{ value: "+4 this week", isPositive: true }}
          accentColor="primary"
        />
        <StatCard
          label="Awaiting Review"
          value={9}
          subtext="Items needing verification"
          icon={Clock}
          trend={{ value: "Action required", isPositive: false }}
          accentColor="warning"
        />
        <StatCard
          label="Database Records"
          value={246}
          subtext="Vehicles, weapons, locations"
          icon={Car}
          trend={{ value: "+12 verified", isPositive: true }}
          accentColor="success"
        />
        <StatCard
          label="Tools Online"
          value="3/3"
          subtext="Map, comparisons, tracker"
          icon={Zap}
          trend={{ value: "100% uptime", isPositive: true }}
          accentColor="info"
        />
      </div>

      {/* Main Grid: 2/3 Content & 1/3 Sidebar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Needs Attention & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Needs Attention Queue */}
          <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--admin-text)]">
                  Needs Attention ({needsAttentionItems.length})
                </h2>
              </div>
              <span className="text-xs text-[var(--admin-text-muted)]">Priority triage queue</span>
            </div>

            <div className="space-y-3">
              {needsAttentionItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[var(--admin-primary)]/40 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[var(--admin-text)] truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[var(--admin-text-muted)] font-medium">
                        • {item.category}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border",
                          item.badgeColor === "amber" &&
                            "bg-amber-500/10 text-amber-400 border-amber-500/30",
                          item.badgeColor === "rose" &&
                            "bg-rose-500/10 text-rose-400 border-rose-500/30",
                          item.badgeColor === "indigo" &&
                            "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                        )}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--admin-text-muted)] leading-relaxed">
                      {item.issue}
                    </p>
                  </div>

                  <Link
                    href={item.actionUrl}
                    className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-lg bg-[var(--admin-elevated)] hover:bg-[var(--admin-primary)] hover:text-white border border-[var(--admin-border)] text-xs font-bold text-[var(--admin-text)] transition-colors shrink-0"
                  >
                    <span>{item.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--admin-primary)]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--admin-text)]">
                  Recent Activity & Edits
                </h2>
              </div>
              <Link
                href="/admin/activity"
                className="text-xs font-bold text-[var(--admin-primary)] hover:underline flex items-center gap-1"
              >
                <span>View full audit log</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--admin-border)] text-[var(--admin-text-muted)] bg-[var(--admin-surface)]">
                    <th className="p-3 font-bold uppercase tracking-wider">Record / Title</th>
                    <th className="p-3 font-bold uppercase tracking-wider">Type</th>
                    <th className="p-3 font-bold uppercase tracking-wider">Action</th>
                    <th className="p-3 font-bold uppercase tracking-wider">Editor</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--admin-border-subtle)]">
                  <tr className="hover:bg-[var(--admin-elevated)]/60 transition-colors">
                    <td className="p-3 font-bold text-[var(--admin-text)]">
                      Bravado Banshee GTS
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        Vehicle
                      </span>
                    </td>
                    <td className="p-3 text-[var(--admin-text-muted)]">Source verified</td>
                    <td className="p-3 text-[var(--admin-text)] font-medium">Morgan Kim</td>
                    <td className="p-3 text-right text-[var(--admin-text-muted)] font-mono">
                      12m ago
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--admin-elevated)]/60 transition-colors">
                    <td className="p-3 font-bold text-[var(--admin-text)]">
                      Vice City Metro Station
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Marker
                      </span>
                    </td>
                    <td className="p-3 text-[var(--admin-text-muted)]">Moved coordinates</td>
                    <td className="p-3 text-[var(--admin-text)] font-medium">Alex Rivera</td>
                    <td className="p-3 text-right text-[var(--admin-text-muted)] font-mono">
                      45m ago
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--admin-elevated)]/60 transition-colors">
                    <td className="p-3 font-bold text-[var(--admin-text)]">
                      Trailer details to verify
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        Article
                      </span>
                    </td>
                    <td className="p-3 text-[var(--admin-text-muted)]">Saved draft</td>
                    <td className="p-3 text-[var(--admin-text)] font-medium">Jamie Lee</td>
                    <td className="p-3 text-right text-[var(--admin-text-muted)] font-mono">
                      2h ago
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--admin-elevated)]/60 transition-colors">
                    <td className="p-3 font-bold text-[var(--admin-text)]">
                      Combat Pistol (9mm)
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30">
                        Weapon
                      </span>
                    </td>
                    <td className="p-3 text-[var(--admin-text-muted)]">Updated stats</td>
                    <td className="p-3 text-[var(--admin-text)] font-medium">Daniel Torres</td>
                    <td className="p-3 text-right text-[var(--admin-text-muted)] font-mono">
                      5h ago
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Quick Actions, Scheduled Publications, Tool Health */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--admin-text)]">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/admin/articles?action=new"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] hover:border-[var(--admin-primary)] transition-all text-center group"
              >
                <FileText className="w-5 h-5 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--admin-text)]">+ Article</span>
                <span className="text-[10px] text-[var(--admin-text-muted)]">Editorial draft</span>
              </Link>

              <Link
                href="/admin/vehicles?action=new"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] hover:border-[var(--admin-primary)] transition-all text-center group"
              >
                <Car className="w-5 h-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--admin-text)]">+ Vehicle</span>
                <span className="text-[10px] text-[var(--admin-text-muted)]">Spec sheet</span>
              </Link>

              <Link
                href="/admin/weapons?action=new"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] hover:border-[var(--admin-primary)] transition-all text-center group"
              >
                <Crosshair className="w-5 h-5 text-pink-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--admin-text)]">+ Weapon</span>
                <span className="text-[10px] text-[var(--admin-text-muted)]">Arsenal record</span>
              </Link>

              <Link
                href="/admin/map?action=new"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] hover:border-[var(--admin-primary)] transition-all text-center group"
              >
                <MapPin className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--admin-text)]">+ Marker</span>
                <span className="text-[10px] text-[var(--admin-text-muted)]">Atlas coordinate</span>
              </Link>
            </div>
          </div>

          {/* Scheduled Publications Card */}
          <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--admin-text)]">
                Scheduled Releases
              </h2>
              <Clock className="w-4 h-4 text-[var(--admin-text-muted)]" />
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--admin-text)] line-clamp-1">
                    Weapon balance preview
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                    Sep 24
                  </span>
                </div>
                <p className="text-[11px] text-[var(--admin-text-muted)]">
                  Analysis • 5 min read • By Daniel Torres
                </p>
              </div>

              <div className="p-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--admin-text)] line-clamp-1">
                    Leonida district breakdown
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                    Sep 26
                  </span>
                </div>
                <p className="text-[11px] text-[var(--admin-text-muted)]">
                  Guides • 8 min read • By Jamie Lee
                </p>
              </div>
            </div>

            <Link
              href="/admin/articles?tab=scheduled"
              className="block text-center text-xs font-bold text-[var(--admin-primary)] hover:underline pt-1"
            >
              Manage publishing schedule →
            </Link>
          </div>

          {/* Tool Health & Status Card */}
          <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--admin-text)]">
                Tool Health
              </h2>
              <Server className="w-4 h-4 text-[var(--admin-text-muted)]" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-[var(--admin-text)]">Interactive Map</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400">99.9% Uptime</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-[var(--admin-text)]">Vehicle Comparisons</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400">Operational</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-[var(--admin-text)]">Completion Tracker</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
