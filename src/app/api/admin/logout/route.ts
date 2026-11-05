import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { PlayerError, requireSameOrigin } from "@/lib/auth/player-account";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: error instanceof PlayerError ? error.status : 403 });
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
  } catch {
    return NextResponse.json({ success: false, error: "Could not complete sign out. Please try again." }, { status: 503 });
  }
  const cookieStore = await cookies();
  cookieStore.set("gta6_admin_session", "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
