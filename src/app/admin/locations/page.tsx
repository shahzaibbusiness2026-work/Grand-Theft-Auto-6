"use client";

import React, { useState } from "react";
import { MapPin, Plus, Search, CheckCircle2, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";

interface LocationRecord {
  id: string;
  name: string;
  district: string;
  type: "City District" | "Island / Keys" | "Government Facility" | "Landmark";
  verification: "verified" | "pending";
  coordinates: string;
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<LocationRecord[]>([
    { id: "loc-1", name: "Vice City Beach", district: "Vice City Metro", type: "City District", verification: "verified", coordinates: "25.7617, -80.1918" },
    { id: "loc-2", name: "Leonida Penitentiary", district: "Leonard County", type: "Government Facility", verification: "verified", coordinates: "25.9011, -80.3542" },
    { id: "loc-3", name: "Grassrivers Wetlands", district: "Everglades Equivalent", type: "Landmark", verification: "pending", coordinates: "25.6120, -80.6010" },
    { id: "loc-4", name: "Kelly County Archipelago", district: "The Keys", type: "Island / Keys", verification: "verified", coordinates: "24.5551, -81.7800" },
  ]);

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
        <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[var(--admin-elevated)] border border-[var(--admin-border)]">
          {l.type}
        </span>
      ),
    },
    {
      key: "verification",
      header: "Status",
      render: (l) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            l.verification === "verified"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          }`}
        >
          {l.verification}
        </span>
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
