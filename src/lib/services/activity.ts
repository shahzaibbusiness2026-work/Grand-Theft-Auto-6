"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target_type: string;
  target_id?: string | null;
  target_label?: string | null;
  detail?: Record<string, unknown> | null;
  created_at: string;
}

/**
 * Append an entry to the site-wide activity log.
 * Called by every service mutation so the admin Activity page shows real,
 * live website events. Never throws — logging must not break mutations.
 */
export async function logActivity(entry: {
  actor?: string;
  action: "create" | "update" | "delete" | "submit";
  targetType: string;
  targetId?: string;
  targetLabel?: string;
  detail?: Record<string, unknown>;
}): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("activity_log").insert({
      actor: entry.actor || "admin",
      action: entry.action,
      target_type: entry.targetType,
      target_id: entry.targetId || null,
      target_label: entry.targetLabel || null,
      detail: entry.detail || {},
    });
  } catch (err) {
    // Activity logging is best-effort; table may not exist yet.
    console.warn("logActivity failed:", err instanceof Error ? err.message : err);
  }
}

/**
 * Fetch recent activity entries for the admin dashboard.
 */
export async function getActivityLog(limit = 50): Promise<ActivityEntry[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!error && data) return data as ActivityEntry[];
  } catch (err) {
    console.warn("getActivityLog failed:", err instanceof Error ? err.message : err);
  }
  return [];
}
