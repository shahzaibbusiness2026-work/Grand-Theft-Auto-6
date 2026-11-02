"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminUser } from "@/lib/admin-store";

import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

/**
 * Fetch users from Supabase Auth plus explicitly managed local team accounts.
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  await assertAdmin();
  const supabase = createAdminClient();
  const authUsersRaw: Array<NonNullable<Awaited<ReturnType<typeof supabase.auth.admin.listUsers>>["data"]>["users"][number]> = [];
  const perPage = 1000;
  for (let page = 1; page <= 1000; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`Could not load authentication users: ${error.message}`);
    const batch = data?.users || [];
    authUsersRaw.push(...batch);
    if (batch.length < perPage) break;
    if (page === 1000) throw new Error("The admin account list exceeded its safe pagination limit.");
  }
  const masterEmails = (process.env.ADMIN_MASTER_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  const authUsers = authUsersRaw.flatMap((u) => {
    const metadata = u.user_metadata || {};
    const normalizedEmail = (u.email || "").toLowerCase();
    const isMasterAdmin = masterEmails.includes(normalizedEmail);
    const metadataRole = metadata.role;
    const role: AdminUser["role"] | undefined =
      isMasterAdmin || metadataRole === "admin" || metadataRole === "Administrator"
        ? "Administrator"
        : metadataRole === "Editor" || metadataRole === "Publisher"
          ? metadataRole
          : undefined;
    if (!role) return [];
    const name = typeof metadata.name === "string" && metadata.name.trim()
      ? metadata.name.trim()
      : normalizedEmail;
    const bannedUntil = u.banned_until ? new Date(u.banned_until).getTime() : 0;
    const isSuspended = Number.isFinite(bannedUntil) && bannedUntil > Date.now();
    return [{
      id: u.id,
      name,
      email: u.email || "",
      role,
      status: (isSuspended ? "suspended" : u.email_confirmed_at ? "active" : "pending") as AdminUser["status"],
      lastActivity: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "Never",
      avatar: name.split(/\s+/).filter(Boolean).slice(0, 2).map((part: string) => part[0]).join("").toUpperCase() || "?",
      isProtectedAdmin: isMasterAdmin,
    }];
  });
  return authUsers;
}

/**
 * Invite a user via Supabase Auth admin API
 */
export async function inviteAdminUser(data: { name: string; email: string; role: AdminUser["role"] }) {
  try {
    await assertAdmin();

    const email = (data.email || "").trim().toLowerCase();
    const name = (data.name || "").trim();
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return { success: false, error: "Please provide a valid email address." };
    }
    if (!name || name.length > 80) {
      return { success: false, error: "Please provide a name (max 80 characters)." };
    }
    data = { ...data, email, name };

    const supabase = createAdminClient();

    // A user must exist in Supabase Auth so status, role, sign-in and removal
    // actions operate on a real account. Never create a local-only pseudo-user.
    const { data: user, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(data.email, {
      data: { name: data.name, role: data.role },
    });
    if (inviteErr) throw new Error(`Supabase could not send the invitation: ${inviteErr.message}`);
    if (!user?.user?.id) throw new Error("Supabase did not return the invited account.");
    const userId = user.user.id;

    await logActivity({
      action: "create",
      targetType: "user",
      targetId: userId,
      targetLabel: `${data.name} <${data.email}>`,
      detail: { role: data.role },
    });

    revalidatePath("/admin/users");
    return { success: true, id: userId };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a user from Supabase Auth
 */
export async function deleteAdminUser(id: string) {
  try {
    const session = await assertAdmin();
    const supabase = createAdminClient();
    const { data: target, error: lookupError } = await supabase.auth.admin.getUserById(id);
    if (lookupError) throw lookupError;
    if (!target.user) throw new Error("User was not found.");
    const masterEmails = (process.env.ADMIN_MASTER_EMAILS || "").split(",").map((email) => email.trim().toLowerCase());
    if (masterEmails.includes((target.user.email || "").toLowerCase())) {
      throw new Error("Configured master administrators must be removed from the deployment allowlist before deleting their account.");
    }
    if (session.userId === id || session.userId === (target.user.email || "").toLowerCase()) {
      throw new Error("You cannot delete your own active account.");
    }
    const { error: deleteError } = await supabase.auth.admin.deleteUser(id);
    if (deleteError) throw deleteError;

    await logActivity({ action: "delete", targetType: "user", targetId: id });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete user:", err);
    return { success: false, error: String(err) };
  }
}

/** Suspend or restore a real Supabase Auth account. */
export async function setAdminUserSuspended(id: string, suspended: boolean) {
  try {
    const session = await assertAdmin();
    const supabase = createAdminClient();
    const { data: target, error: lookupError } = await supabase.auth.admin.getUserById(id);
    if (lookupError) throw lookupError;
    if (!target.user) throw new Error("User was not found.");
    const email = (target.user.email || "").toLowerCase();
    const masterEmails = (process.env.ADMIN_MASTER_EMAILS || "").split(",").map((value) => value.trim().toLowerCase());
    if (masterEmails.includes(email)) throw new Error("Configured master administrators must be managed through the deployment allowlist.");
    if (session.userId === id || session.userId === email) throw new Error("You cannot suspend your own active account.");
    const { error } = await supabase.auth.admin.updateUserById(id, { ban_duration: suspended ? "876000h" : "none" });
    if (error) throw error;
    await logActivity({ action: "update", targetType: "user", targetId: id, detail: { status: suspended ? "suspended" : "restored" } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
