"use server";

import { headers } from "next/headers";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { getPrivateSetting, setPrivateSetting } from "./private-settings";

export interface NewsletterSubscriber {
  email: string;
  subscribed_at: string;
}

/* ------------------------------------------------------------------ */
/* Best-effort in-memory throttle: 5 calls / 10 min / IP               */
/* (per server instance; stops scripted flooding of the settings row)  */
/* ------------------------------------------------------------------ */
const RATE_LIMIT_MAX = 5;
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
 * Persists newsletter subscriptions to private_settings (service-role only —
 * never site_settings, which is anon-readable).
 */
export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-real-ip") ||
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (isRateLimited(`newsletter:${ip}`)) {
      return { success: false, message: "Too many attempts. Please try again later." };
    }
    recordCall(`newsletter:${ip}`);

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || cleanEmail.length > 254 || !EMAIL_RE.test(cleanEmail)) {
      return { success: false, message: "Please provide a valid email address." };
    }

    const current = (await getPrivateSetting<NewsletterSubscriber[]>("newsletter_subscribers")) || [];
    if (!current.some((s) => s?.email === cleanEmail)) {
      await setPrivateSetting("newsletter_subscribers", [
        ...current,
        { email: cleanEmail, subscribed_at: new Date().toISOString() },
      ]);
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
    await assertAdmin();
    return (await getPrivateSetting<NewsletterSubscriber[]>("newsletter_subscribers")) || [];
  } catch (err) {
    console.error("Failed to get newsletter subscribers:", err);
  }
  return [];
}
