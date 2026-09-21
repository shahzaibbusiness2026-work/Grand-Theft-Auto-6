"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, CheckCircle2, ShieldAlert } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/admin/ui/badge";
import { getAdminCharacters } from "@/lib/services/characters";

interface CharacterRecord {
  id: string;
  name: string;
  role: "Lead Protagonist" | "Key Antagonist" | "Supporting Contact" | string;
  actor: string;
  status: "Confirmed" | "Rumoured" | string;
  territory: string;
}

export default function AdminCharactersPage() {
  const [characters, setCharacters] = useState<CharacterRecord[]>([
    { id: "char-1", name: "Lucia Caminos", role: "Lead Protagonist", actor: "Manni L. Perez (Confirmed)", status: "Confirmed", territory: "Vice City Metro / Leonida Penitentiary" },
    { id: "char-2", name: "Jason Duval", role: "Lead Protagonist", actor: "Dylan Rourke (Casting Lead)", status: "Confirmed", territory: "Port Gellhorn / Kelly County" },
    { id: "char-3", name: "Stefanie (Parole Officer)", role: "Supporting Contact", actor: "Official Trailer 1 Voice", status: "Confirmed", territory: "Leonida Corrections Facility" },
    { id: "char-4", name: "Cal Hampton", role: "Supporting Contact", actor: "Vice City Conspiracy Theorist", status: "Rumoured", territory: "Grassrivers Outpost" },
  ]);

  useEffect(() => {
    getAdminCharacters().then((data) => {
      if (data && data.length > 0) {
        setCharacters(
          data.map((c) => ({
            id: c.id,
            name: c.name,
            role: c.role === "Protagonist" ? "Lead Protagonist" : c.role === "Antagonist" ? "Key Antagonist" : "Supporting Contact",
            actor: c.actor,
            status: c.status === "Active" ? "Confirmed" : "Rumoured",
            territory: c.location,
          }))
        );
      }
    });
  }, []);

  const columns: Column<CharacterRecord>[] = [
    {
      key: "name",
      header: "Character Name",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            {c.name[0]}
          </div>
          <span className="font-bold text-[var(--admin-text)]">{c.name}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Story Role",
      sortable: true,
      render: (c) => (
        <Badge
          variant={c.role === "Lead Protagonist" ? "primary" : c.role === "Key Antagonist" ? "danger" : "neutral"}
          size="sm"
        >
          {c.role}
        </Badge>
      ),
    },
    { key: "actor", header: "Actor / Voice Source" },
    {
      key: "status",
      header: "Status",
      render: (c) => (
        <Badge variant={c.status === "Confirmed" ? "success" : "warning"} size="sm" dot>
          {c.status}
        </Badge>
      ),
    },
    { key: "territory", header: "Primary Territory" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Characters & Cast Database</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Maintain confirmed voice actors, motion capture performers, and character dossiers.
          </p>
        </div>
      </div>

      <DataTable data={characters} columns={columns} selectable />
    </div>
  );
}
