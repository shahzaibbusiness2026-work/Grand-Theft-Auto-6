"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Database, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight,
  Eye,
  ShieldCheck,
  RefreshCw,
  Server
} from "lucide-react";
import { INITIAL_ADMIN_ARTICLES, INITIAL_DATABASE_ASSETS } from "@/lib/admin-data";

export default function AdminDashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthStatus, setHealthStatus] = useState<"healthy" | "running">("healthy");

  const publishedCount = INITIAL_ADMIN_ARTICLES.filter(a => a.status === "published").length;
  const draftOrScheduled = INITIAL_ADMIN_ARTICLES.filter(a => a.status === "draft" || a.status === "scheduled").length;
  const verifiedAssets = INITIAL_DATABASE_ASSETS.filter(a => a.status === "verified").length;
  const unconfirmedAssets = INITIAL_DATABASE_ASSETS.filter(a => a.status === "unconfirmed").length;

  const handleDiagnostic = () => {
    setIsRefreshing(true);
    setHealthStatus("running");
    setTimeout(() => {
      setIsRefreshing(false);
      setHealthStatus("healthy");
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Editorial & System Overview
          </h1>
          <p className="text-sm text-[#94A3BD] mt-1">
            Real-time status of content publications, database asset verifications, and system health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDiagnostic}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#33415C] bg-[#141C2E] hover:bg-[#1C2740] text-xs font-bold text-[#F5F7FC] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#B8AAFF] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Checking Link Health..." : "Run Health Audit"}</span>
          </button>

          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B8AAFF] hover:bg-[#A898F0] text-[#171127] text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-[#B8AAFF]/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3BD]">Published Articles</span>
            <span className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-emerald-400">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-white">{publishedCount}</span>
            <span className="text-xs font-medium text-emerald-400">+1 this week</span>
          </div>
          <p className="mt-1 text-xs text-[#B5C0D4]">
            {INITIAL_ADMIN_ARTICLES.reduce((acc, a) => acc + a.views, 0).toLocaleString()} total public reads
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3BD]">Drafts & Scheduled</span>
            <span className="p-2 rounded-lg bg-[#1C2740] border border-[#33415C] text-[#B8AAFF]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-white">{draftOrScheduled}</span>
            <span className="text-xs font-medium text-[#B8AAFF]">1 awaiting review</span>
          </div>
          <p className="mt-1 text-xs text-[#B5C0D4]">
            Next release: Sep 25, 2026
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3BD]">Verified Assets</span>
            <span className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-white">{verifiedAssets}</span>
            <span className="text-xs font-medium text-[#94A3BD]">of {INITIAL_DATABASE_ASSETS.length} tracked</span>
          </div>
          <p className="mt-1 text-xs text-[#B5C0D4]">
            Official trailer 1 confirmed
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3BD]">System Health</span>
            <span className="p-2 rounded-lg bg-[#1C2740] border border-[#33415C] text-[#F3A398]">
              <Server className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-white">99.98%</span>
            <span className="text-xs font-medium text-emerald-400">Optimal</span>
          </div>
          <p className="mt-1 text-xs text-[#B5C0D4]">
            Next.js App Router • 0 404s
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity & Revision Table */}
        <div className="lg:col-span-2 rounded-2xl border border-[#33415C] bg-[#141C2E] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
              Recent Editorial Activity
            </h2>
            <Link 
              href="/admin/articles" 
              className="text-xs font-bold text-[#B8AAFF] hover:underline flex items-center gap-1"
            >
              <span>Manage All Articles</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#33415C] text-[#94A3BD]">
                  <th className="pb-3 font-semibold uppercase tracking-wider">Article / Asset</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Status</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Editor</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Last Modified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#33415C]/50">
                {INITIAL_ADMIN_ARTICLES.map((art) => (
                  <tr key={art.id} className="hover:bg-[#1C2740]/50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <p className="font-bold text-white line-clamp-1">{art.title}</p>
                      <p className="text-[11px] text-[#94A3BD] mt-0.5">{art.category} • {art.readTime}</p>
                    </td>
                    <td className="py-3.5 whitespace-nowrap">
                      {art.status === "published" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                          Published
                        </span>
                      )}
                      {art.status === "scheduled" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 border border-amber-800/40 text-amber-400">
                          Scheduled
                        </span>
                      )}
                      {art.status === "draft" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1C2740] border border-[#33415C] text-[#B8AAFF]">
                          Draft
                        </span>
                      )}
                      {art.status === "archived" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1C2740] border border-[#33415C] text-[#94A3BD]">
                          Archived
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-[#B5C0D4] whitespace-nowrap">{art.author}</td>
                    <td className="py-3.5 font-mono text-[11px] text-[#94A3BD] whitespace-nowrap">
                      {new Date(art.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Database & Verification Status Card */}
        <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
              Asset Verification
            </h2>
            <Link 
              href="/admin/database" 
              className="text-xs font-bold text-[#B8AAFF] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-[#94A3BD]">
            Every vehicle, weapon, and location in the Atlas database must be corroborated against official releases before publishing.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-[#33415C] bg-[#1C2740]/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">Vehicles Catalog</span>
                <p className="text-[11px] text-[#94A3BD]">2 Verified • 1 Pending</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#B8AAFF]">66% verified</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#33415C] bg-[#1C2740]/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">Weapons Arsenal</span>
                <p className="text-[11px] text-[#94A3BD]">1 Verified • 1 Pending</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#B8AAFF]">50% verified</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#33415C] bg-[#1C2740]/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">Locations & Landmarks</span>
                <p className="text-[11px] text-[#94A3BD]">1 Verified • 1 Pending</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#B8AAFF]">50% verified</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#33415C]/60">
            <Link
              href="/admin/database"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#33415C] bg-[#1C2740] hover:bg-[#253352] text-xs font-bold text-white transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-[#B8AAFF]" />
              <span>Launch Verification Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
