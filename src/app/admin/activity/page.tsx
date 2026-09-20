"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  Search,
  Filter,
  User,
  Clock,
  ArrowRight,
  FileText,
  Car,
  Crosshair,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  X
} from "lucide-react";
import {
  INITIAL_ADMIN_ACTIVITIES,
  AdminActivity,
} from "@/lib/admin-store";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminActivityPage() {
  const [activities] = useState<AdminActivity[]>(INITIAL_ADMIN_ACTIVITIES);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    INITIAL_ADMIN_ACTIVITIES[0]?.id || "act-1"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const selectedActivity = useMemo(() => {
    return (
      activities.find((a) => a.id === selectedActivityId) || activities[0]
    );
  }, [activities, selectedActivityId]);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (selectedAction !== "all" && act.action !== selectedAction) return false;
      if (selectedType !== "all" && act.recordType !== selectedType) return false;
      if (
        searchQuery &&
        !act.recordName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !act.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !act.details.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [activities, selectedAction, selectedType, searchQuery]);

  const hasActiveFilters = selectedAction !== "all" || selectedType !== "all" || searchQuery !== "";

  const getRecordIcon = (type: AdminActivity["recordType"]) => {
    switch (type) {
      case "Vehicle":
        return <Car className="w-3.5 h-3.5 text-purple-400" />;
      case "Weapon":
        return <Crosshair className="w-3.5 h-3.5 text-pink-400" />;
      case "Map marker":
        return <MapPin className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedAction("all");
    setSelectedType("all");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Page Header (Image 16) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Activity log
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A2015] border border-[#4A3818] text-[#E5A83B]">
              Demo data
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Comprehensive historical log of all editorial actions, record updates, status changes, and coordinate calibrations.
          </p>
        </div>
      </div>

      {/* Filters Bar (Image 16) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter activity by actor or record..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="all">All Actions</option>
            <option value="saved draft">Saved draft</option>
            <option value="edited">Edited</option>
            <option value="scheduled">Scheduled</option>
            <option value="moved">Moved coordinates</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="all">All Record Types</option>
            <option value="Article">Articles</option>
            <option value="Vehicle">Vehicles</option>
            <option value="Weapon">Weapons</option>
            <option value="Map marker">Map Markers</option>
          </select>
        </div>
      </div>

      {/* Active Filters Reset */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            <span>
              Showing {filteredActivities.length} of {activities.length} activity events
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            leftIcon={<RotateCcw className="w-3 h-3" />}
            className="text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 h-7 px-2 text-[11px]"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Main Grid: Activity Table & Right Diff Inspector (Image 16) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Table (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Activity audit log">
              <thead>
                <tr className="border-b border-[#1C2436] bg-[#0E131D] text-[#64748B] text-[11px]">
                  <th scope="col" className="p-3.5 font-medium">Timestamp</th>
                  <th scope="col" className="p-3.5 font-medium">Actor</th>
                  <th scope="col" className="p-3.5 font-medium">Action</th>
                  <th scope="col" className="p-3.5 font-medium">Record</th>
                  <th scope="col" className="p-3.5 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#64748B]">
                      No activity events match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => {
                    const isSelected = selectedActivity?.id === act.id;
                    return (
                      <tr
                        key={act.id}
                        onClick={() => setSelectedActivityId(act.id)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[#6366F1]/10"
                            : "hover:bg-[#141B2A]"
                        )}
                      >
                        <td className="p-3.5 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                          {act.timestamp}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-[9px]">
                              {act.actor.initials}
                            </div>
                            <span className="font-semibold text-white">
                              {act.actor.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#182030] text-[#94A3B8] border border-[#243048]">
                            {act.action}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            {getRecordIcon(act.recordType)}
                            <span className="truncate max-w-[140px]">{act.recordName}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-[#94A3B8] truncate max-w-[200px]">
                          {act.details}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Diff Inspector (4 cols, Image 16) */}
        <div className="lg:col-span-4 rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4 shadow-sm">
          {selectedActivity ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1C2436]">
                <h3 className="font-bold uppercase tracking-wider text-white">
                  Activity Details
                </h3>
                <span className="font-mono text-[10px] text-[#64748B]">
                  #{selectedActivity.id.toUpperCase()}
                </span>
              </div>

              {/* Event Metadata */}
              <div className="space-y-2 p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-sans">Actor:</span>
                  <span className="text-white font-bold">{selectedActivity.actor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-sans">Role:</span>
                  <span className="text-indigo-400">{selectedActivity.actor.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-sans">Timestamp:</span>
                  <span className="text-[#94A3B8]">{selectedActivity.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-sans">IP Address:</span>
                  <span className="text-[#94A3B8]">192.168.1.142</span>
                </div>
              </div>

              {/* Field Diff Section */}
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Modified Fields</h4>
                <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] space-y-2">
                  <p className="text-[11px] font-semibold text-[#94A3B8]">Field: Status</p>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 line-through">
                      Draft
                    </span>
                    <span className="text-[#64748B]">→</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Published
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] space-y-2">
                  <p className="text-[11px] font-semibold text-[#94A3B8]">Field: Coordinates</p>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 line-through">
                      (45.2, 58.1)
                    </span>
                    <span className="text-[#64748B]">→</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      (48.6, 62.4)
                    </span>
                  </div>
                </div>
              </div>

              {/* Link to Record */}
              <div className="pt-2">
                <Link
                  href={
                    selectedActivity.recordType === "Vehicle"
                      ? "/admin/vehicles/veh-1"
                      : selectedActivity.recordType === "Weapon"
                      ? "/admin/weapons/w-001"
                      : selectedActivity.recordType === "Map marker"
                      ? "/admin/map"
                      : "/admin/articles/art-1"
                  }
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs font-semibold text-[#6366F1] hover:text-white hover:border-[#6366F1] transition-colors"
                >
                  <span>View modified record</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#64748B]">
              Select an event to inspect audit details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
