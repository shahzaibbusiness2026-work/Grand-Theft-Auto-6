"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

export interface RadioStationRecord {
  id: string;
  name: string;
  genre?: string;
  host?: string;
  frequency?: string;
  accent_color?: string;
  description?: string;
  tracks?: string[];
  sort_order?: number;
  visible?: boolean;
}

export async function getPublicRadioStations(): Promise<RadioStationRecord[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("radio_stations")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) return data as RadioStationRecord[];
  } catch {
    // Graceful fallback to hardcoded stations
  }
  return [];
}

export async function getAdminRadioStations(): Promise<RadioStationRecord[]> {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("radio_stations")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) return data as RadioStationRecord[];
  } catch {
    // Graceful fallback
  }
  return [];
}

export async function saveRadioStation(station: Partial<RadioStationRecord> & { name: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = station.id || `radio-${Date.now()}`;

    const { error } = await supabase.from("radio_stations").upsert(
      {
        ...station,
        id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) throw error;

    await logActivity({
      action: station.id ? "update" : "create",
      targetType: "radio_station",
      targetId: id,
      targetLabel: station.name,
    });

    revalidatePath("/radio");
    revalidatePath("/admin/radio");
    return { success: true, id };
  } catch (err) {
    console.error("Failed to save radio station:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteRadioStation(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("radio_stations").delete().eq("id", id);
    if (error) throw error;

    await logActivity({ action: "delete", targetType: "radio_station", targetId: id });

    revalidatePath("/radio");
    revalidatePath("/admin/radio");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete radio station:", err);
    return { success: false, error: String(err) };
  }
}
