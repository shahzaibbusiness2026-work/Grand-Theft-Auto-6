import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAccount } from "./accounts";
import { USER_SESSION_COOKIE, verifyUserSessionToken } from "./session";

export class PlayerError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** The owner is exclusively obtained from the verified session and existing private account. */
export async function requirePlayer() {
  const jar = await cookies();
  const session = await verifyUserSessionToken(
    jar.get(USER_SESSION_COOKIE)?.value,
  );
  if (!session.valid || !session.email)
    throw new PlayerError(401, "Please sign in to continue.");
  const supabase = createAdminClient();
  const account = await getAccount(supabase, session.email);
  if (
    !account ||
    account.email !== session.email.trim().toLowerCase() ||
    (account.session_version ?? 0) !== session.version
  )
    throw new PlayerError(
      401,
      "Your session has expired. Please sign in again.",
    );
  return { supabase, account, session };
}

export function requireSameOrigin(request: Request) {
  const url = new URL(request.url);
  let origin: URL;
  try {
    origin = new URL(request.headers.get("origin") || "");
  } catch {
    throw new PlayerError(403, "Request origin was not accepted.");
  }
  // Next may use its internal hostname in request.url behind a proxy. The
  // request Host still identifies the browser-facing origin; never trust a
  // caller-supplied account ID or accept a foreign Origin.
  const host = request.headers.get("host") || url.host;
  const protocol =
    process.env.NODE_ENV === "production" ? "https:" : url.protocol;
  if (
    origin.host !== host ||
    origin.protocol !== protocol ||
    origin.username ||
    origin.password
  )
    throw new PlayerError(403, "Request origin was not accepted.");
}

export async function playerJsonBody(
  request: Request,
  maxBytes = 512_000,
): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new PlayerError(415, "Send JSON data.");
  const reader = request.body?.getReader();
  if (!reader) throw new PlayerError(400, "Request body is missing.");
  const decoder = new TextDecoder();
  let text = "";
  let size = 0;
  try {
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new PlayerError(413, "Data exceeds the 500 KB limit.");
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
    const data = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error();
    return data;
  } catch (error) {
    if (error instanceof PlayerError) throw error;
    throw new PlayerError(400, "Invalid JSON data.");
  }
}

export function privateJson(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store", Vary: "Cookie" },
  });
}
export function playerError(error: unknown) {
  if (error instanceof PlayerError)
    return privateJson({ ok: false, error: error.message }, error.status);
  console.error(
    "Player account request failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  return privateJson(
    {
      ok: false,
      error:
        "Account storage is temporarily unavailable. Your browser copy is preserved.",
    },
    503,
  );
}
export function publicPlayerProfile(
  account: Awaited<ReturnType<typeof requirePlayer>>["account"],
) {
  return {
    email: account.email,
    firstName: account.first_name || "",
    lastName: account.last_name || "",
    displayName: account.display_name || "",
    createdAt: account.created_at,
    hasPassword: !!account.password_hash,
    providers: account.auth_providers,
    marketingOptIn: account.marketing_opt_in === true,
    emailVerified: !!account.email_verified_at,
  };
}
