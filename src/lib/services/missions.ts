"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";

export interface MissionRecord {
  id: string;
  name: string;
  protagonist: "Lucia" | "Jason" | "Both";
  act: string;
  status: "Confirmed" | "Rumoured";
  objectives: string;
  description?: string;
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
  } catch { /* fallback */ }
  return FALLBACK_MISSIONS;
}

export async function saveMission(mission: Partial<MissionRecord> & { name: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = mission.id || `mis-${Date.now()}`;
    const { error } = await supabase.from("missions").upsert({ ...mission, id, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (error) throw error;
    revalidatePath("/admin/missions");
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
    if (error) throw error;
    revalidatePath("/admin/missions");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
