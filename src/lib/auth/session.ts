/**
 * session.ts — Edge-compatible HMAC session token management.
 * Signs and verifies admin session cookies cryptographically.
 * Works seamlessly in Next.js Middleware (Edge runtime), Route Handlers, and Server Actions.
 */

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "gta6-atlas-super-secure-fallback-secret-2026";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

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

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 */
export async function createAdminSessionToken(email: string): Promise<string> {
  const expiresAt = Date.now() + SEVEN_DAYS_MS;
  const payload = `${email}:${expiresAt}`;
  const key = await getCryptoKey(SESSION_SECRET);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  const signature = bufferToHex(signatureBuffer);

  const tokenData = JSON.stringify({ email, expiresAt, signature });
  // Buffer or btoa depending on environment
  if (typeof Buffer !== "undefined") {
    return Buffer.from(tokenData).toString("base64");
  }
  return btoa(tokenData);
}

/**
 * Verifies the authenticity, signature, and expiration of the session token.
 */
export async function verifyAdminSessionToken(
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

    const payload = `${email}:${expiresAt}`;
    const key = await getCryptoKey(SESSION_SECRET);
    const expectedSigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payload)
    );
    const expectedSignature = bufferToHex(expectedSigBuffer);

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
