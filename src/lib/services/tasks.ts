"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
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

/**
 * Fetch all admin tasks from Supabase
 */
export async function getTasks(): Promise<AdminTask[]> {
  await assertAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", "admin_tasks").maybeSingle();
  if (error) throw new Error(`Could not load tasks: ${error.message}`);
  if (!data?.value) return [];
  const value = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
  if (!Array.isArray(value)) throw new Error("Saved tasks have an invalid format.");
  return value as AdminTask[];
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
