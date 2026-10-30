"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Search,
  Eye,
  Zap,
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

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(28);
  const [refreshKey, setRefreshKey] = useState(0);
  const [topArticles, setTopArticles] = useState<{ title: string; category: string; views: string; avgTime: string; bounce: string }[]>([]);

  const [searchConsole, setSearchConsole] = useState<{
    range: { days: number; startDate: string; endDate: string };
    summary: { clicks: number; impressions: number; ctr: number; averagePosition: number };
    queries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
    pages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[];
    fetchedAt: string;
  } | null>(null);
  const [gscState, setGscState] = useState<"loading" | "connected" | "needs-authorization" | "setup-required" | "error">("loading");
  const [gscSetupItems, setGscSetupItems] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const arts = await getAdminArticles();
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
      } catch (err) {
        console.error("Failed to load analytics live data:", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let active = true;
    setGscState("loading");
    fetch(`/api/admin/search-console?days=${days}`, { cache: "no-store" })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ body }) => {
        if (!active) return;
        if (body.connected && body.success) {
          setSearchConsole(body);
          setGscState("connected");
          setGscSetupItems([]);
        } else {
          setSearchConsole(null);
          setGscSetupItems(Array.isArray(body.missingConfig) ? body.missingConfig : []);
          setGscState(body.missingConfig?.length ? "setup-required" : body.needsAuthorization ? "needs-authorization" : "error");
        }
      })
      .catch(() => { if (active) setGscState("error"); });
    return () => { active = false; };
  }, [days, refreshKey]);

  const toolUsage: { name: string; sessions: string; avgDuration: string; completion: string }[] = []; // Requires real analytics integration — no fabricated data.

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Page Header (Image 13) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-400">
              {gscState === "connected" ? "Search Console connected" : "Search Console not connected"}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Content inventory is available below. Search traffic, clicks, impressions, and queries need a Search Console connection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="gsc-range" className="sr-only">Search Console date range</label>
          <select id="gsc-range" value={days} onChange={(event) => setDays(Number(event.target.value))} disabled={gscState === "setup-required" || gscState === "needs-authorization"} className="rounded-xl border border-[#1C2436] bg-[#111622] px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-50">
            <option value={7}>Last 7 days</option>
            <option value={28}>Last 28 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          {gscState === "connected" ? (
            <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="inline-flex items-center gap-2 rounded-xl border border-[#1C2436] bg-[#111622] px-3.5 py-2 text-xs font-semibold text-white hover:border-[#6366F1]/50">Refresh data</button>
          ) : (
            <a href="/api/admin/search-console/connect" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#6366F1]/40 bg-[#6366F1]/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#6366F1]/20">
              Connect Search Console <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#1C2436] bg-[#111622] px-3.5 py-2 text-xs font-semibold text-white hover:border-[#6366F1]/50">Open Google Search Console</a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium">Google Search clicks</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{searchConsole?.summary.clicks.toLocaleString() ?? "—"}</p>
          <p className="text-xs text-[#94A3B8]">Selected Search Console range</p>
        </div>

        <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium">Impressions</span>
            <Search className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{searchConsole?.summary.impressions.toLocaleString() ?? "—"}</p>
          <p className="text-xs text-[#94A3B8]">Selected Search Console range</p>
        </div>

        <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium">Average CTR</span>
            <Zap className="w-4 h-4 text-gold-light" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{searchConsole ? `${(searchConsole.summary.ctr * 100).toFixed(1)}%` : "—"}</p>
          <p className="text-xs text-[#94A3B8]">Selected Search Console range</p>
        </div>

        <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]"><span className="text-xs font-medium">Average Position</span><TrendingUp className="w-4 h-4 text-indigo-400" /></div>
          <p className="text-2xl font-bold text-white tracking-tight">{searchConsole ? searchConsole.summary.averagePosition.toFixed(1) : "—"}</p>
          <p className="text-xs text-[#94A3B8]">Selected Search Console range</p>
        </div>
      </div>

      {/* Search Queries Callout Card (Image 13) */}
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-gold-light">
          <AlertTriangle className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider">Search Console status & query data</h2>
        </div>
        <p className="text-xs text-[#94A3B8]">
          {gscState === "connected" && searchConsole ? `Property data from ${searchConsole.range.startDate} through ${searchConsole.range.endDate}. Search Console may process recent dates with a delay.` : gscState === "setup-required" ? "Add the required server environment configuration to enable Google authorization." : gscState === "needs-authorization" ? "Authorize the Google account that has access to the configured verified property." : gscState === "loading" ? "Checking Search Console connection…" : "Search Console could not be reached. Review the property and server connection configuration."}
        </p>

        {gscState === "setup-required" && <p className="p-3 rounded-lg bg-[#111622] border border-[#1C2436] text-xs text-[#64748B]">Missing server variables: {gscSetupItems.join(", ")}</p>}
        {gscState === "connected" && searchConsole && <p className="text-xs text-[#64748B]">Last fetched {new Date(searchConsole.fetchedAt).toLocaleString()}</p>}
      </div>

      {/* 4 Data Tables Grid (Image 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Recent Articles */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            Recent Articles & Editorial
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

        {/* Table 2: Search Console Pages */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            Top Search Console Pages
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Search Console page performance">
              <thead>
                <tr className="border-b border-[#1C2436] text-[#64748B] bg-[#0E131D] text-xs">
                  <th scope="col" className="p-3 font-medium">Page</th>
                  <th scope="col" className="p-3 font-medium text-right">Clicks</th>
                  <th scope="col" className="p-3 font-medium text-right">Impressions</th>
                  <th scope="col" className="p-3 font-medium text-right">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {!searchConsole || searchConsole.pages.length === 0 ? (<tr><td colSpan={4} className="p-4 text-center text-[#64748B]">No page rows available for this date range.</td></tr>) : searchConsole.pages.map((page, i) => (
                  <tr key={i} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3 font-semibold text-white truncate max-w-[260px]">{page.page}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">{page.clicks.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-[#94A3B8]">{page.impressions.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-[#94A3B8]">{page.position.toFixed(1)}</td>
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
            Search Console Queries
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Search query performance">
              <thead>
                <tr className="border-b border-[#1C2436] text-[#64748B] bg-[#0E131D] text-xs">
                  <th scope="col" className="p-3 font-medium">Search Term</th>
                  <th scope="col" className="p-3 font-medium text-right">Clicks</th>
                  <th scope="col" className="p-3 font-medium text-right">CTR</th>
                  <th scope="col" className="p-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {!searchConsole || searchConsole.queries.length === 0 ? (<tr><td colSpan={4} className="p-4 text-center text-[#64748B]">No query rows available for this date range.</td></tr>) : searchConsole.queries.map((q, i) => (
                  <tr key={i} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3 font-semibold text-white">{q.query}</td>
                    <td className="p-3 text-right font-mono text-white">{q.clicks.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-[#64748B]">{(q.ctr * 100).toFixed(1)}%</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#182030] text-[#94A3B8]">{q.impressions.toLocaleString()} impressions</span>
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
