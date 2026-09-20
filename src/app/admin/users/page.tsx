"use client";

import React, { useState } from "react";
import {
  Shield,
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  User,
  Check,
  X,
  Lock,
  Sparkles
} from "lucide-react";
import { Drawer } from "@/components/admin/drawer";
import { useToast } from "@/components/admin/toast";
import {
  INITIAL_ADMIN_USERS,
  AdminUser,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Editor" as AdminUser["role"],
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInviteUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    const created: AdminUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "pending",
      lastActivity: "Never",
      avatar: newUser.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    };
    setUsers([created, ...users]);
    setIsInviteOpen(false);
    setNewUser({ name: "", email: "", role: "Editor" });
    showToast({
      title: "Invitation Sent",
      description: `Invitation email dispatched to ${created.email}.`,
      type: "success",
    });
  };

  const permissionsMatrix = [
    { name: "View published content & public atlas", admin: true, publisher: true, editor: true },
    { name: "Create & edit drafts in articles", admin: true, publisher: true, editor: true },
    { name: "Publish articles & guides directly", admin: true, publisher: true, editor: false },
    { name: "Manage vehicles & weapons database records", admin: true, publisher: false, editor: true },
    { name: "Calibrate interactive map markers", admin: true, publisher: false, editor: true },
    { name: "Configure site settings & SEO parameters", admin: true, publisher: false, editor: false },
    { name: "Manage team accounts & user roles", admin: true, publisher: false, editor: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Users & Role Permissions</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Control editorial staff permissions, invite new contributors, and manage role-based access control.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--admin-primary)] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md shadow-[var(--admin-primary)]/25"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--admin-border)] flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team by name or email..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>
          <span className="text-xs text-[var(--admin-text-muted)]">
            <strong>{filteredUsers.length}</strong> active team accounts
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)]">
              <th className="p-3.5 font-bold uppercase">Team Member</th>
              <th className="p-3.5 font-bold uppercase">Assigned Role</th>
              <th className="p-3.5 font-bold uppercase">Account Status</th>
              <th className="p-3.5 font-bold uppercase">Last Active</th>
              <th className="p-3.5 font-bold uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border-subtle)]">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-[var(--admin-elevated)]/40 transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                      {u.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--admin-text)]">{u.name}</p>
                      <p className="text-[11px] text-[var(--admin-text-muted)]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3.5">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                      u.role === "Administrator" &&
                        "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
                      u.role === "Editor" &&
                        "bg-purple-500/10 text-purple-400 border-purple-500/30",
                      u.role === "Publisher" &&
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    )}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[11px] font-semibold",
                      u.status === "active" ? "text-emerald-400" : "text-amber-400"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        u.status === "active" ? "bg-emerald-400" : "bg-amber-400"
                      )}
                    />
                    <span className="capitalize">{u.status}</span>
                  </span>
                </td>
                <td className="p-3.5 text-[var(--admin-text-muted)] font-mono text-[11px]">
                  {u.lastActivity}
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => {
                      showToast({
                        title: "Role Editor",
                        description: `Editing permissions for ${u.name}.`,
                        type: "info",
                      });
                    }}
                    className="text-xs font-bold text-[var(--admin-primary)] hover:underline"
                  >
                    Edit Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permissions Comparison Matrix (Image 12) */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Role Permissions Comparison Matrix
          </h2>
          <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">
            Overview of capabilities granted to each access tier in the Atlas content management system.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--admin-border)] overflow-hidden bg-[var(--admin-surface)]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-elevated)] text-[var(--admin-text-muted)]">
                <th className="p-3.5 font-bold uppercase">System Capability</th>
                <th className="p-3.5 font-bold uppercase text-center w-36">Administrator</th>
                <th className="p-3.5 font-bold uppercase text-center w-36">Publisher</th>
                <th className="p-3.5 font-bold uppercase text-center w-36">Editor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border-subtle)]">
              {permissionsMatrix.map((perm, idx) => (
                <tr key={idx} className="hover:bg-[var(--admin-elevated)]/40 transition-colors">
                  <td className="p-3.5 font-medium text-[var(--admin-text)]">{perm.name}</td>
                  <td className="p-3.5 text-center">
                    {perm.admin ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[var(--admin-text-muted)] opacity-40 mx-auto" />
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {perm.publisher ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[var(--admin-text-muted)] opacity-40 mx-auto" />
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {perm.editor ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[var(--admin-text-muted)] opacity-40 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Slide-over Drawer (Image 12) */}
      <Drawer
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite New Contributor"
        subtitle="Send an invitation link to onboard a new writer, researcher, or administrator."
        size="md"
        footer={
          <>
            <button
              onClick={() => setIsInviteOpen(false)}
              className="px-4 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] text-xs font-bold text-[var(--admin-text)]"
            >
              Cancel
            </button>
            <button
              onClick={handleInviteUser}
              className="px-5 py-2 rounded-xl bg-[var(--admin-primary)] text-xs font-bold text-white shadow-md shadow-[var(--admin-primary)]/20 hover:opacity-90"
            >
              Send Invitation
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[var(--admin-text)] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="e.g. Jordan Hayes"
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label className="block font-bold text-[var(--admin-text)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="jordan@atlas-gta6.com"
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label className="block font-bold text-[var(--admin-text)] mb-1">
              Assigned Role
            </label>
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value as AdminUser["role"] })
              }
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            >
              <option value="Editor">Editor (Draft & research records)</option>
              <option value="Publisher">Publisher (Publish articles & guides)</option>
              <option value="Administrator">Administrator (Full root access)</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-1">
            <span className="font-bold text-[var(--admin-text)]">Onboarding Notice:</span>
            <p className="text-[11px] text-[var(--admin-text-muted)] leading-relaxed">
              The invited user will receive a secure magic link valid for 48 hours to create their password and configure two-factor authentication.
            </p>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
