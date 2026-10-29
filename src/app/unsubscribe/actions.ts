"use server";
import { redirect } from "next/navigation";
import { verifyNewsletterToken } from "@/lib/newsletter-tokens";
import { createAdminClient } from "@/lib/supabase/admin";
import { addSuppressedEmail } from "@/lib/services/newsletter";
export async function unsubscribe(form: FormData) {
  const token = String(form.get("token") || "");
  const identity = verifyNewsletterToken(token);
  if (!identity) redirect("/unsubscribe?status=invalid");
  let success = false;
  try {
    const client = createAdminClient();
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await client
        .from("private_settings")
        .select("value")
        .eq("key", "newsletter_subscribers")
        .maybeSingle();
      if (error) break;
      if (!data) {
        success = true;
        break;
      }
      const list =
        typeof data.value === "string" ? JSON.parse(data.value) : data.value;
      if (!Array.isArray(list)) break;
      const next = list.filter(
        (s) =>
          !(
            s?.email === identity.email &&
            s?.subscribed_at === identity.subscribedAt
          ),
      );
      if (next.length === list.length) {
        success = true;
        break;
      }
      // Compare-and-swap prevents a simultaneous signup from being overwritten.
      const expected = JSON.stringify(data.value);
      const { data: written, error: writeError } = await client
        .from("private_settings")
        .update({
          value: JSON.stringify(next),
          updated_at: new Date().toISOString(),
        })
        .eq("key", "newsletter_subscribers")
        .eq("value", expected)
        .select("key");
      if (writeError) break;
      if (written?.length) {
        success = true;
        break;
      }
    }
  } catch {}
  // Unsubscribing also suppresses future admin broadcasts to this address,
  // including broadcasts that would otherwise reach them as a registered
  // account (not just as a newsletter subscriber). Re-subscribing clears it.
  if (success) {
    await addSuppressedEmail(identity.email);
  }
  redirect("/unsubscribe?status=" + (success ? "removed" : "unavailable"));
}
