"use client";

import React, { useState, useMemo } from "react";
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
  ShieldCheck
} from "lucide-react";
import {
  INITIAL_ADMIN_ACTIVITIES,
  AdminActivity,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<AdminActivity[]>(INITIAL_ADMIN_ACTIVITIES);
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Activity Log & Audit Trail</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Comprehensive historical log of all editorial actions, record updates, status changes, and coordinate calibrations.
          </p>
        </div>
      </div>

      {/* Filters Bar (Image 16) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter activity by actor or record..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
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
            className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
          >
            <option value="all">All Record Types</option>
            <option value="Article">Articles</option>
            <option value="Vehicle">Vehicles</option>
            <option value="Weapon">Weapons</option>
            <option value="Map marker">Map Markers</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Activity Table & Right Diff Inspector (Image 16) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Table (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)]">
                  <th className="p-3.5 font-bold uppercase">Timestamp</th>
                  <th className="p-3.5 font-bold uppercase">Actor</th>
                  <th className="p-3.5 font-bold uppercase">Action</th>
                  <th className="p-3.5 font-bold uppercase">Record</th>
                  <th className="p-3.5 font-bold uppercase">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border-subtle)]">
                {filteredActivities.map((act) => {
                  const isSelected = selectedActivity?.id === act.id;
                  return (
                    <tr
                      key={act.id}
                      onClick={() => setSelectedActivityId(act.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected
                          ? "bg-[var(--admin-primary)]/10"
                          : "hover:bg-[var(--admin-elevated)]/50"
                      )}
                    >
                      <td className="p-3.5 font-mono text-[11px] text-[var(--admin-text-muted)] whitespace-nowrap">
                        {act.timestamp}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-[9px]">
                            {act.actor.initials}
                          </div>
                          <span className="font-semibold text-[var(--admin-text)]">
                            {act.actor.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[var(--admin-elevated)] border border-[var(--admin-border)] text-[var(--admin-text)]">
                          {act.action}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-[var(--admin-text)]">
                          {getRecordIcon(act.recordType)}
                          <span className="truncate max-w-[140px]">{act.recordName}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-[var(--admin-text-muted)] truncate max-w-[200px]">
                        {act.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Details / Diff Inspector (4 cols) (Image 16) */}
        <div className="lg:col-span-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 space-y-4 shadow-sm text-xs">
          <h3 className="font-bold uppercase tracking-wider text-[var(--admin-text)] pb-2 border-b border-[var(--admin-border)]">
            Audit Record Details
          </h3>

          {selectedActivity ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Event ID:</span>
                  <span className="font-mono font-bold text-[var(--admin-text)]">
                    {selectedActivity.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Timestamp:</span>
                  <span className="font-mono text-[var(--admin-text)]">
                    {selectedActivity.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Actor:</span>
                  <span className="font-bold text-[var(--admin-text)]">
                    {selectedActivity.actor.name} ({selectedActivity.actor.role})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--admin-text-muted)]">Record:</span>
                  <span className="font-bold text-[var(--admin-primary)]">
                    {selectedActivity.recordName} ({selectedActivity.recordType})
                  </span>
                </div>
              </div>

              {/* Changes Diff Box (Image 16) */}
              {selectedActivity.changes ? (
                <div className="space-y-2">
                  <span className="font-bold text-[var(--admin-text)]">
                    Modified Field Diff: <code>{selectedActivity.changes.field}</code>
                  </span>
                  <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-2 font-mono text-xs">
                    <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      - Previous: {selectedActivity.changes.from}
                    </div>
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      + Updated: {selectedActivity.changes.to}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-[var(--admin-text-muted)]">
                  {selectedActivity.details}
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-1 font-mono text-[11px] text-[var(--admin-text-muted)]">
                <p>Client IP: 192.168.1.104</p>
                <p>Origin: Atlas Web Admin Session</p>
                <p>Integrity Hash: sha256-d41d8cd98f00b204</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--admin-text-muted)]">
              Select an activity event from the table to view the audit diff.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
