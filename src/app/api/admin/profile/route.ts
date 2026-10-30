import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function humanizeEmail(email: string): string {
  const localPart = email.split("@")[0] || "Admin";
  return localPart
    .replace(/[._+-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function GET() {
  try {
    const authorization = await assertAdmin();
    const sessionEmail = authorization.userId?.includes("@")
      ? authorization.userId.toLowerCase()
      : "";

    let email = sessionEmail;
    let metadataName = "";
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && (!sessionEmail || user.email.toLowerCase() === sessionEmail)) {
        email = user.email.toLowerCase();
        const metadata = user.user_metadata || {};
        const candidate = metadata.full_name || metadata.name || metadata.display_name;
        if (typeof candidate === "string" && candidate.trim() && candidate.trim().toLowerCase() !== "administrator") {
          metadataName = candidate.trim();
        }
      }
    } catch {
      // The signed admin session remains the identity source if the optional
      // Supabase profile lookup is unavailable.
    }

    if (!email) {
      return NextResponse.json({ success: false, error: "Admin email unavailable." }, { status: 503 });
    }

    const displayName = metadataName || process.env.ADMIN_DISPLAY_NAME?.trim() || humanizeEmail(email);
    return NextResponse.json({ success: true, user: { name: displayName, email, role: "Site admin" } }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
}
