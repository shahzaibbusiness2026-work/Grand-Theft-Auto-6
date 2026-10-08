"use client";

import React, { useState, useEffect } from "react";
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
  Layers,
  Zap,
  Calendar,
  Image as ImageIcon,
  Edit2,
  Scale,
  ListChecks,
  CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminArticles } from "@/lib/services/articles";
import { getAdminVehicles } from "@/lib/services/vehicles";
import { getAdminWeapons } from "@/lib/services/weapons";
import { getAdminCharacters } from "@/lib/services/characters";
import { getMapMarkers } from "@/lib/services/map";

export default function AdminOverviewPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
    publishedContent: 0,
    awaitingReview: 0,
    totalRecords: 0,
    articlesCount: 0,
    vehiclesCount: 0,
    weaponsCount: 0,
    charactersCount: 0,
    markersCount: 0,
  });
  const [recentEdits, setRecentEdits] = useState<
    { id: string; title: string; type: string; editor: string; time: string; href: string }[]
  >([]);
  const [scheduled, setScheduled] = useState<
    { id: string; title: string; date: string; category: string }[]
  >([]);
  const [attention, setAttention] = useState({ drafts: 0, unverifiedVehicles: 0, pendingMarkers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminArticles().catch(() => []),
      getAdminVehicles().catch(() => []),
      getAdminWeapons().catch(() => []),
      getAdminCharacters().catch(() => []),
      getMapMarkers().catch(() => []),
    ]).then(([articles, vehicles, weapons, characters, markers]) => {
      const published =
        articles.filter((a) => a.status === "published").length +
        vehicles.filter((v) => v.status === "published").length +
        weapons.filter((w) => w.status === "published").length;

      const review =
        articles.filter((a) => a.status === "review" || a.status === "draft").length +
        vehicles.filter((v) => v.status === "draft").length +
        weapons.filter((w) => w.status === "draft" || w.status === "review").length;

      const total =
        articles.length + vehicles.length + weapons.length + characters.length + markers.length;

      setStats({
        publishedContent: published,
        awaitingReview: review,
        totalRecords: total,
        articlesCount: articles.length,
        vehiclesCount: vehicles.length,
        weaponsCount: weapons.length,
        charactersCount: characters.length,
        markersCount: markers.length,
      });

      setAttention({
        drafts: articles.filter((a) => a.status === "review" || a.status === "draft").length,
        unverifiedVehicles: vehicles.filter(
          (v) => v.verification === "unverified" || v.verification === "pending_source"
        ).length,
        pendingMarkers: markers.filter((m) => m.verification === "pending" || m.verification === "unverified")
          .length,
      });

      // Recent edits across content types, newest first
      const edits = [
        ...articles.map((a) => ({
          id: a.id,
          title: a.title,
          type: "Article",
          editor: a.author?.name || "Atlas Staff",
          time: a.updatedAt,
          href: `/admin/articles/${a.id}`,
        })),
        ...vehicles.map((v) => ({
          id: v.id,
          title: v.name,
          type: "Vehicle",
          editor: v.lastEditor || "Atlas Staff",
          time: v.updatedAt,
          href: `/admin/vehicles/${v.id}`,
        })),
        ...weapons.map((w) => ({
          id: w.id,
          title: w.name,
          type: "Weapon",
          editor: "Atlas Staff",
          time: w.updatedAt,
          href: `/admin/weapons/${w.id}`,
        })),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 4)
        .map((e) => ({
          ...e,
          time: new Date(e.time).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
        }));
      setRecentEdits(edits);

      setScheduled(
        articles
          .filter((a) => a.status === "scheduled")
          .slice(0, 4)
          .map((a) => ({
            id: a.id,
            title: a.title,
            date: a.scheduledFor
              ? new Date(a.scheduledFor).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "Unscheduled",
            category: a.category,
          }))
      );

      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header (Image 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Database
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Your publishing workspace • Real-time stats from Supabase
          </p>
        </div>

        <Link
          href="/admin/articles?action=new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create article</span>
        </Link>
      </div>

      {/* 4 Stat Cards Row (Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Published content */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#201D47] text-[#818CF8] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#94A3B8] font-medium">Published content</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {isLoading ? "…" : stats.publishedContent}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">Articles & verified records</p>
          </div>
        </div>

        {/* Card 2: Awaiting review */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#382618] text-[#F59E0B] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#94A3B8] font-medium">Awaiting review</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {isLoading ? "…" : stats.awaitingReview}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">Drafts & items to verify</p>
          </div>
        </div>

        {/* Card 3: Database records */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#162544] text-[#38BDF8] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#94A3B8] font-medium">Database records</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {isLoading ? "…" : stats.totalRecords}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">Across all 8 tables</p>
          </div>
        </div>

        {/* Card 4: Tools online */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#123324] text-[#34D399] flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#94A3B8] font-medium">Tools online</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-0.5">3/3</p>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">All systems operational</p>
          </div>
        </div>
      </div>


      {/* Main Grid: Left 2/3 and Right 1/3 (Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols ~ 66%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Needs Attention Card (Image 1) */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <div>
                <h2 className="font-sans text-xl font-bold tracking-tight text-white">Needs attention</h2>
                <p className="text-xs text-[#64748B]">Items that require your input</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Items needing attention">
                <thead>
                  <tr className="border-b border-[#1C2436] text-[#64748B] text-[11px]">
                    <th scope="col" className="pb-2.5 font-medium">Task</th>
                    <th scope="col" className="pb-2.5 font-medium">Details</th>
                    <th scope="col" className="pb-2.5 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182030]">
                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-[#94A3B8] shrink-0" />
                        <div>
                          <p className="font-semibold text-white">Articles awaiting approval</p>
                          <p className="text-[11px] text-[#64748B]">Review drafts from team members</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-[#94A3B8] whitespace-nowrap">
                      {attention.drafts} {attention.drafts === 1 ? "record" : "records"}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <Link
                        href="/admin/articles"
                        className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-colors"
                      >
                        Open queue
                      </Link>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <Car className="w-4 h-4 text-[#94A3B8] shrink-0" />
                        <div>
                          <p className="font-semibold text-white">Verify vehicle sources</p>
                          <p className="text-[11px] text-[#64748B]">Check and confirm information sources</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-[#94A3B8] whitespace-nowrap">
                      {attention.unverifiedVehicles} {attention.unverifiedVehicles === 1 ? "record" : "records"}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <Link
                        href="/admin/vehicles"
                        className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-colors"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" />
                        <div>
                          <p className="font-semibold text-white">Map markers to verify</p>
                          <p className="text-[11px] text-[#64748B]">Confirm locations and correct metadata</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-[#94A3B8] whitespace-nowrap">
                      {attention.pendingMarkers} {attention.pendingMarkers === 1 ? "marker" : "markers"}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <Link
                        href="/admin/map"
                        className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-colors"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Edits Card (Image 1) */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#38BDF8]" />
                <div>
                  <h2 className="font-sans text-xl font-bold tracking-tight text-white">Recent edits</h2>
                  <p className="text-xs text-[#64748B]">Latest changes across your content</p>
                </div>
              </div>
              <Link
                href="/admin/activity"
                className="text-xs font-semibold text-[#6366F1] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Recent content edits">
                <thead>
                  <tr className="border-b border-[#1C2436] text-[#64748B] text-[11px]">
                    <th scope="col" className="pb-2.5 font-medium">Record</th>
                    <th scope="col" className="pb-2.5 font-medium">Type</th>
                    <th scope="col" className="pb-2.5 font-medium">Editor</th>
                    <th scope="col" className="pb-2.5 font-medium">Time</th>
                    <th scope="col" className="pb-2.5 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182030]">
                  {recentEdits.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#64748B]">
                        No recent edits yet.
                      </td>
                    </tr>
                  )}
                  {recentEdits.map((e) => (
                    <tr key={e.id} className="hover:bg-[#141B2A] transition-colors">
                      <td className="py-3 pr-4 font-semibold text-white">{e.title}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#182030] text-[#94A3B8] border border-[#243048]">
                          {e.type}
                        </span>
                      </td>
                      <td className="py-3 text-[#94A3B8]">{e.editor}</td>
                      <td className="py-3 text-[#64748B] whitespace-nowrap">{e.time}</td>
                      <td className="py-3 text-right">
                        <Link
                          href={e.href}
                          className="inline-flex p-1.5 rounded-lg bg-[#182030] text-[#94A3B8] hover:text-white border border-[#243048] transition-colors"
                          aria-label={`Edit ${e.title}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions (Image 1) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#818CF8]" />
              <div>
                <h2 className="font-sans text-xl font-bold tracking-tight text-white">Quick actions</h2>
                <p className="text-xs text-[#64748B]">Create new content or records</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Add article - Active purple */}
              <Link
                href="/admin/articles?action=new"
                className="rounded-xl bg-[#6366F1] hover:bg-[#5254D8] p-3.5 flex items-center gap-3 transition-all shadow-md shadow-indigo-500/20 text-white group"
              >
                <FileText className="w-5 h-5 shrink-0 text-white" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">Add article</p>
                  <p className="text-[11px] text-white/80 truncate">Write a new article</p>
                </div>
              </Link>

              {/* Add vehicle */}
              <Link
                href="/admin/vehicles?action=new"
                className="rounded-xl bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] hover:border-[#6366F1]/50 p-3.5 flex items-center gap-3 transition-all text-white group"
              >
                <Car className="w-5 h-5 shrink-0 text-[#94A3B8] group-hover:text-white transition-colors" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">Add vehicle</p>
                  <p className="text-[11px] text-[#64748B] truncate">Create a vehicle record</p>
                </div>
              </Link>

              {/* Add weapon */}
              <Link
                href="/admin/weapons?action=new"
                className="rounded-xl bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] hover:border-[#6366F1]/50 p-3.5 flex items-center gap-3 transition-all text-white group"
              >
                <Crosshair className="w-5 h-5 shrink-0 text-[#94A3B8] group-hover:text-white transition-colors" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">Add weapon</p>
                  <p className="text-[11px] text-[#64748B] truncate">Create a weapon record</p>
                </div>
              </Link>

              {/* Add map marker */}
              <Link
                href="/admin/map?action=new"
                className="rounded-xl bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] hover:border-[#6366F1]/50 p-3.5 flex items-center gap-3 transition-all text-white group"
              >
                <MapPin className="w-5 h-5 shrink-0 text-[#94A3B8] group-hover:text-white transition-colors" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">Add map marker</p>
                  <p className="text-[11px] text-[#64748B] truncate">Add a location to the map</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols ~ 33%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Scheduled Articles Card (Image 1) */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#38BDF8]" />
                <div>
                  <h2 className="font-sans text-xl font-bold tracking-tight text-white">Scheduled articles</h2>
                  <p className="text-xs text-[#64748B]">Upcoming publications</p>
                </div>
              </div>
              <Link
                href="/admin/articles?tab=scheduled"
                className="text-xs font-semibold text-[#6366F1] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Scheduled articles">
                <thead>
                  <tr className="border-b border-[#1C2436] text-[#64748B] text-[11px]">
                    <th scope="col" className="pb-2.5 font-medium">Title</th>
                    <th scope="col" className="pb-2.5 font-medium whitespace-nowrap">Publish date</th>
                    <th scope="col" className="pb-2.5 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182030]">
                  {scheduled.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-[#64748B]">
                        No scheduled articles. Schedule one from the article editor.
                      </td>
                    </tr>
                  )}
                  {scheduled.map((a) => (
                    <tr key={a.id} className="hover:bg-[#141B2A] transition-colors">
                      <td className="py-3 pr-2 font-semibold text-white truncate max-w-[140px]">
                        {a.title}
                      </td>
                      <td className="py-3 text-[#94A3B8] whitespace-nowrap">{a.date}</td>
                      <td className="py-3 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0F243A] text-[#38BDF8] border border-[#1B3E60]">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tool Health Card (Image 1) */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <div>
                <h2 className="text-sm font-bold text-white">Tool health</h2>
                <p className="text-xs text-[#64748B]">Status of internal tools</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Interactive Map */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0E131D] border border-[#182030]">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#94A3B8]" />
                  <div>
                    <p className="font-semibold text-white">Interactive Map</p>
                    <p className="text-[11px] text-[#64748B]">Map data and markers</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" aria-hidden="true" />
                  <span className="text-[11px] font-medium text-[#10B981]">Operational</span>
                </div>
              </div>

              {/* Comparisons */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0E131D] border border-[#182030]">
                <div className="flex items-center gap-3">
                  <Scale className="w-4 h-4 text-[#94A3B8]" />
                  <div>
                    <p className="font-semibold text-white">Comparisons</p>
                    <p className="text-[11px] text-[#64748B]">Feature comparisons</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" aria-hidden="true" />
                  <span className="text-[11px] font-medium text-[#10B981]">Operational</span>
                </div>
              </div>

              {/* Completion Tracker */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0E131D] border border-[#182030]">
                <div className="flex items-center gap-3">
                  <ListChecks className="w-4 h-4 text-[#94A3B8]" />
                  <div>
                    <p className="font-semibold text-white">Completion Tracker</p>
                    <p className="text-[11px] text-[#64748B]">Progress tracking system</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" aria-hidden="true" />
                  <span className="text-[11px] font-medium text-[#10B981]">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
