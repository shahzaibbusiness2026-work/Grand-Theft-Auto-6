import { NextResponse } from "next/server";
import { Resend } from "resend";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/messages/reply
 * Sends a reply to a contact-form submitter via Resend and marks the
 * message "handled" in the contact_messages table.
 *
 * Body: { messageId: string, subject: string, message: string }
 *
 * Requires admin session. Same-origin only. Single recipient — never a list.
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

  // CSRF defense-in-depth: same-origin requests only.
  const host = req.headers.get("host") || "";
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const sameOrigin = (v: string | null) => {
    if (!v) return false;
    try {
      return new URL(v).host === host;
    } catch {
      return false;
    }
  };
  if (origin ? !sameOrigin(origin) : !sameOrigin(referer)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { messageId?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messageId, subject, message } = body;
  if (!messageId || !subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "messageId, subject and message are all required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data: contact, error: fetchError } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject")
    .eq("id", messageId)
    .maybeSingle();

  if (fetchError || !contact) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const htmlBody = message
    .split("\n")
    .map((line) => (line.trim() === "" ? "<br>" : `<p>${escapeHtml(line)}</p>`))
    .join("");
  const html = `<!DOCTYPE html><html><body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">${htmlBody}<hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;"><p style="font-size: 12px; color: #888;">Re: your message to Taish Gaming. This is a reply to your contact-form enquiry.</p></body></html>`;

  const resend = new Resend(apiKey);
  const from = process.env.BROADCAST_FROM_EMAIL || "Taish Gaming <onboarding@resend.dev>";
  const { error: sendError } = await resend.emails.send({
    from,
    to: [contact.email],
    subject: subject.trim(),
    html,
    replyTo: from,
  });

  if (sendError) {
    return NextResponse.json(
      { error: `Email failed to send: ${sendError.message || "unknown error"}` },
      { status: 502 }
    );
  }

  // Mark the message handled so the dashboard reflects it.
  await supabase.from("contact_messages").update({ status: "handled" }).eq("id", messageId);

  return NextResponse.json({ success: true, to: contact.email });
}
