import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    hasEmails: !!process.env.ADMIN_MASTER_EMAILS,
    emailsLength: (process.env.ADMIN_MASTER_EMAILS || "").length,
    hasPassword: !!process.env.ADMIN_MASTER_PASSWORD,
    passwordLength: (process.env.ADMIN_MASTER_PASSWORD || "").length,
  });
}
