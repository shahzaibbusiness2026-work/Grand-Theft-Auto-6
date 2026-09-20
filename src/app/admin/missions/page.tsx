"use client";

import React, { useState } from "react";
import { Compass, Plus, Clock, CheckCircle2 } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";

interface MissionRecord {
  id: string;
  name: string;
  protagonist: "Lucia" | "Jason" | "Both";
  act: string;
  status: "Confirmed" | "Rumoured";
  objectives: string;
}

export default function AdminMissionsPage() {
  const [missions, setMissions] = useState<MissionRecord[]>([
    { id: "mis-1", name: "Leonida Corrections Breakout", protagonist: "Lucia", act: "Prologue / Act 1", status: "Confirmed", objectives: "Escape penitentiary grounds with contact assistance." },
    { id: "mis-2", name: "Convenience Store Robbery", protagonist: "Both", act: "Act 1", status: "Confirmed", objectives: "Armed robbery of Vice City convenience store." },
    { id: "mis-3", name: "Port Gellhorn Airfield Infiltration", protagonist: "Jason", act: "Act 2", status: "Rumoured", objectives: "Secure contraband flight plan from hangar." },
  ]);

  const columns: Column<MissionRecord>[] = [
    {
      key: "name",
      header: "Mission Title",
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-[var(--admin-text)]">{m.name}</span>
        </div>
      ),
    },
    { key: "protagonist", header: "Playable Character", sortable: true },
    { key: "act", header: "Story Act" },
    {
      key: "status",
      header: "Status",
      render: (m) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            m.status === "Confirmed"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          }`}
        >
          {m.status}
        </span>
      ),
    },
    { key: "objectives", header: "Core Objectives" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Missions & Story Database</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Track confirmed story missions, heists, and side activities.
          </p>
        </div>
      </div>

      <DataTable data={missions} columns={columns} selectable />
    </div>
  );
}
