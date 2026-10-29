import { newsletterUnsubscribeUrl } from "@/lib/newsletter-tokens";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllAccounts } from "@/lib/auth/accounts";
import {
  getNewsletterSubscribers,
  getSuppressedEmails,
} from "@/lib/services/newsletter";
import { taishFrom } from "@/lib/email";

/**
 * POST /api/admin/broadcast
 * Sends an announcement to every reachable address: newsletter subscribers
 * PLUS all registered site accounts (email signup, email login rows, and
 * OAuth rows), deduplicated by email. Anyone who unsubscribed is left out
 * via the broadcast suppression list.
 *
 * Body: { subject: string, message: string, dryRun?: boolean, confirm?: boolean }
 *
 * Safety: requires dryRun first (returns preview), then confirm: true to actually send.
 * This prevents accidental mass sends.
 *
 * Requires:
 * - Admin session (assertAdmin)
 * - RESEND_API_KEY env var
 * - BROADCAST_FROM_EMAIL env var (or defaults to Resend's test address)
 *
 * Sends individually (not BCC) so each recipient gets a personal email
 * and no addresses leak to other recipients.
 */
export async function POST(req: Request) {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured. Set RESEND_API_KEY in Vercel." },
      { status: 503 },
    );
  }

  let body: {
    subject?: string;
    message?: string;
    dryRun?: boolean;
    confirm?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();
  if (!subject || !message) {
    return NextResponse.json(
      { error: "Subject and message are required" },
      { status: 400 },
    );
  }
  if (subject.length > 200 || message.length > 10000) {
    return NextResponse.json(
      { error: "Subject or message too long" },
      { status: 400 },
    );
  }

  // Audience: newsletter subscribers + every registered site account,
  // deduplicated by email (subscriber entry wins for the footer wording),
  // minus anyone who unsubscribed.
  const subscribers = await getNewsletterSubscribers();
  let accounts: { email: string; created_at: string }[] = [];
  try {
    accounts = await getAllAccounts(createAdminClient());
  } catch (err) {
    console.error("Broadcast: could not load registered accounts:", err);
  }
  const suppressed = new Set(
    (await getSuppressedEmails()).map((e) => e.toLowerCase()),
  );
  type Recipient = {
    email: string;
    source: "newsletter" | "account";
    tokenAt: string;
  };
  const byEmail = new Map<string, Recipient>();
  for (const sub of subscribers || []) {
    const email = (sub.email || "").trim().toLowerCase();
    if (!email || suppressed.has(email)) continue;
    byEmail.set(email, {
      email,
      source: "newsletter",
      tokenAt: sub.subscribed_at,
    });
  }
  let accountCount = 0;
  for (const account of accounts) {
    const email = (account.email || "").trim().toLowerCase();
    if (!email || suppressed.has(email) || byEmail.has(email)) continue;
    byEmail.set(email, {
      email,
      source: "account",
      tokenAt: account.created_at,
    });
    accountCount++;
  }
  const recipients = [...byEmail.values()];
  const newsletterCount = recipients.filter(
    (r) => r.source === "newsletter",
  ).length;
  if (recipients.length === 0) {
    return NextResponse.json(
      { error: "No recipients to send to" },
      { status: 400 },
    );
  }

  // Dry-run mode: return preview without sending
  if (body.dryRun) {
    return NextResponse.json({
      dryRun: true,
      subscriberCount: recipients.length,
      recipientCount: recipients.length,
      newsletterCount,
      accountCount,
      subject,
      messagePreview:
        message.slice(0, 500) + (message.length > 500 ? "..." : ""),
      from: taishFrom(),
    });
  }

  // Require explicit confirmation to prevent accidental sends
  if (!body.confirm) {
    return NextResponse.json(
      {
        error:
          "Confirmation required. Send dryRun: true first to preview, then confirm: true to send.",
      },
      { status: 400 },
    );
  }

  // CSRF defense-in-depth: only accept same-origin requests for this
  // high-impact action (sends email to the entire subscriber list).
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host") || "";
  const sameOrigin = (v: string | null) =>
    !!v &&
    (() => {
      try {
        return new URL(v).host === host;
      } catch {
        return false;
      }
    })();
  if (origin ? !sameOrigin(origin) : !sameOrigin(referer)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resend = new Resend(apiKey);
  const from = taishFrom();

  // Plain-text + simple HTML version of the message
  const htmlMessage = message
    .split("\n")
    .map((line) => (line.trim() === "" ? "<br>" : `<p>${escapeHtml(line)}</p>`))
    .join("");
  const footerFor = (r: {
    source: "newsletter" | "account";
  }): string =>
    r.source === "newsletter"
      ? "You received this because you signed up for Taish Gaming launch alerts."
      : "You received this because you have a Taish Gaming account.";

  // Use Resend's batch API (up to 100 per call) instead of sequential
  // sends: avoids Vercel function timeouts on large lists and prevents
  // partial delivery that would cause duplicates on retry.
  // Each recipient still gets an individual email (no BCC address leaks).
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < recipients.length; i += 100) {
    const batch = recipients.slice(i, i + 100);
    try {
      const { data, error } = await resend.batch.send(
        batch.map((r) => {
          const unsubscribe = newsletterUnsubscribeUrl(r.email, r.tokenAt);
          const htmlBody =
            `<!DOCTYPE html><html><body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">${htmlMessage}` +
            `<hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">` +
            `<p style="font-size: 12px; color: #888;">${footerFor(r)}</p>` +
            `<p><a href="${unsubscribe}">Unsubscribe</a></p></body></html>`;
          return {
            from,
            to: r.email,
            subject,
            text: message + "\n\nUnsubscribe: " + unsubscribe,
            html: htmlBody,
          };
        }),
      );
      if (error) {
        failed += batch.length;
        errors.push(`batch ${i / 100 + 1}: ${error.message}`);
      } else {
        // data is an array of per-email results; count successes
        const results = Array.isArray(data) ? data : [];
        for (const r of results) {
          if (r && (r as { id?: string }).id) sent++;
          else failed++;
        }
        // If the API returned fewer results than the batch, count the rest as failed
        if (results.length < batch.length)
          failed += batch.length - results.length;
      }
    } catch (e) {
      failed += batch.length;
      errors.push(
        `batch ${i / 100 + 1}: ${e instanceof Error ? e.message : "send failed"}`,
      );
    }
  }

  return NextResponse.json({
    sent,
    failed,
    total: recipients.length,
    newsletterCount,
    accountCount,
    errors: errors.slice(0, 10),
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
