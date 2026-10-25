/**
 * session.ts — Edge-compatible HMAC session token management.
 * Signs and verifies admin session cookies cryptographically.
 * Works seamlessly in Next.js Middleware (Edge runtime), Route Handlers, and Server Actions.
 *
 * Revocation: every token embeds a `sessionVersion`. The current version is
 * stored in Supabase `site_settings` (key: "admin_session_version") and read
 * with a short in-memory cache. Bumping the version invalidates every
 * previously issued token within the cache TTL (see
 * /api/admin/revoke-sessions).
 */

/**
 * Resolves the HMAC signing secret. Fails closed: without ADMIN_SESSION_SECRET
 * sessions cannot be signed or verified. A hardcoded fallback would let anyone
 * forge admin cookies, and reusing SUPABASE_SERVICE_ROLE_KEY would rotate
 * sessions whenever the DB key rotates.
 */
function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your environment before using admin sessions."
    );
  }
  return secret;
}

/** Admin sessions expire 24 hours after login. */
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/** site_settings key holding the current admin session version. */
export const ADMIN_SESSION_VERSION_KEY = "admin_session_version";

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

async function signPayloadWith(secret: string, payload: string): Promise<string> {
  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return bufferToHex(signatureBuffer);
}

async function signPayload(payload: string): Promise<string> {
  return signPayloadWith(getSessionSecret(), payload);
}

/* ------------------------------------------------------------------ */
/* User sessions (dashboard lock).                                     */
/*                                                                     */
/* Same Edge-compatible HMAC scheme as admin sessions, but a separate  */
/* purpose prefix ("tg-user:") and a separate cookie, so a user token  */
/* can never validate as an admin token or vice versa.                 */
/*                                                                     */
/* Secret: USER_SESSION_SECRET is preferred. Until it is added to the  */
/* environment, ADMIN_SESSION_SECRET is reused — it is already a      */
/* strong server-only secret, and the purpose prefix keeps the two    */
/* token kinds cryptographically separated. Adding the dedicated     */
/* secret later is a hardening step, not a breakage fix.               */
/*                                                                     */
/* User sessions live 7 days. There is no server-side revocation list: */
/* a password reset does not instantly kill an already-issued cookie  */
/* (it expires within 7 days at most). The dashboard holds no         */
/* server-side private data — favorites/tracker are device-local — so  */
/* this window is accepted.                                           */
/* ------------------------------------------------------------------ */

/** Cookie carrying the signed user session. */
export const USER_SESSION_COOKIE = "tg_user_session";

/** User sessions expire 7 days after issue. */
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export const USER_SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function userSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: USER_SESSION_MAX_AGE_SECONDS,
  };
}

function getUserSessionSecret(): string {
  const secret = process.env.USER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "USER_SESSION_SECRET (or ADMIN_SESSION_SECRET) is not set. Add it to your environment before using user sessions."
    );
  }
  return secret;
}

/** Creates a signed user session token for the dashboard gate. */
export async function createUserSessionToken(email: string): Promise<string> {
  const expiresAt = Date.now() + SEVEN_DAYS_MS;
  const payload = `tg-user:${email}:${expiresAt}`;
  const signature = await signPayloadWith(getUserSessionSecret(), payload);

  const tokenData = JSON.stringify({ email, expiresAt, signature });
  if (typeof Buffer !== "undefined") {
    return Buffer.from(tokenData).toString("base64");
  }
  return btoa(tokenData);
}

