"use server";
import { revalidatePath } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/auth/assert-admin";
import {
  parseReviewedProgressItem,
  type ReviewedProgressItem,
} from "@/lib/reviewed-progress";
import { logActivity } from "./activity";
const prefix = "reviewed_completion_item:";
export async function getReviewedProgressItems(): Promise<
  ReviewedProgressItem[]
> {
  const { data, error } = await createPublicClient()
    .from("site_settings")
    .select("value")
    .like("key", `${prefix}%`)
    .order("key");
  if (error) throw new Error("Reviewed checklist records could not be loaded.");
  return (data || []).flatMap((row: { value: unknown }) => {
    try {
      return [
        parseReviewedProgressItem(
          typeof row.value === "string" ? JSON.parse(row.value) : row.value,
        ),
      ];
    } catch {
      return [];
    } // An invalid/unreviewed row can never enter the player denominator.
  });
}
export async function saveReviewedProgressItem(input: ReviewedProgressItem) {
  try {
    await assertAdmin();
    const item = parseReviewedProgressItem(input);
    const { error } = await createAdminClient()
      .from("site_settings")
      .upsert(
        {
          key: `${prefix}${item.id}`,
          value: JSON.stringify(item),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      );
    if (error) throw error;
    await logActivity({
      action: "update",
      targetType: "completion requirement",
      targetId: item.id,
      targetLabel: item.title,
    });
    ["/tracker", "/dashboard", "/dashboard/progress", "/admin/tracker"].forEach(
      (path) => revalidatePath(path),
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Could not save requirement.",
    };
  }
}
export async function deleteReviewedProgressItem(id: string) {
  try {
    await assertAdmin();
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id))
      throw new Error("Invalid requirement ID.");
    const { error } = await createAdminClient()
      .from("site_settings")
      .delete()
      .eq("key", `${prefix}${id}`);
    if (error) throw error;
    await logActivity({
      action: "delete",
      targetType: "completion requirement",
      targetId: id,
    });
    ["/tracker", "/dashboard", "/dashboard/progress", "/admin/tracker"].forEach(
      (path) => revalidatePath(path),
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not remove requirement.",
    };
  }
}
