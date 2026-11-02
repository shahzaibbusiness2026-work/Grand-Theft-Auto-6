import "server-only";
import { randomBytes, createHash } from "crypto";
import { Resend } from "resend";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AccountRow } from "./accounts";
import { taishFrom } from "@/lib/email";
import { canonicalOrigin } from "@/lib/site-identity";

export type AccountLinkPurpose = "verify" | "reset";
export const accountTokenKey = (token: string) =>
  `player_token:${createHash("sha256").update(token).digest("hex")}`;
export async function sendAccountLink(
  supabase: SupabaseClient,
  account: AccountRow,
  purpose: AccountLinkPurpose,
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false;
  const token = randomBytes(32).toString("hex");
  const key = accountTokenKey(token);
  const { error } = await supabase
    .from("private_settings")
    .insert({
      key,
      value: {
        email: account.email,
        purpose,
        version: account.session_version ?? 0,
        expiresAt: Date.now() + 30 * 60 * 1000,
      },
    });
  if (error) throw new Error("Could not create account link.");
  const link = new URL("/account-link", canonicalOrigin());
  link.searchParams.set("token", token);
  link.searchParams.set("purpose", purpose);
  const label =
    purpose === "verify"
      ? "Verify your email address"
      : "Reset your Taish Gaming password";
  try {
    const { error: sendError } = await new Resend(
      process.env.RESEND_API_KEY,
    ).emails.send({
      from: taishFrom(),
      to: account.email,
      subject: label,
      text: `${label}\n\nOpen this link to continue: ${link.toString()}\n\nThis link expires in 30 minutes and can be used once. If you did not request this, ignore this message.`,
    });
    if (!sendError) return true;
  } catch {
    /* Failed delivery is reported honestly by the caller. */
  }
  await supabase.from("private_settings").delete().eq("key", key);
  return false;
}
