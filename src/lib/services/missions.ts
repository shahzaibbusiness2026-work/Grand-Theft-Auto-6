"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

export interface MissionRecord {
  id: string;
  name: string;
  protagonist: "Lucia" | "Jason" | "Both";
  act: string;
  status: "Confirmed" | "Rumoured";
  objectives: string;
  description?: string;
  district?: string;
  location?: string;
}

const FALLBACK_MISSIONS: MissionRecord[] = [
  { id: "mis-1", name: "Leonida Corrections Breakout", protagonist: "Lucia", act: "Prologue / Act 1", status: "Confirmed", objectives: "Escape penitentiary grounds with contact assistance." },
  { id: "mis-2", name: "Convenience Store Robbery", protagonist: "Both", act: "Act 1", status: "Confirmed", objectives: "Armed robbery of Vice City convenience store." },
  { id: "mis-3", name: "Port Gellhorn Airfield Infiltration", protagonist: "Jason", act: "Act 2", status: "Rumoured", objectives: "Secure contraband flight plan from hangar." },
];

export async function getMissions(): Promise<MissionRecord[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.from("missions").select("*").order("created_at", { ascending: true });
    if (!error && data && data.length > 0) return data as MissionRecord[];

    // Fallback to site_settings persistence
    const { data: setting } = await supabase.from("site_settings").select("value").eq("key", "missions_data").single();
    if (setting?.value) {
      const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as MissionRecord[];
    }
  } catch { /* fallback */ }
  return FALLBACK_MISSIONS;
}

/**
 * True only when the error means the table itself is absent (pre-migration
 * DB) — the case the site_settings fallback exists for. Every other failure
 * (validation, connectivity, constraint) must surface instead of silently
 * rewriting the fallback blob.
 */
function isMissingTableError(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false;
  return (
    err.code === "42P01" ||
    err.code === "PGRST205" ||
    /does not exist|could not find the table/i.test(err.message || "")
  );
}

export async function saveMission(mission: Partial<MissionRecord> & { name: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = mission.id || `mis-${Date.now()}`;
    const itemToSave = { ...mission, id, updated_at: new Date().toISOString() };

    const { error } = await supabase.from("missions").upsert(itemToSave, { onConflict: "id" });
    if (error && !isMissingTableError(error)) {
      return { success: false, error: error.message };
    }
    if (error) {
      // Table doesn't exist, persist in site_settings
      const current = await getMissions();
      const idx = current.findIndex((m) => m.id === id);
      const updated = idx >= 0
        ? current.map((m, i) => (i === idx ? { ...m, ...mission, id } : m))
        : [...current, itemToSave as MissionRecord];
      await supabase.from("site_settings").upsert(
        { key: "missions_data", value: JSON.stringify(updated), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    }

    await logActivity({
      action: mission.id ? "update" : "create",
      targetType: "mission",
      targetId: id,
      targetLabel: mission.name,
    });

    revalidatePath("/admin/missions");
    revalidatePath("/missions");
    return { success: true, id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteMission(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("missions").delete().eq("id", id);
    if (error && !isMissingTableError(error)) {
      return { success: false, error: error.message };
    }
    if (error) {
      // Table doesn't exist, update in site_settings
      const current = await getMissions();
      const updated = current.filter((m) => m.id !== id);
      await supabase.from("site_settings").upsert(
        { key: "missions_data", value: JSON.stringify(updated), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    }

    await logActivity({ action: "delete", targetType: "mission", targetId: id });

    revalidatePath("/admin/missions");
    revalidatePath("/missions");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
