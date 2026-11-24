import { newsletterUnsubscribeUrl } from "@/lib/newsletter-tokens";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createHash } from "node:crypto";
import type { NewsletterSubscriber } from "@/lib/services/newsletter";
import { getPrivateSetting } from "@/lib/services/private-settings";
import { getSiteSettings } from "@/lib/services/settings";

export const dynamic = "force-dynamic";

/**
 * GET /api/launch-reminder
 * Sends GTA 6 launch day reminder to all newsletter subscribers.
 *
 * Daily Vercel Cron check; sends only on the confirmed release date from site
 * settings (UTC). Past dates are skipped, never replayed as a catch-up blast.
 * Requires CRON_SECRET and RESEND_API_KEY. No browser admin session is needed.
 */
export async function GET(request: Request) {
  // Verify cron secret (prevents unauthorized triggers)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "Cron authentication is not configured" }, { status: 503 });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSiteSettings();
    const release = new Date(settings.targetReleaseDate);
    if (settings.isReleaseDateConfirmed !== true || !Number.isFinite(release.getTime())) {
      return NextResponse.json({ message: "No confirmed release date configured" });
    }
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const launchDate = release.toISOString().slice(0, 10);
    if (today !== launchDate) {
      return NextResponse.json({
        message: today > launchDate ? "Launch day has passed; no reminders sent" : "Not launch day yet",
        date: now.toISOString(),
        launchDate,
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }
    // The bearer secret above is this job's authorization. The admin UI reader
    // requires cookies and swallows auth/storage errors as [], so do not use it.
    const subscribers = (await getPrivateSetting<NewsletterSubscriber[]>("newsletter_subscribers")) || [];
    if (!Array.isArray(subscribers) || subscribers.some((sub) =>
      !sub || typeof sub.email !== "string" || typeof sub.subscribed_at !== "string"
    )) throw new Error("Invalid newsletter subscriber storage");
    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers to notify" });
    }

    const resend = new Resend(apiKey);
    const from =
      process.env.BROADCAST_FROM_EMAIL ||
      "Taish Gaming <onboarding@resend.dev>";

    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      try {
        const { data, error } = await resend.emails.send({
          from,
          to: sub.email,
          subject: "🎮 GTA 6 is OUT NOW — Your Atlas Awaits!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #C9A86A; text-align: center;">GTA 6 IS HERE!</h1>
              <p>Hey there,</p>
              <p>The wait is over! <strong>Grand Theft Auto VI</strong> has officially launched today, ${release.toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" })}.</p>
              <p>Your Taish Gaming is ready with:</p>
              <ul>
                <li>🗺️ Fan map and source reviews</li>
                <li>🚗 Editorial vehicle catalog</li>
                <li>🔫 Weapon evidence catalog</li>
                <li>💰 Illustrative planning calculators</li>
                <li>🎯 Tracker preview</li>
              </ul>
              <p style="text-align: center; margin: 30px 0;">
                <a href="https://www.taishgaming.com" style="background: #C9A86A; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explore the Atlas →</a>
              </p>
              <p>Welcome to Leonida!</p>
              <p style="color: #888; font-size: 12px;">You're receiving this because you signed up for Taish Gaming updates. <a href="${newsletterUnsubscribeUrl(sub.email, sub.subscribed_at)}">Unsubscribe</a></p>
            </div>
          `,
        }, {
          // Stable across same-day retries, without exposing addresses in keys.
          idempotencyKey: `launch-${launchDate}-${createHash("sha256").update(sub.email).digest("hex")}`,
        });
        if (error || !data?.id) throw new Error("Email provider did not accept reminder");
        sent++;
      } catch (err) {
        console.error(`Failed to send to ${sub.email}:`, err);
        failed++;
      }
    }

    return NextResponse.json({
      message: `Launch reminder sent to ${sent} subscribers (${failed} failed)`,
      sent,
      failed,
      total: subscribers.length,
    }, { status: failed ? 502 : 200 });
  } catch (err) {
    console.error("Launch reminder error:", err);
    return NextResponse.json(
      { error: "Failed to send reminders" },
      { status: 500 },
    );
  }
}
