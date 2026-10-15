"use client";

import React, { useState, useEffect } from "react";
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
import { getAdminArticles } from "@/lib/services/articles";
import { getAdminVehicles } from "@/lib/services/vehicles";
import { getAdminWeapons } from "@/lib/services/weapons";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [topArticles, setTopArticles] = useState<{ title: string; category: string; views: string; avgTime: string; bounce: string }[]>([]);

  const [popularDatabasePages, setPopularDatabasePages] = useState<{ name: string; type: string; views: string; unique: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [arts, vehs, weaps] = await Promise.all([
          getAdminArticles(),
          getAdminVehicles(),
          getAdminWeapons(),
        ]);
        if (arts && arts.length > 0) {
          setTopArticles(
            arts.slice(0, 5).map((a) => ({
              title: a.title,
              category: a.category || "News",
              views: a.views ? a.views.toLocaleString() : "—",
              avgTime: "—",
              bounce: "—",
            }))
          );
        }
        if (vehs && vehs.length > 0) {
          setPopularDatabasePages([
            ...vehs.slice(0, 2).map((v) => ({
              name: v.name,
              type: "Vehicle",
              views: "—",
              unique: "—",
            })),
            ...(weaps || []).slice(0, 2).map((w) => ({
              name: w.name,
              type: "Weapon",
              views: "—",
              unique: "—",
            })),
          ]);
        }
      } catch (err) {
        console.error("Failed to load analytics live data:", err);
      }
    }
    loadData();
  }, []);

  const toolUsage: { name: string; sessions: string; avgDuration: string; completion: string }[] = []; // Requires real analytics integration — no fabricated data.

  const searchQueries: { term: string; count: string; ctr: string; hasNoResults: boolean }[] = []; // Requires real analytics integration.

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Page Header (Image 13) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              Live data
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
            <span className="text-xs font-medium">Published Articles</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{topArticles.length > 0 ? topArticles.length : "—"}</p>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live from Supabase</span>
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium">Database Records</span>
            <Search className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{popularDatabasePages.length > 0 ? popularDatabasePages.length : "—"}</p>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Vehicles + weapons loaded</span>
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium">Traffic Analytics</span>
            <Zap className="w-4 h-4 text-gold-light" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">—</p>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Connect Plausible/GA4 to enable</span>
          </p>
        </div>
      </div>

      {/* Search Queries Callout Card (Image 13) */}
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-gold-light">
          <AlertTriangle className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider">
            Search Trends & Content Gaps
          </h2>
        </div>
        <p className="text-xs text-[#94A3B8]">
          High volume queries with zero matching results indicate immediate content creation opportunities.
        </p>

        <div className="p-3 rounded-lg bg-[#111622] border border-[#1C2436] text-xs text-[#64748B]">
          Search analytics require a connected analytics provider. No search data available yet.
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
                <tr className="border-b border-[#1C2436] text-[#64748B] bg-[#0E131D] text-xs">
                  <th scope="col" className="p-3 font-medium">Article Title</th>
                  <th scope="col" className="p-3 font-medium">Category</th>
                  <th scope="col" className="p-3 font-medium text-right">Views</th>
                  <th scope="col" className="p-3 font-medium text-right">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {topArticles.length === 0 ? (<tr><td colSpan={4} className="p-4 text-center text-[#64748B]">No article data yet.</td></tr>) : topArticles.map((art, i) => (
                  <tr key={i} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3 font-semibold text-white truncate max-w-[200px]">
                      {art.title}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#182030] text-[#94A3B8] border border-[#243048]">
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
                <tr className="border-b border-[#1C2436] text-[#64748B] bg-[#0E131D] text-xs">
                  <th scope="col" className="p-3 font-medium">Record</th>
                  <th scope="col" className="p-3 font-medium">Type</th>
                  <th scope="col" className="p-3 font-medium text-right">Views</th>
                  <th scope="col" className="p-3 font-medium text-right">Uniques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {popularDatabasePages.length === 0 ? (<tr><td colSpan={4} className="p-4 text-center text-[#64748B]">No database data yet.</td></tr>) : popularDatabasePages.map((page, i) => (
                  <tr key={i} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3 font-semibold text-white">{page.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#182030] text-[#94A3B8] border border-[#243048]">
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
                <tr className="border-b border-[#1C2436] text-[#64748B] bg-[#0E131D] text-xs">
                  <th scope="col" className="p-3 font-medium">Tool Name</th>
                  <th scope="col" className="p-3 font-medium text-right">Sessions</th>
                  <th scope="col" className="p-3 font-medium text-right">Avg Duration</th>
                  <th scope="col" className="p-3 font-medium text-right">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {toolUsage.length === 0 ? (<tr><td colSpan={4} className="p-4 text-center text-[#64748B]">No tool usage data — connect an analytics provider.</td></tr>) : toolUsage.map((tool, i) => (
                  <tr key={i} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3 font-semibold text-white">{tool.name}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {tool.sessions}
                    </td>
                    <td className="p-3 text-right font-mono text-[#64748B]">
                      {tool.avgDuration}
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400">
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
                <tr className="border-b border-[#1C2436] text-[#64748B] bg-[#0E131D] text-xs">
                  <th scope="col" className="p-3 font-medium">Search Term</th>
                  <th scope="col" className="p-3 font-medium text-right">Volume</th>
                  <th scope="col" className="p-3 font-medium text-right">CTR</th>
                  <th scope="col" className="p-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {searchQueries.length === 0 ? (<tr><td colSpan={4} className="p-4 text-center text-[#64748B]">No search data — connect an analytics provider.</td></tr>) : searchQueries.map((q, i) => (
                  <tr key={i} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3 font-semibold text-white">{q.term}</td>
                    <td className="p-3 text-right font-mono text-white">{q.count}</td>
                    <td className="p-3 text-right font-mono text-[#64748B]">{q.ctr}</td>
                    <td className="p-3 text-right">
                      {q.hasNoResults ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400">
                          0 Results
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
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
