"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, CheckCircle2, ShieldAlert, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/admin/ui/badge";
import { getAdminCharacters, deleteCharacter, saveCharacter } from "@/lib/services/characters";
import { useToast } from "@/components/admin/toast";

interface CharacterRecord {
  id: string;
  name: string;
  role: "Lead Protagonist" | "Key Antagonist" | "Supporting Contact" | string;
  actor: string;
  status: "Confirmed" | "Rumoured" | string;
  territory: string;
}

export default function AdminCharactersPage() {
  const { showToast } = useToast();
  const [characters, setCharacters] = useState<CharacterRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New character form state
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Supporting Contact");
  const [newActor, setNewActor] = useState("");
  const [newStatus, setNewStatus] = useState("Confirmed");
  const [newTerritory, setNewTerritory] = useState("");

  const loadCharacters = () => {
    setIsLoading(true);
    getAdminCharacters()
      .then((data) => {
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
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const handleDelete = async (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    await deleteCharacter(id);
    showToast({ title: "Character Deleted", description: "Removed from Supabase.", type: "success" });
  };

  const handleAddCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const id = `char-${newName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;
    const roleForDb = newRole === "Lead Protagonist" ? "Protagonist" : newRole === "Key Antagonist" ? "Antagonist" : "Supporting";
    
    await saveCharacter({
      id,
      name: newName.trim(),
      role: roleForDb,
      voiceActor: newActor.trim() || undefined,
      status: newStatus === "Confirmed" ? "Active" : "Under Surveillance",
      origin: newTerritory.trim() || undefined,
      desc: `${newName} in Grand Theft Auto VI.`,
      featured: newRole === "Lead Protagonist",
    });

    setCharacters((prev) => [
      {
        id,
        name: newName.trim(),
        role: newRole,
        actor: newActor.trim() || "Unconfirmed",
        status: newStatus,
        territory: newTerritory.trim() || "Vice City",
      },
      ...prev,
    ]);

    setIsAddModalOpen(false);
    setNewName("");
    setNewActor("");
    setNewTerritory("");

    showToast({
      title: "Character Added",
      description: `"${newName}" saved to Supabase characters table.`,
      type: "success",
    });
  };

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
    {
      key: "actions",
      header: "Actions",
      render: (c) => (
        <button
          onClick={() => handleDelete(c.id)}
          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          title="Delete character"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
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
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Character
        </button>
      </div>

      <DataTable data={characters} columns={columns} selectable />

      {/* Add Character Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0E131D] border border-[#1C2436] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2436] mb-4">
              <h2 className="text-base font-bold text-white">Add New Character</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#64748B] hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddCharacter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Character Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Lucia Caminos"
                  className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-white text-xs focus:outline-none focus:border-[#6366F1]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Story Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-white text-xs focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="Lead Protagonist">Lead Protagonist</option>
                    <option value="Key Antagonist">Key Antagonist</option>
                    <option value="Supporting Contact">Supporting Contact</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-white text-xs focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rumoured">Rumoured</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Actor / Voice Talent</label>
                <input
                  type="text"
                  value={newActor}
                  onChange={(e) => setNewActor(e.target.value)}
                  placeholder="e.g. Manni L. Perez"
                  className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-white text-xs focus:outline-none focus:border-[#6366F1]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Primary Territory / Region</label>
                <input
                  type="text"
                  value={newTerritory}
                  onChange={(e) => setNewTerritory(e.target.value)}
                  placeholder="e.g. Vice City Beach"
                  className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-white text-xs focus:outline-none focus:border-[#6366F1]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#1C2436]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-bold"
                >
                  Save to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
