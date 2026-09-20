"use client";

import React, { useState } from "react";
import {
  Shield,
  UserPlus,
  Search,
  CheckCircle2,
  Mail,
  User,
  Check,
  X,
  Lock,
  Edit,
  RotateCcw,
} from "lucide-react";
import { Drawer } from "@/components/admin/drawer";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
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
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [emailError, setEmailError] = useState("");

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
    if (!newUser.name.trim()) {
      setEmailError("Please provide the full name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setEmailError("Please enter a valid email address (e.g. name@domain.com).");
      return;
    }
    setEmailError("");

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

  const handleSaveRole = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    showToast({
      title: "User Role Updated",
      description: `Updated role for ${editingUser.name} to ${editingUser.role}.`,
      type: "success",
    });
    setEditingUser(null);
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

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEmailError("");
            setIsInviteOpen(true);
          }}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Invite User
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--admin-border)] flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              id="user-search"
              aria-label="Search team by name or email"
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)]">
                <th scope="col" className="p-3.5 font-bold uppercase">Team Member</th>
                <th scope="col" className="p-3.5 font-bold uppercase">Assigned Role</th>
                <th scope="col" className="p-3.5 font-bold uppercase">Account Status</th>
                <th scope="col" className="p-3.5 font-bold uppercase">Last Active</th>
                <th scope="col" className="p-3.5 font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border-subtle)]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--admin-text-muted)]">
                    No team members found matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--admin-elevated)]/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                          {u.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--admin-text)]">{u.name}</p>
                          <p className="text-[11px] text-[var(--admin-text-muted)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          u.role === "Administrator"
                            ? "primary"
                            : u.role === "Publisher"
                            ? "success"
                            : "neutral"
                        }
                        size="sm"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={u.status === "active" ? "success" : "warning"}
                        size="sm"
                        dot
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-[var(--admin-text-muted)] font-mono text-[11px]">
                      {u.lastActivity}
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUser(u)}
                        leftIcon={<Edit className="w-3.5 h-3.5" />}
                      >
                        Edit Role
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Comparison Matrix */}
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
                <th scope="col" className="p-3.5 font-bold uppercase">System Capability</th>
                <th scope="col" className="p-3.5 font-bold uppercase text-center w-36">Administrator</th>
                <th scope="col" className="p-3.5 font-bold uppercase text-center w-36">Publisher</th>
                <th scope="col" className="p-3.5 font-bold uppercase text-center w-36">Editor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border-subtle)]">
              {permissionsMatrix.map((perm, idx) => (
                <tr key={idx} className="hover:bg-[var(--admin-elevated)]/40 transition-colors">
                  <td className="p-3.5 font-medium text-[var(--admin-text)]">{perm.name}</td>
                  <td className="p-3.5 text-center">
                    {perm.admin ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" aria-label="Permitted" />
                    ) : (
                      <X className="w-4 h-4 text-[var(--admin-text-muted)] opacity-40 mx-auto" aria-label="Not permitted" />
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {perm.publisher ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" aria-label="Permitted" />
                    ) : (
                      <X className="w-4 h-4 text-[var(--admin-text-muted)] opacity-40 mx-auto" aria-label="Not permitted" />
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {perm.editor ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" aria-label="Permitted" />
                    ) : (
                      <X className="w-4 h-4 text-[var(--admin-text-muted)] opacity-40 mx-auto" aria-label="Not permitted" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Role Drawer */}
      <Drawer
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={editingUser ? `Edit User: ${editingUser.name}` : "Edit User Role"}
        subtitle={editingUser ? `Email: ${editingUser.email}` : undefined}
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveRole}
            >
              Save Changes
            </Button>
          </>
        }
      >
        {editingUser && (
          <div className="space-y-4 text-xs">
            <div>
              <label
                htmlFor="edit-user-name"
                className="block font-bold text-[var(--admin-text)] mb-1"
              >
                Full Name
              </label>
              <input
                id="edit-user-name"
                type="text"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="edit-user-role"
                className="block font-bold text-[var(--admin-text)] mb-1"
              >
                Assigned Role
              </label>
              <select
                id="edit-user-role"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    role: e.target.value as AdminUser["role"],
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
              >
                <option value="Editor">Editor (Draft & research records)</option>
                <option value="Publisher">Publisher (Publish articles & guides)</option>
                <option value="Administrator">Administrator (Full root access)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-user-status"
                className="block font-bold text-[var(--admin-text)] mb-1"
              >
                Account Status
              </label>
              <select
                id="edit-user-status"
                value={editingUser.status}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    status: e.target.value as AdminUser["status"],
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
              >
                <option value="active">Active</option>
                <option value="pending">Pending Invitation</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-1">
              <span className="font-bold text-[var(--admin-text)]">Security Audit:</span>
              <p className="text-[11px] text-[var(--admin-text-muted)] leading-relaxed">
                Role modifications take effect immediately across all active browser sessions.
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Invite User Slide-over Drawer */}
      <Drawer
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite New Contributor"
        subtitle="Send an invitation link to onboard a new writer, researcher, or administrator."
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleInviteUser}
            >
              Send Invitation
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {emailError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 font-medium"
            >
              {emailError}
            </div>
          )}

          <div>
            <label
              htmlFor="invite-user-name"
              className="block font-bold text-[var(--admin-text)] mb-1"
            >
              Full Name
            </label>
            <input
              id="invite-user-name"
              type="text"
              value={newUser.name}
              onChange={(e) => {
                setNewUser({ ...newUser, name: e.target.value });
                if (emailError) setEmailError("");
              }}
              placeholder="e.g. Jordan Hayes"
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label
              htmlFor="invite-user-email"
              className="block font-bold text-[var(--admin-text)] mb-1"
            >
              Email Address
            </label>
            <input
              id="invite-user-email"
              type="email"
              value={newUser.email}
              onChange={(e) => {
                setNewUser({ ...newUser, email: e.target.value });
                if (emailError) setEmailError("");
              }}
              placeholder="jordan@atlas-gta6.com"
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label
              htmlFor="invite-user-role"
              className="block font-bold text-[var(--admin-text)] mb-1"
            >
              Assigned Role
            </label>
            <select
              id="invite-user-role"
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
