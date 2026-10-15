"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";

export interface AdminTask {
  id: string;
  title: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
  category: string;
}

const DEFAULT_TASKS: AdminTask[] = [];

/**
 * Fetch all admin tasks from Supabase
 */
export async function getTasks(): Promise<AdminTask[]> {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_tasks")
      .maybeSingle();

    if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
      return data.value as AdminTask[];
    }
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
  return DEFAULT_TASKS;
}

/**
 * Save / Update a task in Supabase
 */
export async function saveTask(task: AdminTask) {
  try {
    await assertAdmin();
    const current = await getTasks();
    const existingIndex = current.findIndex((t) => t.id === task.id);
    let updated: AdminTask[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...task };
    } else {
      updated = [task, ...current];
    }

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("site_settings")
      .upsert({ key: "admin_tasks", value: updated, updated_at: new Date().toISOString() });

    if (error) throw error;

    revalidatePath("/admin/tasks");
    revalidatePath("/admin");
    return { success: true, id: task.id };
  } catch (err) {
    console.error("Error saving task:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a task from Supabase
 */
export async function deleteTask(id: string) {
  try {
    await assertAdmin();
    const current = await getTasks();
    const updated = current.filter((t) => t.id !== id);

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("site_settings")
      .upsert({ key: "admin_tasks", value: updated, updated_at: new Date().toISOString() });

    if (error) throw error;

    revalidatePath("/admin/tasks");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    console.error("Error deleting task:", err);
    return { success: false, error: String(err) };
  }
}
