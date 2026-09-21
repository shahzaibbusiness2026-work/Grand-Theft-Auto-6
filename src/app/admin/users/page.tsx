"use client";

import React, { useState, useEffect } from "react";
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
  Sparkles,
  Info
} from "lucide-react";
import { Drawer } from "@/components/admin/drawer";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import {
  INITIAL_ADMIN_USERS,
  AdminUser,
} from "@/lib/admin-store";
import { getAdminUsers, inviteAdminUser, deleteAdminUser } from "@/lib/services/users";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "admin" | "editor" | "contributor" | "pending">("all");

  // Load from Supabase on mount
  useEffect(() => {
    getAdminUsers().then((data) => {
      if (data && data.length > 0) setUsers(data);
    });
  }, []);

  // Invite Drawer State (Image 12)
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [emailError, setEmailError] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Editor" as AdminUser["role"],
  });

  const filteredUsers = users.filter((u) => {
    if (activeTab === "admin" && u.role !== "Administrator") return false;
    if (activeTab === "editor" && u.role !== "Editor") return false;
    if (activeTab === "contributor" && u.role !== "Publisher") return false;
    if (activeTab === "pending" && u.status !== "pending") return false;

    if (selectedRoleFilter !== "all" && u.role !== selectedRoleFilter) return false;
    if (selectedStatusFilter !== "all" && u.status !== selectedStatusFilter) return false;

    if (
      searchQuery &&
      !u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleInviteUser = async () => {
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

    showToast({
      title: "Inviting User…",
      description: `Sending invitation to ${created.email}…`,
      type: "info",
    });

    const res = await inviteAdminUser(newUser);
    if (res.success) {
      showToast({
        title: "Invitation Sent",
        description: `Invitation email dispatched to ${created.email}.`,
        type: "success",
      });
    } else {
      showToast({
        title: "Invited Locally",
        description: res.error || "User added to list. Configure Supabase SMTP for email dispatch.",
        type: "warning",
      });
    }

    setNewUser({ name: "", email: "", role: "Editor" });
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
    { name: "View published content & public atlas", admin: true, publisher: true, editor: true, contributor: true },
    { name: "Create & edit drafts in articles", admin: true, publisher: true, editor: true, contributor: true },
    { name: "Publish articles & guides directly", admin: true, publisher: true, editor: false, contributor: false },
    { name: "Manage vehicles & weapons database records", admin: true, publisher: false, editor: true, contributor: false },
    { name: "Calibrate interactive map markers", admin: true, publisher: false, editor: true, contributor: false },
    { name: "Configure site settings & SEO parameters", admin: true, publisher: false, editor: false, contributor: false },
    { name: "Manage team accounts & user roles", admin: true, publisher: false, editor: false, contributor: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Page Header (Image 12) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Users & permissions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Supabase
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage user accounts, roles, and access permissions across the admin dashboard.

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
          className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20"
        >
          + Invite user
        </Button>
      </div>

      {/* Tabs (Image 12: All users, Administrators, Editors, Contributors, Pending invites) */}
      <div className="flex items-center gap-2 border-b border-[#1C2436] pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "all"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <span>All users</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#182030] text-[#94A3B8]">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("admin")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "admin"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <span>Administrators</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#182030] text-[#94A3B8]">
            {users.filter((u) => u.role === "Administrator").length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("editor")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "editor"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <span>Editors</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#182030] text-[#94A3B8]">
            {users.filter((u) => u.role === "Editor").length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contributor")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "contributor"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <span>Contributors</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#182030] text-[#94A3B8]">
            {users.filter((u) => u.role === "Publisher").length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "pending"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <span>Pending invites</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#182030] text-[#94A3B8]">
            {users.filter((u) => u.status === "pending").length}
          </span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors"
            />
          </div>

          <div>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
            >
              <option value="all">All roles</option>
              <option value="Administrator">Administrator</option>
              <option value="Editor">Editor</option>
              <option value="Publisher">Contributor / Publisher</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-[#94A3B8]">
          Showing <strong className="text-white">{filteredUsers.length}</strong> accounts
        </span>
      </div>

      {/* Users Table (Image 12) */}
      <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Team members">
            <thead>
              <tr className="border-b border-[#1C2436] bg-[#0E131D] text-[#64748B] text-[11px]">
                <th scope="col" className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-[#1C2436] text-[#6366F1] focus:ring-0 bg-[#0E131D]"
                    aria-label="Select all users"
                  />
                </th>
                <th scope="col" className="p-3.5 font-medium">User</th>
                <th scope="col" className="p-3.5 font-medium">Role</th>
                <th scope="col" className="p-3.5 font-medium">Status</th>
                <th scope="col" className="p-3.5 font-medium">2FA</th>
                <th scope="col" className="p-3.5 font-medium">Last active</th>
                <th scope="col" className="p-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182030]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#64748B]">
                    No team members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3.5">
                      <input
                        type="checkbox"
                        className="rounded border-[#1C2436] text-[#6366F1] focus:ring-0 bg-[#0E131D]"
                        aria-label={`Select ${u.name}`}
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                          {u.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{u.name}</p>
                          <p className="text-[11px] text-[#64748B]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-semibold border",
                          u.role === "Administrator"
                            ? "bg-[#312E81] text-[#A5B4FC] border-[#4338CA]"
                            : u.role === "Editor"
                            ? "bg-[#1E293B] text-[#94A3B8] border-[#334155]"
                            : "bg-[#064E3B]/40 text-[#34D399] border-[#065F46]"
                        )}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            u.status === "active"
                              ? "bg-emerald-400"
                              : u.status === "pending"
                              ? "bg-amber-400"
                              : "bg-gray-400"
                          )}
                        />
                        <span
                          className={cn(
                            "text-[11px] font-medium capitalize",
                            u.status === "active"
                              ? "text-emerald-400"
                              : u.status === "pending"
                              ? "text-amber-400"
                              : "text-gray-400"
                          )}
                        >
                          {u.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[11px] font-mono text-[#94A3B8]">
                        {u.role === "Administrator" ? "Enabled" : "Optional"}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#64748B] font-mono text-[11px]">
                      {u.lastActivity}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingUser(u)}
                        className="text-xs text-[#6366F1] hover:underline font-semibold"
                      >
                        Edit role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Comparison Matrix (Image 12 bottom) */}
      <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Role Permissions Comparison Matrix
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Overview of capabilities granted to each access tier in the Atlas content management system.
          </p>
        </div>

        <div className="rounded-xl border border-[#1C2436] overflow-hidden bg-[#0E131D]">
          <table className="w-full text-left text-xs" aria-label="Permissions matrix">
            <thead>
              <tr className="border-b border-[#1C2436] bg-[#111622] text-[#64748B] text-[11px]">
                <th scope="col" className="p-3.5 font-medium">System Capability</th>
                <th scope="col" className="p-3.5 font-medium text-center w-36">Administrator</th>
                <th scope="col" className="p-3.5 font-medium text-center w-36">Editor</th>
                <th scope="col" className="p-3.5 font-medium text-center w-36">Contributor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182030]">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#141B2A] transition-colors">
                  <td className="p-3.5 font-medium text-white">{item.name}</td>
                  <td className="p-3.5 text-center">
                    {item.admin ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#64748B] mx-auto" />
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {item.editor ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#64748B] mx-auto" />
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {item.contributor ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#64748B] mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer: Invite User (Image 12) */}
      <Drawer
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite user"
        subtitle="Send an invitation email with role assignment."
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsInviteOpen(false)}
              className="bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleInviteUser}
              className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Send invitation
            </Button>
          </div>
        }
      >
        <div className="space-y-5 text-xs">
          {/* Full Name */}
          <div>
            <label htmlFor="invite-name" className="block font-medium text-[#94A3B8] mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="invite-name"
              type="text"
              placeholder="e.g. Jason Vance"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="invite-email" className="block font-medium text-[#94A3B8] mb-1">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              id="invite-email"
              type="email"
              placeholder="name@gta6atlas.com"
              value={newUser.email}
              onChange={(e) => {
                setNewUser({ ...newUser, email: e.target.value });
                setEmailError("");
              }}
              className={cn(
                "w-full px-3 py-2 rounded-xl bg-[#0E131D] border text-xs text-white focus:outline-none transition-colors",
                emailError
                  ? "border-red-500/80 focus:border-red-500"
                  : "border-[#1C2436] focus:border-[#6366F1]"
              )}
            />
            {emailError && (
              <p className="text-[11px] text-red-400 mt-1 font-medium">{emailError}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block font-medium text-[#94A3B8] mb-2">
              Assigned Role <span className="text-red-400">*</span>
            </label>
            <div className="space-y-2">
              {[
                {
                  role: "Administrator" as const,
                  title: "Administrator",
                  desc: "Full system access. Can manage users, configure SEO, calibrate settings, and delete records.",
                },
                {
                  role: "Editor" as const,
                  title: "Editor",
                  desc: "Can create, edit, and publish database records and articles. Can calibrate map markers.",
                },
                {
                  role: "Publisher" as const,
                  title: "Contributor",
                  desc: "Can create and edit draft articles and database entries. Requires review before publication.",
                },
              ].map((r) => {
                const isSelected = newUser.role === r.role;
                return (
                  <div
                    key={r.role}
                    onClick={() => setNewUser({ ...newUser, role: r.role })}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all",
                      isSelected
                        ? "bg-[#3730A3]/30 border-[#6366F1] ring-1 ring-[#6366F1]"
                        : "bg-[#0E131D] border-[#1C2436] hover:border-[#243048]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{r.title}</p>
                      {isSelected && <Check className="w-4 h-4 text-[#6366F1]" />}
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Permissions Summary Notice Box */}
          <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] flex items-start gap-2.5 text-[#94A3B8]">
            <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              An invitation token with a 48-hour expiration will be sent via email. The recipient must verify their email and set up two-factor authentication.
            </p>
          </div>
        </div>
      </Drawer>

      {/* Edit Role Modal / Drawer */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#1C2436] bg-[#111622] p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Edit Role for {editingUser.name}</h2>
            <p className="text-xs text-[#94A3B8]">
              Select a new role tier for {editingUser.email}.
            </p>

            <div>
              <label htmlFor="edit-role-select" className="block text-xs font-medium text-[#94A3B8] mb-1">
                Role
              </label>
              <select
                id="edit-role-select"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value as AdminUser["role"] })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
              >
                <option value="Administrator">Administrator</option>
                <option value="Editor">Editor</option>
                <option value="Publisher">Contributor / Publisher</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setEditingUser(null)}
                className="bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSaveRole}
                className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Save changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
