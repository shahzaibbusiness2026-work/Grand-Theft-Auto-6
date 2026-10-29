"use server";

import { headers } from "next/headers";
import { createHash } from "crypto";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { getPrivateSetting, setPrivateSetting } from "./private-settings";
import { peekRateLimit, recordRateLimitHit } from "@/lib/rate-limit";

export interface NewsletterSubscriber {
  email: string;
  subscribed_at: string;
}

interface PendingSubscription {
  email: string;
  token_hash: string;
  created_at: string;
  expires_at: string;
}

const SUBSCRIBERS_KEY = "newsletter_subscribers";
const PENDING_KEY = "newsletter_pending";

/**
 * Broadcast suppression list (private_settings key `broadcast_suppressed`,
 * a plain string[] of lowercase emails). Anyone who unsubscribes — whether
 * they were a newsletter subscriber or a registered account — lands here
 * and is left out of future admin broadcasts, even though the broadcast
 * audience is rebuilt from the live account + subscriber stores each time.
 * Re-subscribing to the newsletter clears the suppression.
 */
const SUPPRESSED_KEY = "broadcast_suppressed";

export async function getSuppressedEmails(): Promise<string[]> {
  try {
    const list =
      (await getPrivateSetting<string[]>(SUPPRESSED_KEY)) || [];
    return list.filter(
      (e): e is string => typeof e === "string" && e.length > 0,
    );
  } catch {
    return [];
  }
}

export async function addSuppressedEmail(email: string): Promise<void> {
  try {
    const clean = (email || "").trim().toLowerCase();
    if (!clean) return;
    const list = (await getPrivateSetting<string[]>(SUPPRESSED_KEY)) || [];
    if (!list.includes(clean)) {
      await setPrivateSetting(SUPPRESSED_KEY, [...list, clean]);
    }
  } catch {
    // Suppression is best-effort; never fail the caller's flow over it.
  }
}

export async function removeSuppressedEmail(email: string): Promise<void> {
  try {
    const clean = (email || "").trim().toLowerCase();
    const list = (await getPrivateSetting<string[]>(SUPPRESSED_KEY)) || [];
    if (list.includes(clean)) {
      await setPrivateSetting(
        SUPPRESSED_KEY,
        list.filter((e) => e !== clean),
      );
    }
  } catch {
    // Best-effort only.
  }
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function getPending(): Promise<PendingSubscription[]> {
  return (await getPrivateSetting<PendingSubscription[]>(PENDING_KEY)) || [];
}

async function purgeExpiredPending(
  list: PendingSubscription[],
): Promise<PendingSubscription[]> {
  const now = new Date().toISOString();
  const fresh = list.filter((p) => p.expires_at > now);
  if (fresh.length !== list.length) {
    await setPrivateSetting(PENDING_KEY, fresh);
  }
  return fresh;
}

/**
 * Single opt-in newsletter signup:
 *  1. Validates + rate-limits the request.
 *  2. Adds the address directly to the live subscriber list — no
 *     confirmation email or link click required.
 */
export async function subscribeNewsletter(
  email: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-real-ip") ||
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (await peekRateLimit("newsletter-signup", ip, RATE_LIMIT_MAX)) {
      return {
        success: false,
        message: "Too many attempts. Please try again later.",
      };
    }
    await recordRateLimitHit("newsletter-signup", ip, RATE_LIMIT_WINDOW_MS);

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || cleanEmail.length > 254 || !EMAIL_RE.test(cleanEmail)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
      };
    }

    const subscribers =
      (await getPrivateSetting<NewsletterSubscriber[]>(SUBSCRIBERS_KEY)) || [];
    if (subscribers.some((s) => s?.email === cleanEmail)) {
      // Already subscribed — a re-subscribe also lifts any broadcast
      // suppression from an earlier unsubscribe.
      await removeSuppressedEmail(cleanEmail);
      return { success: true, message: "You're already subscribed." };
    }

    const stored = await setPrivateSetting(SUBSCRIBERS_KEY, [
      ...subscribers,
      { email: cleanEmail, subscribed_at: new Date().toISOString() },
    ]);
    if (!stored)
      return {
        success: false,
        message: "Subscription storage is unavailable. Please try again later.",
      };

    await removeSuppressedEmail(cleanEmail);
    return { success: true, message: "You're subscribed — see you at launch!" };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return {
      success: false,
      message: "Failed to subscribe. Please try again.",
    };
  }
}

