"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Search, CheckCircle2, Clock, AlertTriangle, ExternalLink, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/admin/ui/badge";
import { getLocations, saveLocation, deleteLocation } from "@/lib/services/locations";
import type { LocationRecord } from "@/lib/services/locations";
import { useToast } from "@/components/admin/toast";

export default function AdminLocationsPage() {
  const { showToast } = useToast();
  const [locations, setLocations] = useState<LocationRecord[]>([]);

  useEffect(() => {
    getLocations().then(setLocations);
  }, []);

  const handleDelete = async (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    await deleteLocation(id);
    showToast({ title: "Location Deleted", description: "Removed from Supabase.", type: "success" });
  };

  const columns: Column<LocationRecord>[] = [
    {
      key: "name",
      header: "Location Name",
      sortable: true,
      render: (l) => (
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-[var(--admin-text)]">{l.name}</span>
        </div>
      ),
    },
    { key: "district", header: "District / County", sortable: true },
    {
      key: "type",
      header: "Type",
      render: (l) => (
        <Badge variant="neutral" size="sm">
          {l.type}
        </Badge>
      ),
    },
    {
      key: "verification",
      header: "Status",
      render: (l) => (
        <Badge variant={l.verification === "verified" ? "success" : "warning"} size="sm" dot>
          {l.verification}
        </Badge>
      ),
    },
    {
      key: "coordinates",
      header: "Coordinates",
      render: (l) => <span className="font-mono text-[11px] text-[var(--admin-text-muted)]">{l.coordinates}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Locations & Districts</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Database of confirmed municipalities, landmarks, and territory coordinates in Leonida.
          </p>
        </div>
      </div>

      <DataTable data={locations} columns={columns} selectable />
    </div>
  );
}