/** Verifies a user session token's signature and expiry. */
export async function verifyUserSessionToken(
  tokenString: string | undefined | null
): Promise<{ valid: boolean; email?: string }> {
  if (!tokenString) return { valid: false };

  try {
    const raw = typeof Buffer !== "undefined"
      ? Buffer.from(tokenString, "base64").toString("utf-8")
      : atob(tokenString);

    const { email, expiresAt, signature } = JSON.parse(raw);

    if (!email || !expiresAt || !signature) return { valid: false };
    if (Date.now() > Number(expiresAt)) return { valid: false };

    const payload = `tg-user:${email}:${expiresAt}`;
    const expectedSignature = await signPayloadWith(getUserSessionSecret(), payload);

    if (signature.length !== expectedSignature.length) return { valid: false };

    let mismatch = 0;
    for (let i = 0; i < signature.length; i++) {
      mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }

    if (mismatch === 0) {
      return { valid: true, email };
    }
  } catch {
    // Malformed token, invalid JSON, or invalid Base64
  }

  return { valid: false };
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 * The current session version is embedded so tokens can be revoked by
 * bumping the version (see /api/admin/revoke-sessions).
 */
export async function createAdminSessionToken(
  email: string,
  sessionVersion = 0
): Promise<string> {
  const expiresAt = Date.now() + TWENTY_FOUR_HOURS_MS;
  const version = Number.isFinite(sessionVersion) ? Math.floor(sessionVersion) : 0;
  const payload = `${email}:${expiresAt}:${version}`;
  const signature = await signPayload(payload);

  const tokenData = JSON.stringify({ email, expiresAt, version, signature });
  // Buffer or btoa depending on environment
  if (typeof Buffer !== "undefined") {
    return Buffer.from(tokenData).toString("base64");
  }
  return btoa(tokenData);
}

/**
 * Verifies the authenticity, signature, expiration, and session version of
 * the token.
 *
 * Pass `expectedVersion` (from getCurrentSessionVersion()) to enforce
 * revocation: tokens issued before the version was bumped are rejected.
 * Omit it only when the version could not be confirmed (e.g. the database
 * is unreachable) — in that case HMAC signature and expiry are still
 * enforced.
 */
export async function verifyAdminSessionToken(
  tokenString: string | undefined | null,
  expectedVersion?: number
): Promise<{ valid: boolean; email?: string }> {
  if (!tokenString) return { valid: false };

  try {
    const raw = typeof Buffer !== "undefined"
      ? Buffer.from(tokenString, "base64").toString("utf-8")
      : atob(tokenString);

    const { email, expiresAt, version, signature } = JSON.parse(raw);

    if (!email || !expiresAt || !signature) return { valid: false };
    if (Date.now() > Number(expiresAt)) return { valid: false };

    // Tokens issued before versions existed carry no version field.
    const tokenVersion = typeof version === "number" ? version : -1;
    if (expectedVersion !== undefined && tokenVersion < expectedVersion) {
      return { valid: false };
    }

    // Reconstruct the payload exactly as it was signed at issue time.
    const payload =
      version === undefined
        ? `${email}:${expiresAt}`
        : `${email}:${expiresAt}:${tokenVersion}`;
    const expectedSignature = await signPayload(payload);

    if (signature.length !== expectedSignature.length) return { valid: false };

    // Constant-time comparison to prevent timing attacks
    let mismatch = 0;
    for (let i = 0; i < signature.length; i++) {
      mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }

    if (mismatch === 0) {
      return { valid: true, email };
    }
  } catch {
    // Malformed token, invalid JSON, or invalid Base64
  }

  return { valid: false };
}

/**
 * Reads the current admin session version from Supabase with a short
 * in-memory cache (Edge-compatible: plain REST fetch).
 *
 * `confirmed` is false only when the database could not be reached AND no
 * cached value exists yet — callers then skip the version check (fail open
 * for availability) while HMAC and expiry are still enforced. Once a value
 * has been fetched successfully it keeps being enforced even through later
 * outages.
 */
const SESSION_VERSION_CACHE_TTL_MS = 15_000;
let sessionVersionCache: { version: number; fetchedAt: number } | null = null;

export function clearSessionVersionCache(): void {
  sessionVersionCache = null;
}

export async function getCurrentSessionVersion(): Promise<{
  version: number;
  confirmed: boolean;
}> {
  if (
    sessionVersionCache &&
    Date.now() - sessionVersionCache.fetchedAt < SESSION_VERSION_CACHE_TTL_MS
  ) {
    return { version: sessionVersionCache.version, confirmed: true };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_settings?select=value&key=eq.${ADMIN_SESSION_VERSION_KEY}`,
      {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "" },
        // Never let a slow CMS outage hang admin auth; fail fast.
        signal: AbortSignal.timeout(2000),
      }
    );
    if (!res.ok) throw new Error(`site_settings fetch failed: ${res.status}`);
    const rows = (await res.json()) as { value: string }[];
    const parsed = parseInt(rows[0]?.value ?? "0", 10);
    const version = Number.isFinite(parsed) ? parsed : 0;
    sessionVersionCache = { version, fetchedAt: Date.now() };
    return { version, confirmed: true };
  } catch {
    return {
      version: sessionVersionCache?.version ?? 0,
      confirmed: sessionVersionCache !== null,
    };
  }
}
