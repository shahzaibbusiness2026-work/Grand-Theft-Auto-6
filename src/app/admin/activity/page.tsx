"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  FileText,
  Car,
  Crosshair,
  MapPin,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";
import { getActivityLog, type ActivityEntry } from "@/lib/services/activity";

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    let cancelled = false;
    getActivityLog(100)
      .then((data) => {
        if (!cancelled) {
          setActivities(data);
          if (data.length > 0) setSelectedActivityId(data[0].id);
        }
      })
      .catch(() => { if (!cancelled) setActivities([]); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const selectedActivity = useMemo(() => {
    return activities.find((a) => a.id === selectedActivityId) || activities[0] || null;
  }, [activities, selectedActivityId]);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (selectedAction !== "all" && act.action !== selectedAction) return false;
      if (selectedType !== "all" && act.target_type !== selectedType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const hay = `${act.actor} ${act.target_label || ""} ${act.action} ${act.target_type}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [activities, selectedAction, selectedType, searchQuery]);

  const hasActiveFilters = selectedAction !== "all" || selectedType !== "all" || searchQuery !== "";

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "vehicle": return <Car className="w-3.5 h-3.5 text-purple-400" />;
      case "weapon": return <Crosshair className="w-3.5 h-3.5 text-pink-400" />;
      case "map_marker": case "location": return <MapPin className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <FileText className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const resetFilters = () => { setSearchQuery(""); setSelectedAction("all"); setSelectedType("all"); };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  };

  const recordLink = (act: ActivityEntry) => {
    switch (act.target_type) {
      case "vehicle": return act.target_id ? `/admin/vehicles/${act.target_id}` : "/admin/vehicles";
      case "weapon": return act.target_id ? `/admin/weapons/${act.target_id}` : "/admin/weapons";
      case "map_marker": case "location": return "/admin/map";
      case "article": return act.target_id ? `/admin/articles/${act.target_id}` : "/admin/articles";
      default: return "/admin";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Activity log</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Live data</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">Real editorial actions from the activity log — creates, updates, and deletes.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter activity by actor or record..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors" />
        </div>
        <div>
          <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors">
            <option value="all">All Actions</option>
            <option value="create">Created</option>
            <option value="update">Updated</option>
            <option value="delete">Deleted</option>
            <option value="submit">Submitted</option>
          </select>
        </div>
        <div>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors">
            <option value="all">All Record Types</option>
            <option value="article">Articles</option>
            <option value="vehicle">Vehicles</option>
            <option value="weapon">Weapons</option>
            <option value="location">Locations</option>
            <option value="category">Categories</option>
          </select>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-gold/10 border border-gold/20 text-amber-300 text-xs font-medium">
          <div className="flex items-center gap-2"><Filter className="w-3.5 h-3.5" /><span>Showing {filteredActivities.length} of {activities.length} activity events</span></div>
          <Button variant="ghost" size="sm" onClick={resetFilters} leftIcon={<RotateCcw className="w-3 h-3" />} className="text-amber-300 hover:text-amber-200 hover:bg-gold/20 h-7 px-2 text-xs">Reset Filters</Button>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Activity audit log">
              <thead><tr className="border-b border-[#1C2436] bg-[#0E131D] text-[#64748B] text-xs"><th scope="col" className="p-3.5 font-medium">Timestamp</th><th scope="col" className="p-3.5 font-medium">Actor</th><th scope="col" className="p-3.5 font-medium">Action</th><th scope="col" className="p-3.5 font-medium">Record</th><th scope="col" className="p-3.5 font-medium">Type</th></tr></thead>
              <tbody className="divide-y divide-[#182030]">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-[#64748B]">Loading activity...</td></tr>
                ) : filteredActivities.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-[#64748B]">{activities.length === 0 ? "No activity yet. Actions will appear here as you create, update, or delete records." : "No activity events match your current filters."}</td></tr>
                ) : filteredActivities.map((act) => {
                  const isSelected = selectedActivity?.id === act.id;
                  return (
                    <tr key={act.id} onClick={() => setSelectedActivityId(act.id)} className={cn("cursor-pointer transition-colors", isSelected ? "bg-[#6366F1]/10" : "hover:bg-[#141B2A]")}>
                      <td className="p-3.5 font-mono text-xs text-[#64748B] whitespace-nowrap">{formatTime(act.created_at)}</td>
                      <td className="p-3.5 whitespace-nowrap"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs">{(act.actor || "A").slice(0, 1).toUpperCase()}</div><span className="font-semibold text-white">{act.actor}</span></div></td>
                      <td className="p-3.5 whitespace-nowrap"><span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#182030] text-[#94A3B8] border border-[#243048] capitalize">{act.action}</span></td>
                      <td className="p-3.5 whitespace-nowrap"><div className="flex items-center gap-1.5 font-bold text-white">{getRecordIcon(act.target_type)}<span className="truncate max-w-[140px]">{act.target_label || act.target_id || "—"}</span></div></td>
                      <td className="p-3.5 text-[#94A3B8] truncate max-w-[200px] capitalize">{act.target_type}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-4 rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4 shadow-sm">
          {selectedActivity ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1C2436]">
                <h3 className="font-bold uppercase tracking-wider text-white">Activity Details</h3>
                <span className="font-mono text-xs text-[#64748B]">#{selectedActivity.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="space-y-2 p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] font-mono text-xs">
                <div className="flex justify-between"><span className="text-[#64748B] font-sans">Actor:</span><span className="text-white font-bold">{selectedActivity.actor}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B] font-sans">Action:</span><span className="text-indigo-400 capitalize">{selectedActivity.action}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B] font-sans">Timestamp:</span><span className="text-[#94A3B8]">{formatTime(selectedActivity.created_at)}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B] font-sans">Record:</span><span className="text-[#94A3B8]">{selectedActivity.target_label || "—"}</span></div>
              </div>
              {selectedActivity.detail && Object.keys(selectedActivity.detail).length > 0 && (
                <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] space-y-1">
                  <p className="text-xs font-semibold text-[#94A3B8]">Details</p>
                  <pre className="text-xs text-[#94A3B8] whitespace-pre-wrap break-words">{JSON.stringify(selectedActivity.detail, null, 2)}</pre>
                </div>
              )}
              <div className="pt-2">
                <Link href={recordLink(selectedActivity)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs font-semibold text-[#6366F1] hover:text-white hover:border-[#6366F1] transition-colors">
                  <span>View record</span><ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#64748B]">{isLoading ? "Loading..." : "No activity yet. Select an event to inspect details."}</div>
          )}
        </div>
      </div>
    </div>
  );
}
