"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export interface AdminTask {
  id: string;
  title: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
  category: string;
}

const DEFAULT_TASKS: AdminTask[] = [
  {
    id: "task-1",
    title: "Corroborate Banshee GTS speedometer in trailer 1 frame 0:42",
    assignee: "Morgan Kim",
    priority: "high",
    dueDate: "Sep 22, 2026",
    completed: false,
    category: "Vehicles",
  },
  {
    id: "task-2",
    title: "Recalibrate Vice City Metro station coordinates on interactive map",
    assignee: "Alex Rivera",
    priority: "high",
    dueDate: "Sep 23, 2026",
    completed: false,
    category: "Map",
  },
  {
    id: "task-3",
    title: "Complete editorial proofread on 'Trailer details to verify'",
    assignee: "Jamie Lee",
    priority: "medium",
    dueDate: "Sep 24, 2026",
    completed: false,
    category: "Articles",
  },
  {
    id: "task-4",
    title: "Add telemetry specs for Grotti Cheetah Classic",
    assignee: "Morgan Kim",
    priority: "low",
    dueDate: "Sep 25, 2026",
    completed: true,
    category: "Vehicles",
  },
];

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
