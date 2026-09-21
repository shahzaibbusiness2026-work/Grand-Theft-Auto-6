import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin login via Supabase Auth only.
 * On success, sets an httpOnly server cookie for middleware auth checks.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.username || body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Single source of truth: Supabase Auth
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Set httpOnly server-side cookie for middleware to verify
    const cookieStore = await cookies();
    cookieStore.set("gta6_admin_session", "true", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: { email: data.user?.email, role: "admin" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal authentication error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
