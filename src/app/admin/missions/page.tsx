"use client";

import React, { useState, useEffect } from "react";
import { Compass, Plus, Clock, CheckCircle2, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/admin/ui/badge";
import { getMissions, saveMission, deleteMission } from "@/lib/services/missions";
import type { MissionRecord } from "@/lib/services/missions";
import { useToast } from "@/components/admin/toast";

export default function AdminMissionsPage() {
  const { showToast } = useToast();
  const [missions, setMissions] = useState<MissionRecord[]>([]);

  useEffect(() => {
    getMissions().then(setMissions);
  }, []);

  const handleDelete = async (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    await deleteMission(id);
    showToast({ title: "Mission Deleted", description: "Removed from Supabase.", type: "success" });
  };

  const getProtagonistBadge = (p: MissionRecord["protagonist"]) => {
    switch (p) {
      case "Lucia": return "primary" as const;
      case "Jason": return "info" as const;
      case "Both": return "success" as const;
    }
  };

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
    {
      key: "protagonist",
      header: "Playable Character",
      sortable: true,
      render: (m) => (
        <Badge variant={getProtagonistBadge(m.protagonist)} size="sm">
          {m.protagonist}
        </Badge>
      ),
    },
    { key: "act", header: "Story Act" },
    {
      key: "status",
      header: "Status",
      render: (m) => (
        <Badge variant={m.status === "Confirmed" ? "success" : "warning"} size="sm" dot>
          {m.status}
        </Badge>
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
