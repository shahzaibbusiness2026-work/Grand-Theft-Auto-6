import { Resend } from "resend";

/**
 * Shared Taish Gaming sender identity + transactional emails.
 *
 * All site mail uses ONE from-address so the sender always reads as
 * "Taish Gaming": BROADCAST_FROM_EMAIL when set in Vercel (a verified
 * domain address, e.g. "Taish Gaming <hello@taishgaming.com>"), otherwise
 * Resend's test address. Note: until a taishgaming.com domain is verified
 * in Resend, Resend's test mode only delivers to the Resend account's own
 * email — sends to other addresses fail at Resend, never at signup.
 */

export function taishFrom(): string {
  return (
    process.env.BROADCAST_FROM_EMAIL || "Taish Gaming <onboarding@resend.dev>"
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends the "you have successfully registered" email to a new account.
 * Never throws and never fails the caller: returns false when email is
 * unconfigured or Resend rejects the send (e.g. test-mode restrictions),
 * so signup always succeeds even if the welcome email cannot go out.
 */
export async function sendWelcomeEmail(
  email: string,
  firstName: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const name = (firstName || "").trim();
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const text =
    `${greeting}\n\n` +
    `You have successfully registered on Taish Gaming. Welcome aboard!\n\n` +
    `Your account is ready. You can now sign in and explore the GTA 6 Atlas — ` +
    `vehicles, weapons, map, tools and guides — ahead of the expected November 19, 2026 launch.\n\n` +
    `Sign in here: https://www.taishgaming.com/login\n\n` +
    `See you in Leonida,\nTeam Taish Gaming`;
  const htmlBody =
    `<!DOCTYPE html><html><body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">` +
    `<p>${escapeHtml(greeting)}</p>` +
    `<p><strong>You have successfully registered on Taish Gaming.</strong> Welcome aboard!</p>` +
    `<p>Your account is ready. You can now sign in and explore the GTA 6 Atlas — ` +
    `vehicles, weapons, map, tools and guides — ahead of the expected November 19, 2026 launch.</p>` +
    `<p><a href="https://www.taishgaming.com/login">Sign in to Taish Gaming</a></p>` +
    `<p>See you in Leonida,<br>Team Taish Gaming</p>` +
    `<hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">` +
    `<p style="font-size: 12px; color: #888;">This email confirms your registration on Taish Gaming.</p>` +
    `</body></html>`;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: taishFrom(),
      to: email,
      subject: "Welcome to Taish Gaming — you're registered!",
      text,
      html: htmlBody,
    });
    if (error) {
      console.error("Welcome email failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(
      "Welcome email failed:",
      err instanceof Error ? err.message : "send failed",
    );
    return false;
  }
}
