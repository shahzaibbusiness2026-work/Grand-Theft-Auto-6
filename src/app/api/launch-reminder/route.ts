import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getNewsletterSubscribers } from "@/lib/services/newsletter";

export const dynamic = "force-dynamic";

/**
 * GET /api/launch-reminder
 * Sends GTA 6 launch day reminder to all newsletter subscribers.
 * 
 * Triggered by Vercel Cron on Nov 19, 2026 (and daily check).
 * Only sends on Nov 19, 2026 (UTC). Other days return "not launch day".
 * 
 * Requires RESEND_API_KEY env var.
 */
export async function GET(request: Request) {
  // Verify cron secret (prevents unauthorized triggers)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only send on launch day (Nov 19, 2026 UTC)
  const now = new Date();
  const isLaunchDay = now.getUTCFullYear() === 2026 && 
                      now.getUTCMonth() === 10 && // 0-indexed: 10 = November
                      now.getUTCDate() === 19;

  if (!isLaunchDay) {
    return NextResponse.json({ 
      message: "Not launch day yet", 
      date: now.toISOString(),
      launchDate: "2026-11-19" 
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured. Set RESEND_API_KEY in Vercel." },
      { status: 503 }
    );
  }

  try {
    const subscribers = await getNewsletterSubscribers();
    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers to notify" });
    }

    const resend = new Resend(apiKey);
    const from = process.env.BROADCAST_FROM_EMAIL || "PixelSpot Gaming <onboarding@resend.dev>";
    
    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      try {
        await resend.emails.send({
          from,
          to: sub.email,
          subject: "🎮 GTA 6 is OUT NOW — Your Atlas Awaits!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #C9A86A; text-align: center;">GTA 6 IS HERE!</h1>
              <p>Hey there,</p>
              <p>The wait is over! <strong>Grand Theft Auto VI</strong> has officially launched today, November 19, 2026.</p>
              <p>Your PixelSpot Gaming is ready with:</p>
              <ul>
                <li>🗺️ Interactive Leonida map with all locations</li>
                <li>🚗 106 vehicles database</li>
                <li>🔫 32 weapons with stats</li>
                <li>💰 Money-making guides</li>
                <li>🎯 100% completion tracker</li>
              </ul>
              <p style="text-align: center; margin: 30px 0;">
                <a href="https://grand-theft-auto-6-5ap5.vercel.app" style="background: #C9A86A; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explore the Atlas →</a>
              </p>
              <p>Welcome to Leonida!</p>
              <p style="color: #888; font-size: 12px;">You're receiving this because you signed up for PixelSpot Gaming updates. <a href="https://grand-theft-auto-6-5ap5.vercel.app/unsubscribe?email=${encodeURIComponent(sub.email)}">Unsubscribe</a></p>
            </div>
          `,
        });
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
      total: subscribers.length
    });
  } catch (err) {
    console.error("Launch reminder error:", err);
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 });
  }
}
