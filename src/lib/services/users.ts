"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { INITIAL_ADMIN_USERS, AdminUser } from "@/lib/admin-store";

/**
 * Fetch users from Supabase Auth admin API (with fallback)
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers();

    if (!error && data && data.users && data.users.length > 0) {
      return data.users.map((u) => {
        const metadata = u.user_metadata || {};
        const name = metadata.name || u.email?.split("@")[0] || "Team Member";
        return {
          id: u.id,
          name,
          email: u.email || "",
          role: (metadata.role as AdminUser["role"]) || "Editor",
          status: u.email_confirmed_at ? "active" : "pending",
          lastActivity: u.last_sign_in_at
            ? new Date(u.last_sign_in_at).toLocaleDateString()
            : "Never",
          avatar: name
            .split(" ")
            .map((p: string) => p[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        };
      });
    }
  } catch {
    // fallback
  }

  return INITIAL_ADMIN_USERS;
}

/**
 * Invite a user via Supabase Auth admin API
 */
export async function inviteAdminUser(data: { name: string; email: string; role: AdminUser["role"] }) {
  try {
    const supabase = createAdminClient();
    const { data: user, error } = await supabase.auth.admin.inviteUserByEmail(data.email, {
      data: { name: data.name, role: data.role },
    });

    if (error) {
      // If invite fails (e.g. email provider not configured in Supabase), return informative status
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/users");
    return { success: true, id: user.user?.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a user from Supabase Auth
 */
export async function deleteAdminUser(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
