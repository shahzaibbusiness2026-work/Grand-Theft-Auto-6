import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { peekRateLimit, recordRateLimitHit } from "@/lib/rate-limit";

/**
 * POST /api/account/profile
 *
 * Saves a site account (sign-in or first-time create) in the database.
 * One row per email in the service-role-only `private_settings` table
 * (key `user_account:<email>`) — the same private store newsletter
 * subscribers already live in. It is NEVER written to the anon-readable
 * `site_settings` table, and there is no fallback to it: a database
 * failure is reported, not silently downgraded to a public write.
 *
 * Body: { email: string, firstName?: string, lastName?: string }
 * Names are optional on sign-in (a returning login without names just
 * refreshes last_sign_in_at); on create the form always sends them.
 */
export const dynamic = "force-dynamic";

const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function parseStoredValue(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === "object") return raw as Record<string, unknown>;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>;
    } catch {
      // Not JSON — treat as no previous record.
    }
  }
  return {};
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (await peekRateLimit("account-profile", ip, RATE_LIMIT_MAX)) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Please try again in a few minutes." },
        { status: 429 }
      );
    }
    await recordRateLimitHit("account-profile", ip, RATE_LIMIT_WINDOW_MS);

    const body = await req.json().catch(() => null);
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const firstName =
      typeof body?.firstName === "string" ? body.firstName.trim() : "";
    const lastName =
      typeof body?.lastName === "string" ? body.lastName.trim() : "";

    if (
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    ) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (firstName.length > 80 || lastName.length > 80) {
      return NextResponse.json(
        { ok: false, error: "Names must be 80 characters or fewer." },
        { status: 400 }
      );
    }

    let supabase;
    try {
      supabase = createAdminClient();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Account saving is not configured on the server." },
        { status: 503 }
      );
    }

    const key = `user_account:${email}`;
    const now = new Date().toISOString();

    const { data: existing, error: readError } = await supabase
      .from("private_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (readError) {
      return NextResponse.json(
        { ok: false, error: "Could not save your account. Please try again." },
        { status: 500 }
      );
    }

    const prev = parseStoredValue(existing?.value);
    const prevFirst = typeof prev.first_name === "string" ? prev.first_name : "";
    const prevLast = typeof prev.last_name === "string" ? prev.last_name : "";
    const nextFirst = firstName || prevFirst;
    const nextLast = lastName || prevLast;
    const value = {
      email,
      first_name: nextFirst || null,
      last_name: nextLast || null,
      display_name: [nextFirst, nextLast].filter(Boolean).join(" ") || null,
      created_at:
        typeof prev.created_at === "string" ? prev.created_at : now,
      last_sign_in_at: now,
      sign_in_count:
        (typeof prev.sign_in_count === "number" ? prev.sign_in_count : 0) + 1,
    };

    const { error: upsertError } = await supabase
      .from("private_settings")
      .upsert(
        { key, value: JSON.stringify(value), updated_at: now },
        { onConflict: "key" }
      );
    if (upsertError) {
      return NextResponse.json(
        { ok: false, error: "Could not save your account. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not save your account. Please try again." },
      { status: 500 }
    );
  }
}
