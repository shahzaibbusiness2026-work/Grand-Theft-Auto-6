import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUsername = (body.username || body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    // Authorized credentials requested by user
    const isPasswordMatch =
      password.toLowerCase() === "admin12345" ||
      password === "Admin12345!" ||
      password === "jackleofiona@2026";

    const isAuthorizedUsername =
      rawUsername === "shahzaib@gta6.com" ||
      rawUsername === "shahzaib@gta6" ||
      rawUsername === "admin@gta6.com" ||
      rawUsername === "admin@gta6" ||
      rawUsername === "admin@gta6atlas.com";

    const isMasterAdmin = isAuthorizedUsername && isPasswordMatch;

    if (isMasterAdmin) {
      const cookieStore = await cookies();
      cookieStore.set("gta6_admin_session", "true", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Try syncing with Supabase Auth if online
      try {
        const supabase = await createClient();
        await supabase.auth.signInWithPassword({
          email: rawUsername.includes("@") && rawUsername.includes(".") ? rawUsername : `${rawUsername}.com`,
          password,
        });
      } catch {
        // Supabase offline/unreachable - continue with verified cookie session
      }

      return NextResponse.json({ success: true, user: { email: rawUsername, role: "admin" } });
    }

    // Attempt Supabase Auth as secondary check
    try {
      const supabase = await createClient();
      const emailToTry = rawUsername.includes("@") && rawUsername.includes(".") ? rawUsername : `${rawUsername}.com`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToTry,
        password,
      });

      if (!error && data.session) {
        const cookieStore = await cookies();
        cookieStore.set("gta6_admin_session", "true", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
        return NextResponse.json({ success: true, user: data.user });
      }
    } catch {
      // Supabase unavailable
    }

    return NextResponse.json(
      { success: false, error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal authentication error" },
      { status: 500 }
    );
  }
}
