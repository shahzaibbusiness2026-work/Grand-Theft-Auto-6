import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Site-account storage (server-only helpers).
 *
 * Accounts live as one row per email in the service-role-only
 * `private_settings` table (key `user_account:<email>`). Passwords are
 * NEVER stored in plain text — only a scrypt hash. Recovery codes are
 * NEVER stored in plain text — only a SHA-256 hash. Nothing here is ever
 * written to the anon-readable `site_settings` table.
 */

export interface AccountRow {
  email: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  password_hash: string | null;
  recovery_code_hash: string | null;
  /** OAuth providers linked to this account, e.g. ["google"]. Empty for email accounts. */
  auth_providers: string[];
  created_at: string;
  last_sign_in_at: string;
  sign_in_count: number;
}

export function accountKey(email: string): string {
  return `user_account:${email.trim().toLowerCase()}`;
}

export function validEmail(email: string): boolean {
  return (
    !!email &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  );
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [, salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const computed = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    return (
      computed.length === expected.length &&
      timingSafeEqual(computed, expected)
    );
  } catch {
    return false;
  }
}

/* Recovery code: 3 groups of 4 unambiguous characters, e.g. K7P2-Q9X4-M3Z8. */
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRecoveryCode(): string {
  const bytes = randomBytes(12);
  const groups: string[] = [];
  for (let g = 0; g < 3; g++) {
    let group = "";
    for (let i = 0; i < 4; i++) {
      group += CODE_CHARS[bytes[g * 4 + i] % CODE_CHARS.length];
    }
    groups.push(group);
  }
  return groups.join("-");
}

export function hashRecoveryCode(code: string): string {
  return createHash("sha256")
    .update(code.trim().toUpperCase())
    .digest("hex");
}

export function verifyRecoveryCode(code: string, storedHash: string): boolean {
  try {
    const computed = Buffer.from(hashRecoveryCode(code), "hex");
    const expected = Buffer.from(storedHash, "hex");
    return (
      computed.length === expected.length &&
      timingSafeEqual(computed, expected)
    );
  } catch {
    return false;
  }
}

function parseStoredValue(raw: unknown): Partial<AccountRow> {
  if (raw && typeof raw === "object") return raw as Partial<AccountRow>;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // Not JSON — treat as no previous record.
    }
  }
  return {};
}

export function normalizeAccount(prev: Partial<AccountRow>): AccountRow | null {
  if (!prev.email) return null;
  return {
    email: prev.email,
    first_name: typeof prev.first_name === "string" ? prev.first_name : null,
    last_name: typeof prev.last_name === "string" ? prev.last_name : null,
    display_name:
      typeof prev.display_name === "string" ? prev.display_name : null,
    password_hash:
      typeof prev.password_hash === "string" ? prev.password_hash : null,
    recovery_code_hash:
      typeof prev.recovery_code_hash === "string"
        ? prev.recovery_code_hash
        : null,
    auth_providers: Array.isArray(prev.auth_providers)
      ? prev.auth_providers.filter((p): p is string => typeof p === "string")
      : [],
    created_at:
      typeof prev.created_at === "string"
        ? prev.created_at
        : new Date().toISOString(),
    last_sign_in_at:
      typeof prev.last_sign_in_at === "string"
        ? prev.last_sign_in_at
        : new Date().toISOString(),
    sign_in_count:
      typeof prev.sign_in_count === "number" ? prev.sign_in_count : 0,
  };
}

export async function getAccount(
  supabase: SupabaseClient,
  email: string
): Promise<AccountRow | null> {
  const { data, error } = await supabase
    .from("private_settings")
    .select("value")
    .eq("key", accountKey(email))
    .maybeSingle();
  if (error || !data) return null;
  return normalizeAccount(parseStoredValue(data.value));
}

/**
 * Every registered site account (email signup, email login rows, and
 * OAuth rows) — used so admin broadcasts can reach all registered users,
 * not just newsletter subscribers. Paginated past the API's row cap.
 */
export async function getAllAccounts(
  supabase: SupabaseClient
): Promise<AccountRow[]> {
  const rows: AccountRow[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("private_settings")
      .select("value")
      .like("key", "user_account:%")
      .range(from, from + PAGE - 1);
    if (error || !data || data.length === 0) break;
    for (const row of data) {
      const parsed = normalizeAccount(
        parseStoredValue((row as { value: unknown }).value)
      );
      if (parsed) rows.push(parsed);
    }
    if (data.length < PAGE) break;
  }
  return rows;
}

export async function saveAccount(
  supabase: SupabaseClient,
  row: AccountRow
): Promise<boolean> {
  const { error } = await supabase.from("private_settings").upsert(
    {
      key: accountKey(row.email),
      value: JSON.stringify(row),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );
  return !error;
}
