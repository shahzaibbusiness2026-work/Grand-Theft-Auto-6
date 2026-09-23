import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Admin login endpoint.
 * Supports Supabase Auth and master admin credentials with auto-provisioning.
 * On success, sets an httpOnly server cookie for middleware auth checks.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUsername = (body.username || body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    if (!rawUsername || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const email = rawUsername.includes("@") && rawUsername.includes(".")
      ? rawUsername
      : `${rawUsername.replace(/@.*$/, "")}@gta6.com`;

    const isMasterPassword =
      password.toLowerCase() === "admin12345" ||
      password === "Admin12345!" ||
      password === "jackleofiona@2026";

    const isMasterUsername =
      rawUsername === "admin@gta6.com" ||
      rawUsername === "admin@gta6" ||
      rawUsername === "shahzaib@gta6.com" ||
      rawUsername === "shahzaib@gta6" ||
      rawUsername === "admin@gta6atlas.com" ||
      rawUsername === "admin";

    const isMasterAdmin = isMasterUsername && isMasterPassword;

    // 1. Try signing in directly via Supabase Auth
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
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

        return NextResponse.json({
          success: true,
          user: { email: data.user?.email || email, role: "admin" },
        });
      }
    } catch {
      // Continue to master admin check if Supabase Auth client had an error
    }

    // 2. If credentials match authorized master admin
    if (isMasterAdmin) {
      // Ensure user exists in Supabase Auth for future auth calls
      try {
        const adminClient = createAdminClient();
        await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { role: "admin", name: "Administrator" },
        });
      } catch {
        // User may already exist or Supabase auth already provisioned
      }

      const cookieStore = await cookies();
      cookieStore.set("gta6_admin_session", "true", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({
        success: true,
        user: { email, role: "admin" },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal authentication error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
