"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Search,
  Eye,
  Zap,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Analytics & Audience Insights</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Monitor reader engagement, interactive tool adoption, popular database records, and site search query trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs font-bold text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
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
        <StatCard
          label="Total Page Views"
          value="248,300"
          subtext="+14.2% vs previous period"
          icon={Eye}
          trend={{ value: "+14.2%", isPositive: true }}
          accentColor="primary"
        />
        <StatCard
          label="Search Sessions"
          value="42,150"
          subtext="+8.7% query volume"
          icon={Search}
          trend={{ value: "+8.7%", isPositive: true }}
          accentColor="info"
        />
        <StatCard
          label="Tool Sessions"
          value="68,900"
          subtext="+22.4% interactive usage"
          icon={Zap}
          trend={{ value: "+22.4%", isPositive: true }}
          accentColor="success"
        />
      </div>

      {/* 4 Data Tables Grid (Image 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Top Articles */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Top Articles & Editorial
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--admin-border)] text-[var(--admin-text-muted)] bg-[var(--admin-surface)]">
                  <th className="p-3 font-bold uppercase">Article Title</th>
                  <th className="p-3 font-bold uppercase">Category</th>
                  <th className="p-3 font-bold uppercase text-right">Views</th>
                  <th className="p-3 font-bold uppercase text-right">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border-subtle)]">
                {topArticles.map((art, i) => (
                  <tr key={i} className="hover:bg-[var(--admin-elevated)]/40">
                    <td className="p-3 font-bold text-[var(--admin-text)] truncate max-w-[200px]">
                      {art.title}
                    </td>
                    <td className="p-3 text-[var(--admin-text-muted)]">{art.category}</td>
                    <td className="p-3 text-right font-mono font-bold text-[var(--admin-text)]">
                      {art.views}
                    </td>
                    <td className="p-3 text-right font-mono text-[var(--admin-text-muted)]">
                      {art.avgTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Popular Database Pages */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Popular Database Pages
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--admin-border)] text-[var(--admin-text-muted)] bg-[var(--admin-surface)]">
                  <th className="p-3 font-bold uppercase">Record</th>
                  <th className="p-3 font-bold uppercase">Type</th>
                  <th className="p-3 font-bold uppercase text-right">Views</th>
                  <th className="p-3 font-bold uppercase text-right">Uniques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border-subtle)]">
                {popularDatabasePages.map((page, i) => (
                  <tr key={i} className="hover:bg-[var(--admin-elevated)]/40">
                    <td className="p-3 font-bold text-[var(--admin-text)]">{page.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--admin-elevated)] border border-[var(--admin-border)]">
                        {page.type}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[var(--admin-text)]">
                      {page.views}
                    </td>
                    <td className="p-3 text-right font-mono text-[var(--admin-text-muted)]">
                      {page.unique}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3: Tool Usage */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Interactive Tool Usage
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--admin-border)] text-[var(--admin-text-muted)] bg-[var(--admin-surface)]">
                  <th className="p-3 font-bold uppercase">Tool Name</th>
                  <th className="p-3 font-bold uppercase text-right">Sessions</th>
                  <th className="p-3 font-bold uppercase text-right">Avg Duration</th>
                  <th className="p-3 font-bold uppercase text-right">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border-subtle)]">
                {toolUsage.map((tool, i) => (
                  <tr key={i} className="hover:bg-[var(--admin-elevated)]/40">
                    <td className="p-3 font-bold text-[var(--admin-text)]">{tool.name}</td>
                    <td className="p-3 text-right font-mono font-bold text-[var(--admin-text)]">
                      {tool.sessions}
                    </td>
                    <td className="p-3 text-right font-mono text-[var(--admin-text-muted)]">
                      {tool.avgDuration}
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-400 font-bold">
                      {tool.completion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 4: Search Queries with Alert */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Top Search Queries & Content Gaps
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--admin-border)] text-[var(--admin-text-muted)] bg-[var(--admin-surface)]">
                  <th className="p-3 font-bold uppercase">Search Term</th>
                  <th className="p-3 font-bold uppercase text-right">Volume</th>
                  <th className="p-3 font-bold uppercase text-right">CTR</th>
                  <th className="p-3 font-bold uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border-subtle)]">
                {searchQueries.map((q, i) => (
                  <tr key={i} className="hover:bg-[var(--admin-elevated)]/40">
                    <td className="p-3 font-bold text-[var(--admin-text)]">{q.term}</td>
                    <td className="p-3 text-right font-mono text-[var(--admin-text)]">{q.count}</td>
                    <td className="p-3 text-right font-mono text-[var(--admin-text-muted)]">{q.ctr}</td>
                    <td className="p-3 text-right">
                      {q.hasNoResults ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3" /> No Results
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-semibold">Answered</span>
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