export type ConfirmResult = "confirmed" | "already" | "expired" | "invalid";

/**
 * Activate a pending subscription via its confirmation token.
 * Tokens are single-use and expire after 24 hours.
 */
export async function confirmNewsletterSubscription(
  token: string,
): Promise<{ result: ConfirmResult; email?: string }> {
  try {
    const clean = (token || "").trim();
    if (!clean || clean.length > 128) return { result: "invalid" };

    const pending = await getPending();
    const entry = pending.find((p) => p.token_hash === hashToken(clean));
    if (!entry) return { result: "invalid" };

    if (entry.expires_at <= new Date().toISOString()) {
      await setPrivateSetting(
        PENDING_KEY,
        pending.filter((p) => p.token_hash !== entry.token_hash),
      );
      return { result: "expired" };
    }

    // Remove the pending entry (single-use) and add to subscribers.
    await setPrivateSetting(
      PENDING_KEY,
      pending.filter((p) => p.token_hash !== entry.token_hash),
    );
    const subscribers =
      (await getPrivateSetting<NewsletterSubscriber[]>(SUBSCRIBERS_KEY)) || [];
    if (!subscribers.some((s) => s?.email === entry.email)) {
      await setPrivateSetting(SUBSCRIBERS_KEY, [
        ...subscribers,
        { email: entry.email, subscribed_at: new Date().toISOString() },
      ]);
    }

    return { result: "confirmed", email: entry.email };
  } catch (err) {
    console.error("Newsletter confirmation error:", err);
    return { result: "invalid" };
  }
}

/**
 * Fetch subscribers for admin view
 */
export async function getNewsletterSubscribers(): Promise<
  NewsletterSubscriber[]
> {
  try {
    await assertAdmin();
    return (
      (await getPrivateSetting<NewsletterSubscriber[]>(SUBSCRIBERS_KEY)) || []
    );
  } catch (err) {
    console.error("Failed to get newsletter subscribers:", err);
  }
  return [];
}

/** Admin: manually add a subscriber (imports, corrections, offline signups). */
export async function adminAddSubscriber(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const clean = (email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(clean))
      return { success: false, error: "Invalid email address" };
    const list =
      (await getPrivateSetting<NewsletterSubscriber[]>(SUBSCRIBERS_KEY)) || [];
    if (list.some((s) => s.email === clean)) {
      return { success: false, error: "That email is already subscribed" };
    }
    list.push({ email: clean, subscribed_at: new Date().toISOString() });
    await setPrivateSetting(SUBSCRIBERS_KEY, list);
    await removeSuppressedEmail(clean);
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/** Admin: remove a subscriber (honors unsubscribe requests immediately). */
export async function adminRemoveSubscriber(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const clean = (email || "").trim().toLowerCase();
    const list =
      (await getPrivateSetting<NewsletterSubscriber[]>(SUBSCRIBERS_KEY)) || [];
    const next = list.filter((s) => s.email !== clean);
    if (next.length === list.length) {
      return { success: false, error: "Subscriber not found" };
    }
    await setPrivateSetting(SUBSCRIBERS_KEY, next);
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/** Pending (unconfirmed) subscriptions, for admin visibility. */
export async function getPendingSubscribers(): Promise<
  { email: string; created_at: string; expires_at: string }[]
> {
  try {
    await assertAdmin();
    const pending = await purgeExpiredPending(await getPending());
    return pending.map((p) => ({
      email: p.email,
      created_at: p.created_at,
      expires_at: p.expires_at,
    }));
  } catch (err) {
    console.error("Failed to get pending subscribers:", err);
  }
  return [];
}
