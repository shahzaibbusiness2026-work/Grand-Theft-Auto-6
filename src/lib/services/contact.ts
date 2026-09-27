"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "new" | "read" | "handled";
  created_at: string;
}

/**
 * Public contact-form submission. Persists to Supabase via the service-role
 * client (the contact_messages table has no anon policies by design).
 * No assertAdmin here — this is the public entry point.
 */
export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const name = (input.name || "").trim();
    const email = (input.email || "").trim();
    const message = (input.message || "").trim();

    if (!name || !email.includes("@") || !message) {
      return { success: false, message: "Please fill in your name, a valid email and a message." };
    }
    if (message.length > 5000) {
      return { success: false, message: "Message is too long (max 5000 characters)." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject: (input.subject || "").trim() || null,
      message,
    });
    if (error) throw error;

    await logActivity({
      actor: name,
      action: "submit",
      targetType: "contact_message",
      targetLabel: `${name} <${email}>`,
      detail: { subject: input.subject || "" },
    });

    return { success: true };
  } catch (err) {
    console.error("Contact submission error:", err);
    return { success: false, message: "Failed to send your message. Please try again." };
  }
}

/**
 * Admin: list all contact messages.
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data as ContactMessage[];
  } catch (err) {
    console.warn("getContactMessages failed:", err instanceof Error ? err.message : err);
  }
  return [];
}

/**
 * Admin: update message status ('new' | 'read' | 'handled').
 */
export async function updateContactMessageStatus(id: string, status: ContactMessage["status"]) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) throw error;

    await logActivity({ action: "update", targetType: "contact_message", targetId: id, detail: { status } });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (err) {
    console.error("Failed to update message status:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Admin: delete a contact message.
 */
export async function deleteContactMessage(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) throw error;

    await logActivity({ action: "delete", targetType: "contact_message", targetId: id });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete message:", err);
    return { success: false, error: String(err) };
  }
}
