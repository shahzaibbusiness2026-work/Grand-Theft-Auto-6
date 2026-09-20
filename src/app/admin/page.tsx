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

export default function AdminOverviewPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header (Image 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A2015] border border-[#4A3818] text-[#E5A83B]">
              Demo data
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Your publishing workspace
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
            <p className="text-2xl font-bold text-white tracking-tight mt-0.5">128</p>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">Articles, guides and more</p>
          </div>
        </div>

        {/* Card 2: Awaiting review */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#382618] text-[#F59E0B] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#94A3B8] font-medium">Awaiting review</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-0.5">9</p>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">Drafts ready for approval</p>
          </div>
        </div>

        {/* Card 3: Database records */}
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#162544] text-[#38BDF8] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#94A3B8] font-medium">Database records</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-0.5">246</p>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">Vehicles, weapons, locations...</p>
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
                <h2 className="text-sm font-bold text-white">Needs attention</h2>
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
                  {/* Row 1: Verify vehicle sources */}
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
                      12 records
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

                  {/* Row 2: Articles awaiting approval */}
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
                      9 drafts
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

                  {/* Row 3: Missing image credits */}
                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-4 h-4 text-[#94A3B8] shrink-0" />
                        <div>
                          <p className="font-semibold text-white">Missing image credits</p>
                          <p className="text-[11px] text-[#64748B]">Add source attributions for media files</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-[#94A3B8] whitespace-nowrap">
                      4 assets
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <Link
                        href="/admin/media"
                        className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-colors"
                      >
                        Fix credits
                      </Link>
                    </td>
                  </tr>

                  {/* Row 4: Map markers to verify */}
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
                      7 markers
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
                  <h2 className="text-sm font-bold text-white">Recent edits</h2>
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
                  {/* Row 1 */}
                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-white">
                      Bravado Banshee (Unconfirmed)
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#182030] text-[#94A3B8] border border-[#243048]">
                        Vehicle
                      </span>
                    </td>
                    <td className="py-3 text-[#94A3B8]">Alex Carter</td>
                    <td className="py-3 text-[#64748B] whitespace-nowrap">2 hours ago</td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/vehicles?edit=veh-1"
                        className="inline-flex p-1.5 rounded-lg bg-[#182030] text-[#94A3B8] hover:text-white border border-[#243048] transition-colors"
                        aria-label="Edit Bravado Banshee"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-white">
                      Vice City Beach
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#182030] text-[#94A3B8] border border-[#243048]">
                        Location
                      </span>
                    </td>
                    <td className="py-3 text-[#94A3B8]">Taylor Kim</td>
                    <td className="py-3 text-[#64748B] whitespace-nowrap">4 hours ago</td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/locations"
                        className="inline-flex p-1.5 rounded-lg bg-[#182030] text-[#94A3B8] hover:text-white border border-[#243048] transition-colors"
                        aria-label="Edit Vice City Beach"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-white">
                      GTA 6: Everything We Know
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#182030] text-[#94A3B8] border border-[#243048]">
                        Article
                      </span>
                    </td>
                    <td className="py-3 text-[#94A3B8]">Morgan Lee</td>
                    <td className="py-3 text-[#64748B] whitespace-nowrap">6 hours ago</td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/articles?edit=art-1"
                        className="inline-flex p-1.5 rounded-lg bg-[#182030] text-[#94A3B8] hover:text-white border border-[#243048] transition-colors"
                        aria-label="Edit article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-white">
                      Assault Rifle (Unverified)
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#182030] text-[#94A3B8] border border-[#243048]">
                        Weapon
                      </span>
                    </td>
                    <td className="py-3 text-[#94A3B8]">Jordan Patel</td>
                    <td className="py-3 text-[#64748B] whitespace-nowrap">1 day ago</td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/weapons"
                        className="inline-flex p-1.5 rounded-lg bg-[#182030] text-[#94A3B8] hover:text-white border border-[#243048] transition-colors"
                        aria-label="Edit weapon"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions (Image 1) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#818CF8]" />
              <div>
                <h2 className="text-sm font-bold text-white">Quick actions</h2>
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
                  <h2 className="text-sm font-bold text-white">Scheduled articles</h2>
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
                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3 pr-2 font-semibold text-white truncate max-w-[140px]">
                      Exploring Vice City&apos;s Districts
                    </td>
                    <td className="py-3 text-[#94A3B8] whitespace-nowrap">Mar 15, 2025</td>
                    <td className="py-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0F243A] text-[#38BDF8] border border-[#1B3E60]">
                        Scheduled
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3 pr-2 font-semibold text-white truncate max-w-[140px]">
                      All Confirmed Vehicles (So Far)
                    </td>
                    <td className="py-3 text-[#94A3B8] whitespace-nowrap">Mar 18, 2025</td>
                    <td className="py-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0F243A] text-[#38BDF8] border border-[#1B3E60]">
                        Scheduled
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3 pr-2 font-semibold text-white truncate max-w-[140px]">
                      Weapon Customization Guide
                    </td>
                    <td className="py-3 text-[#94A3B8] whitespace-nowrap">Mar 22, 2025</td>
                    <td className="py-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#182030] text-[#94A3B8] border border-[#243048]">
                        Draft
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#141B2A] transition-colors">
                    <td className="py-3 pr-2 font-semibold text-white truncate max-w-[140px]">
                      Map Locations Breakdown
                    </td>
                    <td className="py-3 text-[#94A3B8] whitespace-nowrap">Mar 25, 2025</td>
                    <td className="py-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0F243A] text-[#38BDF8] border border-[#1B3E60]">
                        Scheduled
                      </span>
                    </td>
                  </tr>
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
