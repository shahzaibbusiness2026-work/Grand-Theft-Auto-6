"use client";

import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  RotateCcw,
  Info
} from "lucide-react";
import { Drawer } from "@/components/admin/drawer";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import {
  AdminUser,
} from "@/lib/admin-store";
import {
  getAdminUsers,
  inviteAdminUser,
  deleteAdminUser,
  setAdminUserSuspended,
} from "@/lib/services/users";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/admin/modal";

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "admin" | "editor" | "contributor" | "pending" | "suspended">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const loadUsers = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    setLoadError("");
    try {
      const data = await getAdminUsers();
      setUsers(data);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      setLoadError(error instanceof Error ? error.message : "Could not load users.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  useEffect(() => { void loadUsers(); }, []);

  // Invite Drawer State (Image 12)
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Publisher" as AdminUser["role"],
  });

  const filteredUsers = users.filter((u) => {
    if (activeTab === "admin" && u.role !== "Administrator") return false;
    if (activeTab === "editor" && u.role !== "Editor") return false;
    if (activeTab === "contributor" && u.role !== "Publisher") return false;
    if (activeTab === "pending" && u.status !== "pending") return false;
    if (activeTab === "suspended" && u.status !== "suspended") return false;

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

    setIsInviting(true);
    const res = await inviteAdminUser(newUser);
    setIsInviting(false);
    if (!res.success) {
      showToast({
        title: "Invitation failed",
        description: res.error || "The user was not created.",
        type: "danger",
      });
      return;
    }
    setIsInviteOpen(false);
    showToast({ title: "Invitation accepted", description: `Supabase accepted an invitation request for ${newUser.email}.`, type: "success" });
    setNewUser({ name: "", email: "", role: "Publisher" });
    await loadUsers(true);
  };

  const [deleteUserTarget, setDeleteUserTarget] = useState<AdminUser | null>(null);

  const handleDeleteUser = async (user: AdminUser) => {
    // Snapshot for rollback if the delete fails
    const previous = users;
    setBusyUserId(user.id);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    const res = await deleteAdminUser(user.id);
    if (res.success) {
      showToast({
        title: "User Removed",
        description: `${user.name} was removed from Supabase Auth.`,
        type: "success",
      });
    } else {
      // Roll back the optimistic removal so the row reappears immediately
      setUsers(previous);
      showToast({
        title: "Delete failed — user restored",
        description: res.error || "Could not delete the user.",
        type: "danger",
      });
    }
    setBusyUserId(null);
  };

  const handleToggleSuspended = async (user: AdminUser) => {
    setBusyUserId(user.id);
    const suspended = user.status !== "suspended";
    const result = await setAdminUserSuspended(user.id, suspended);
    if (result.success) {
      await loadUsers();
      showToast({ title: suspended ? "Account suspended" : "Account restored", description: `${user.email} was ${suspended ? "suspended" : "restored"}.`, type: "success" });
    } else {
      showToast({ title: "Account status unchanged", description: result.error || "Could not update this account.", type: "danger" });
    }
    setBusyUserId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Page Header (Image 12) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Users & account access
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isLoading ? "Loading accounts…" : isConnected ? "Supabase Auth connected" : "Supabase Auth unavailable"}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Review real Supabase Auth accounts, send invitations, suspend or restore sign-in, and remove accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md" onClick={() => void loadUsers(true)} isLoading={isRefreshing} leftIcon={<RotateCcw className="w-4 h-4" />} className="bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white">Refresh</Button>
          <Button variant="primary" size="md" onClick={() => { setEmailError(""); setIsInviteOpen(true); }} leftIcon={<UserPlus className="w-4 h-4" />} className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20">+ Invite user</Button>
        </div>
      </div>

      {loadError && <div role="alert" className="rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">{loadError}</div>}
      {!isLoading && !loadError && users.length === 0 && <div className="rounded-lg border border-[#263044] bg-[#111622] px-4 py-6 text-center text-sm text-[#94A3B8]">No CMS team accounts found in Supabase Auth. Invite a team member to create a real account.</div>}

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
          <span className="px-1.5 py-0.2 rounded-full text-xs font-mono bg-[#182030] text-[#94A3B8]">
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
          <span className="px-1.5 py-0.2 rounded-full text-xs font-mono bg-[#182030] text-[#94A3B8]">
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
          <span className="px-1.5 py-0.2 rounded-full text-xs font-mono bg-[#182030] text-[#94A3B8]">
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
          <span className="px-1.5 py-0.2 rounded-full text-xs font-mono bg-[#182030] text-[#94A3B8]">
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
          <span className="px-1.5 py-0.2 rounded-full text-xs font-mono bg-[#182030] text-[#94A3B8]">
            {users.filter((u) => u.status === "pending").length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("suspended")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "suspended" ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm" : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <span>Suspended</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs font-mono bg-[#182030] text-[#94A3B8]">{users.filter((u) => u.status === "suspended").length}</span>
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
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-[#94A3B8]">
          Showing <strong className="text-white">{filteredUsers.length}</strong> accounts
        </span>
      </div>

      {/* Supabase Auth account list */}
      <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Team members">
            <thead>
              <tr className="border-b border-[#1C2436] bg-[#0E131D] text-[#64748B] text-xs">
                <th scope="col" className="p-3.5 font-medium">User</th>
                <th scope="col" className="p-3.5 font-medium">Role</th>
                <th scope="col" className="p-3.5 font-medium">Status</th>
                <th scope="col" className="p-3.5 font-medium">Last active</th>
                <th scope="col" className="p-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182030]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#64748B]">
                    Loading team members...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#64748B]">
                    No team members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                          {u.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-white flex items-center gap-2">
                            {u.name}
                            {u.isProtectedAdmin && <span className="rounded border border-indigo-400/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-200">Deployment admin</span>}
                          </p>
                          <p className="text-xs text-[#64748B]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-semibold border",
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
                              ? "bg-gold-light"
                              : "bg-gray-400"
                          )}
                        />
                        <span
                          className={cn(
                            "text-xs font-medium capitalize",
                            u.status === "active"
                              ? "text-emerald-400"
                              : u.status === "pending"
                              ? "text-gold-light"
                              : "text-gray-400"
                          )}
                        >
                          {u.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#64748B] font-mono text-xs">
                      {u.lastActivity}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button type="button" disabled={busyUserId === u.id || u.isProtectedAdmin} onClick={() => void handleToggleSuspended(u)} title={u.isProtectedAdmin ? "Manage this administrator in the deployment allowlist." : undefined} className="text-xs text-[#94A3B8] hover:text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                          {busyUserId === u.id ? "Saving…" : u.status === "suspended" ? "Restore" : "Suspend"}
                        </button>
                        <button type="button" disabled={busyUserId === u.id || u.isProtectedAdmin} onClick={() => setDeleteUserTarget(u)} title={u.isProtectedAdmin ? "Manage this administrator in the deployment allowlist." : undefined} className="text-xs text-[#64748B] hover:text-[#F87171] font-semibold disabled:opacity-40 disabled:cursor-not-allowed">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-4 flex items-start gap-3 text-sm text-amber-100">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-300" />
        <p><strong>Access model:</strong> the <code>ADMIN_MASTER_EMAILS</code> deployment allowlist grants CMS access. Editor and Publisher labels are account metadata only; they do not grant separate permissions. Add or remove CMS administrators through the deployment allowlist.</p>
      </div>

      {/* Slide-over Drawer: Invite User (Image 12) */}
      <Drawer
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite account"
        subtitle="Send a Supabase Auth invitation."
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
              disabled={isInviting}
              className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              {isInviting ? "Sending…" : "Send invitation"}
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
              placeholder="Invited user's name"
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
              placeholder="name@example.com"
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
              <p className="text-xs text-red-400 mt-1 font-medium">{emailError}</p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 text-amber-100">
            <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              Supabase must accept the invitation for it to appear here. This creates a Publisher metadata label only. CMS access is separately controlled by <code>ADMIN_MASTER_EMAILS</code> in the deployment settings.
            </p>
          </div>
        </div>
      </Drawer>
      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteUserTarget}
        onClose={() => setDeleteUserTarget(null)}
        title="Delete permanently?"
        description={`This will permanently delete user "${deleteUserTarget?.name || deleteUserTarget?.email}". This action cannot be undone.`}
        variant="danger"
        footer={<>
          <button
            type="button"
            onClick={() => setDeleteUserTarget(null)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { if (deleteUserTarget) { handleDeleteUser(deleteUserTarget); setDeleteUserTarget(null); } }}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            Delete
          </button>
        </>}
      />
    </div>
  );
}

