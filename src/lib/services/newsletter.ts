"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface NewsletterSubscriber {
  email: string;
  subscribed_at: string;
}

/**
 * Persists newsletter subscriptions to Supabase site_settings
 */
export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, message: "Please provide a valid email address." };
    }

    const cleanEmail = email.trim().toLowerCase();
    const supabase = createAdminClient();

    // Fetch existing subscribers from site_settings
    const { data: setting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "newsletter_subscribers")
      .maybeSingle();

    let subscribers: NewsletterSubscriber[] = [];
    if (setting?.value) {
      const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
      if (Array.isArray(parsed)) subscribers = parsed;
    }

    if (!subscribers.some((s) => s.email === cleanEmail)) {
      subscribers.push({ email: cleanEmail, subscribed_at: new Date().toISOString() });
      await supabase.from("site_settings").upsert(
        {
          key: "newsletter_subscribers",
          value: JSON.stringify(subscribers),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    }

    return { success: true };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return { success: false, message: "Failed to subscribe. Please try again." };
  }
}

/**
 * Fetch subscribers for admin view
 */
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const supabase = createAdminClient();
    const { data: setting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "newsletter_subscribers")
      .maybeSingle();

    if (setting?.value) {
      const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Failed to get newsletter subscribers:", err);
  }
  return [];
}
