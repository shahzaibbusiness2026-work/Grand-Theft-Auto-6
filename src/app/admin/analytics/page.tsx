"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Search,
  Eye,
  Zap,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Plus,
  ExternalLink
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const topArticles = [
    { title: "How to use the Atlas map", category: "Guides", views: "48,200", avgTime: "4m 12s", bounce: "32%" },
    { title: "Trailer details to verify", category: "General", views: "34,800", avgTime: "5m 45s", bounce: "28%" },
    { title: "Vehicle database research notes", category: "Vehicles", views: "29,400", avgTime: "3m 50s", bounce: "35%" },
    { title: "Comparing database records", category: "Analysis", views: "18,900", avgTime: "6m 10s", bounce: "24%" },
  ];

  const popularDatabasePages = [
    { name: "Bravado Banshee GTS", type: "Vehicle", views: "42,100", unique: "31,200" },
    { name: "Combat Pistol (9mm)", type: "Weapon", views: "28,400", unique: "21,800" },
    { name: "Vice City Metro Station", type: "Location", views: "22,900", unique: "17,400" },
    { name: "Pegassi Zorrusso", type: "Vehicle", views: "19,800", unique: "14,600" },
  ];

  const toolUsage = [
    { name: "Interactive Map", sessions: "45,200", avgDuration: "8m 24s", completion: "94%" },
    { name: "Vehicle & Weapon Comparisons", sessions: "16,400", avgDuration: "3m 42s", completion: "88%" },
    { name: "100% Completion Tracker", sessions: "7,300", avgDuration: "12m 10s", completion: "76%" },
  ];

  const searchQueries = [
    { term: "Banshee top speed", count: "3,420", ctr: "68%", hasNoResults: false },
    { term: "Vice City airport coordinates", count: "2,890", ctr: "74%", hasNoResults: false },
    { term: "Lucia penitentiary uniform", count: "1,450", ctr: "0%", hasNoResults: true },
    { term: "Service Carbine location", count: "1,220", ctr: "81%", hasNoResults: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Page Header (Image 13) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A2015] border border-[#4A3818] text-[#E5A83B]">
              Demo data
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Traffic, user engagement, and popular content metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="time-range" className="sr-only">Time range</label>
          <select
            id="time-range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs font-semibold text-white focus:outline-none focus:border-[#6366F1]"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days (Sep 14 - Sep 20)</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* 3 Metric Cards (Image 13) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium">Total Page Views</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">248,300</p>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% vs previous period</span>
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium">Search Sessions</span>
            <Search className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">42,150</p>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8.7% query volume</span>
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium">Tool Sessions</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">68,900</p>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+22.4% interactive usage</span>
          </p>
        </div>
      </div>

      {/* Search Queries Callout Card (Image 13) */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider">
            Search Trends & Content Gaps
          </h2>
        </div>
        <p className="text-xs text-[#94A3B8]">
          High volume queries with zero matching results indicate immediate content creation opportunities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-[#111622] border border-[#1C2436] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">&quot;Lucia penitentiary uniform&quot;</p>
              <p className="text-[11px] text-[#64748B]">1,450 searches • 0% CTR</p>
            </div>
            <Link
              href="/admin/articles/art-new"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6366F1] hover:underline"
            >
              + Create draft <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-3 rounded-lg bg-[#111622] border border-[#1C2436] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">&quot;Vice City airport coordinates&quot;</p>
              <p className="text-[11px] text-[#64748B]">2,890 searches • 74% CTR</p>
            </div>
            <Link
              href="/admin/map"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6366F1] hover:underline"
            >
              + Add map marker <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Data Tables Grid (Image 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Top Articles */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            Top Articles & Editorial
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Top performing articles">
              <thead>
                <tr className="border-b border-[#1C2436] text-[#64748B] bg-[#0E131D] text-[11px]">
                  <th scope="col" className="p-3 font-medium">Article Title</th>
                  <th scope="col" className="p-3 font-medium">Category</th>
                  <th scope="col" className="p-3 font-medium text-right">Views</th>
                  <th scope="col" className="p-3 font-medium text-right">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {topArticles.map((art, i) => (
                  <tr key={i} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3 font-semibold text-white truncate max-w-[200px]">
                      {art.title}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#182030] text-[#94A3B8] border border-[#243048]">
                        {art.category}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {art.views}
                    </td>
                    <td className="p-3 text-right font-mono text-[#64748B]">
                      {art.avgTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Popular Database Pages */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            Popular Database Pages
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Most viewed database pages">
              <thead>
                <tr className="border-b border-[#1C2436] text-[#64748B] bg-[#0E131D] text-[11px]">
                  <th scope="col" className="p-3 font-medium">Record</th>
                  <th scope="col" className="p-3 font-medium">Type</th>
                  <th scope="col" className="p-3 font-medium text-right">Views</th>
                  <th scope="col" className="p-3 font-medium text-right">Uniques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {popularDatabasePages.map((page, i) => (
                  <tr key={i} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3 font-semibold text-white">{page.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#182030] text-[#94A3B8] border border-[#243048]">
                        {page.type}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {page.views}
                    </td>
                    <td className="p-3 text-right font-mono text-[#64748B]">
                      {page.unique}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3: Tool Usage */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            Interactive Tool Usage
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Interactive tool usage statistics">
              <thead>
                <tr className="border-b border-[#1C2436] text-[#64748B] bg-[#0E131D] text-[11px]">
                  <th scope="col" className="p-3 font-medium">Tool Name</th>
                  <th scope="col" className="p-3 font-medium text-right">Sessions</th>
                  <th scope="col" className="p-3 font-medium text-right">Avg Duration</th>
                  <th scope="col" className="p-3 font-medium text-right">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {toolUsage.map((tool, i) => (
                  <tr key={i} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3 font-semibold text-white">{tool.name}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {tool.sessions}
                    </td>
                    <td className="p-3 text-right font-mono text-[#64748B]">
                      {tool.avgDuration}
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-[11px] font-mono font-bold text-emerald-400">
                        {tool.completion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 4: Search Queries */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            Top Search Queries & Volume
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Search query performance">
              <thead>
                <tr className="border-b border-[#1C2436] text-[#64748B] bg-[#0E131D] text-[11px]">
                  <th scope="col" className="p-3 font-medium">Search Term</th>
                  <th scope="col" className="p-3 font-medium text-right">Volume</th>
                  <th scope="col" className="p-3 font-medium text-right">CTR</th>
                  <th scope="col" className="p-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {searchQueries.map((q, i) => (
                  <tr key={i} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3 font-semibold text-white">{q.term}</td>
                    <td className="p-3 text-right font-mono text-white">{q.count}</td>
                    <td className="p-3 text-right font-mono text-[#64748B]">{q.ctr}</td>
                    <td className="p-3 text-right">
                      {q.hasNoResults ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 border border-red-500/20 text-red-400">
                          0 Results
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
