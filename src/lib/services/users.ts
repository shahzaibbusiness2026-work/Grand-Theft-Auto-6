"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { INITIAL_ADMIN_USERS, AdminUser } from "@/lib/admin-store";

import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

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

    // Check site_settings fallback
    const { data: setting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_team_members")
      .maybeSingle();

    if (setting?.value) {
      const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
    await assertAdmin();
    const supabase = createAdminClient();

    // Try creating or inviting in Supabase Auth
    let userId: string | undefined;
    const { data: user, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(data.email, {
      data: { name: data.name, role: data.role },
    });

    if (user?.user?.id) {
      userId = user.user.id;
    } else if (inviteErr) {
      // If SMTP is not configured, provision user directly with confirmed status
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: data.email,
        email_confirm: true,
        user_metadata: { name: data.name, role: data.role },
      });

      if (created?.user?.id) {
        userId = created.user.id;
      } else {
        // Persist to site_settings
        userId = `usr-${Date.now()}`;
        const current = await getAdminUsers();
        const newUserObj: AdminUser = {
          id: userId,
          name: data.name,
          email: data.email,
          role: data.role,
          status: "active",
          lastActivity: "Just now",
          avatar: data.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        };
        await supabase.from("site_settings").upsert(
          {
            key: "admin_team_members",
            value: JSON.stringify([newUserObj, ...current]),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        );
      }
    }

    revalidatePath("/admin/users");
    return { success: true, id: userId };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Update a user's role in Supabase Auth metadata.
 */
export async function updateAdminUserRole(id: string, role: AdminUser["role"]) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { role },
    });
    if (error) throw error;

    await logActivity({ action: "update", targetType: "user", targetId: id, detail: { role } });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    console.error("Failed to update user role:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a user from Supabase Auth
 */
export async function deleteAdminUser(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    await supabase.auth.admin.deleteUser(id).catch(() => {});

    // Also remove from site_settings if present
    const current = await getAdminUsers();
    const updated = current.filter((u) => u.id !== id);
    await supabase.from("site_settings").upsert(
      {
        key: "admin_team_members",
        value: JSON.stringify(updated),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
