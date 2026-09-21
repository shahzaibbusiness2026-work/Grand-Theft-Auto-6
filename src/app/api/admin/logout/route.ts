import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("gta6_admin_session", "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Supabase offline or no session
  }

  return NextResponse.json({ success: true });
}
