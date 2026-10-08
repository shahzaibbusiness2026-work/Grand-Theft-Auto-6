import { NextResponse } from "next/server";
import { Resend } from "resend";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { getNewsletterSubscribers } from "@/lib/services/newsletter";

/**
 * POST /api/admin/broadcast
 * Sends a launch announcement to all newsletter subscribers via Resend.
 *
 * Body: { subject: string, message: string }
 *
 * Requires:
 * - Admin session (assertAdmin)
 * - RESEND_API_KEY env var
 * - BROADCAST_FROM_EMAIL env var (or defaults to Resend's test address)
 *
 * Sends individually (not BCC) so each recipient gets a personal email
 * and no addresses leak to other subscribers.
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
      { status: 503 }
    );
  }

  let body: { subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();
  if (!subject || !message) {
    return NextResponse.json(
      { error: "Subject and message are required" },
      { status: 400 }
    );
  }
  if (subject.length > 200 || message.length > 10000) {
    return NextResponse.json(
      { error: "Subject or message too long" },
      { status: 400 }
    );
  }

  const subscribers = await getNewsletterSubscribers();
  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json(
      { error: "No subscribers to send to" },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);
  const from =
    process.env.BROADCAST_FROM_EMAIL || "GTA 6 Atlas <onboarding@resend.dev>";

  // Plain-text + simple HTML version of the message
  const htmlMessage = message
    .split("\n")
    .map((line) => line.trim() === "" ? "<br>" : `<p>${escapeHtml(line)}</p>`)
    .join("");

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  // Send individually to protect recipient privacy (no BCC leaks).
  // Resend free tier: 100 emails/day — fine for a launch list.
  for (const sub of subscribers) {
    try {
      const { error } = await resend.emails.send({
        from,
        to: sub.email,
        subject,
        text: message,
        html: `<!DOCTYPE html><html><body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">${htmlMessage}<hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;"><p style="font-size: 12px; color: #888;">You received this because you signed up for GTA 6 Atlas launch alerts.</p></body></html>`,
      });
      if (error) {
        failed++;
        errors.push(`${sub.email}: ${error.message}`);
      } else {
        sent++;
      }
    } catch (e) {
      failed++;
      errors.push(`${sub.email}: ${e instanceof Error ? e.message : "send failed"}`);
    }
  }

  return NextResponse.json({
    sent,
    failed,
    total: subscribers.length,
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
