"use server";

import { headers } from "next/headers";
import { randomBytes, createHash } from "crypto";
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

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CONFIRM_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getSiteBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.startsWith("http")) return envUrl.replace(/\/$/, "");
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function getPending(): Promise<PendingSubscription[]> {
  return (await getPrivateSetting<PendingSubscription[]>(PENDING_KEY)) || [];
}

async function purgeExpiredPending(list: PendingSubscription[]): Promise<PendingSubscription[]> {
  const now = new Date().toISOString();
  const fresh = list.filter((p) => p.expires_at > now);
  if (fresh.length !== list.length) {
    await setPrivateSetting(PENDING_KEY, fresh);
  }
  return fresh;
}

async function sendConfirmationEmail(email: string, token: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const confirmUrl = `${getSiteBaseUrl()}/newsletter/confirm?token=${encodeURIComponent(token)}`;

  if (!apiKey) {
    // Email service not configured: still store the pending subscription and
    // surface the link in server logs so it can be confirmed during dev.
    // In production, set RESEND_API_KEY so users actually receive this.
    console.warn(
      `[newsletter] RESEND_API_KEY not set — confirmation email for ${email} NOT sent. ` +
        `Confirmation link: ${confirmUrl}`
    );
    return false;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from =
      process.env.NEWSLETTER_FROM_EMAIL ||
      process.env.BROADCAST_FROM_EMAIL ||
      "GTA 6 Atlas <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: "Confirm your GTA 6 Atlas newsletter subscription",
      text:
        `Thanks for signing up for GTA 6 Atlas updates!\n\n` +
        `Please confirm your subscription by clicking this link (valid for 24 hours):\n${confirmUrl}\n\n` +
        `If you didn't request this, you can safely ignore this email.`,
      html:
        `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">` +
        `<h2>Confirm your subscription</h2>` +
        `<p>Thanks for signing up for GTA 6 Atlas updates! Click the button below to confirm your email address (link valid for 24 hours).</p>` +
        `<p><a href="${confirmUrl}" style="display: inline-block; background: #C9A86A; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Confirm subscription</a></p>` +
        `<p style="font-size: 12px; color: #888;">If you didn't request this, you can safely ignore this email.</p>` +
        `</div>`,
    });
    if (error) {
      console.error("[newsletter] Resend error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[newsletter] Failed to send confirmation email:", err);
    return false;
  }
}

/**
 * Double opt-in newsletter signup:
 *  1. Validates + rate-limits the request.
 *  2. Stores a pending subscription with a 24h-expiring confirmation token.
 *  3. Sends a confirmation email — the address is ONLY added to the live
 *     subscriber list after the token link is clicked.
 */
export async function subscribeNewsletter(
  email: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-real-ip") ||
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (await peekRateLimit("newsletter-signup", ip, RATE_LIMIT_MAX)) {
      return { success: false, message: "Too many attempts. Please try again later." };
    }
    await recordRateLimitHit("newsletter-signup", ip, RATE_LIMIT_WINDOW_MS);

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || cleanEmail.length > 254 || !EMAIL_RE.test(cleanEmail)) {
      return { success: false, message: "Please provide a valid email address." };
    }

    const subscribers =
      (await getPrivateSetting<NewsletterSubscriber[]>(SUBSCRIBERS_KEY)) || [];
    if (subscribers.some((s) => s?.email === cleanEmail)) {
      return { success: true, message: "You're already subscribed." };
    }

    let pending = await purgeExpiredPending(await getPending());
    const existing = pending.find((p) => p.email === cleanEmail);
    if (existing) {
      // Re-send the confirmation email rather than creating a duplicate.
      const token = randomBytes(32).toString("hex");
      const tokenHash = hashToken(token);
      pending = pending.map((p) =>
        p.email === cleanEmail
          ? {
              ...p,
              token_hash: tokenHash,
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + CONFIRM_TOKEN_TTL_MS).toISOString(),
            }
          : p
      );
      await setPrivateSetting(PENDING_KEY, pending);
      await sendConfirmationEmail(cleanEmail, token);
      return { success: true, message: "Check your email to confirm your subscription." };
    }

    const token = randomBytes(32).toString("hex");
    const now = new Date();
    pending.push({
      email: cleanEmail,
      token_hash: hashToken(token),
      created_at: now.toISOString(),
      expires_at: new Date(now.getTime() + CONFIRM_TOKEN_TTL_MS).toISOString(),
    });
    await setPrivateSetting(PENDING_KEY, pending);
    await sendConfirmationEmail(cleanEmail, token);

    return { success: true, message: "Check your email to confirm your subscription." };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return { success: false, message: "Failed to subscribe. Please try again." };
  }
}

export type ConfirmResult = "confirmed" | "already" | "expired" | "invalid";

/**
 * Activate a pending subscription via its confirmation token.
 * Tokens are single-use and expire after 24 hours.
 */
export async function confirmNewsletterSubscription(
  token: string
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
        pending.filter((p) => p.token_hash !== entry.token_hash)
      );
      return { result: "expired" };
    }

    // Remove the pending entry (single-use) and add to subscribers.
    await setPrivateSetting(
      PENDING_KEY,
      pending.filter((p) => p.token_hash !== entry.token_hash)
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
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    await assertAdmin();
    return (await getPrivateSetting<NewsletterSubscriber[]>(SUBSCRIBERS_KEY)) || [];
  } catch (err) {
    console.error("Failed to get newsletter subscribers:", err);
  }
  return [];
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
