"use server";

import { headers } from "next/headers";
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

/* ------------------------------------------------------------------ */
/* Best-effort in-memory throttle: 3 submissions / 10 min / IP         */
/* (per server instance; slows scripted flooding of the inbox)         */
/* ------------------------------------------------------------------ */
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const recentCalls = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const entry = recentCalls.get(key);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    recentCalls.delete(key);
    return false;
  }
  return entry.count >= RATE_LIMIT_MAX;
}

function recordCall(key: string) {
  const entry = recentCalls.get(key);
  if (!entry || Date.now() > entry.resetAt) {
    recentCalls.set(key, { count: 1, resetAt: Date.now() + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
    const hdrs = await headers();
    const ip =
      hdrs.get("x-real-ip") ||
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (isRateLimited(`contact:${ip}`)) {
      return { success: false, message: "Too many messages sent. Please try again later." };
    }

    const name = (input.name || "").trim();
    const email = (input.email || "").trim();
    const subject = (input.subject || "").trim();
    const message = (input.message || "").trim();

    if (!name || !email || !message) {
      return { success: false, message: "Please fill in your name, a valid email and a message." };
    }
    if (name.length > 100) {
      return { success: false, message: "Name is too long (max 100 characters)." };
    }
    if (email.length > 254 || !EMAIL_RE.test(email)) {
      return { success: false, message: "Please provide a valid email address." };
    }
    if (subject.length > 200) {
      return { success: false, message: "Subject is too long (max 200 characters)." };
    }
    if (message.length > 5000) {
      return { success: false, message: "Message is too long (max 5000 characters)." };
    }

    recordCall(`contact:${ip}`);

    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject: subject || null,
      message,
    });
    if (error) throw error;

    await logActivity({
      actor: name,
      action: "submit",
      targetType: "contact_message",
      targetLabel: `${name} <${email}>`,
      detail: { subject },
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
    await assertAdmin();
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
