/**
 * Shared rate limiter with Redis (Upstash) backing and in-memory fallback.
 *
 * In-memory maps don't work across Vercel serverless instances — each
 * instance keeps its own counters, so a distributed attacker (or a normal
 * burst spread across instances) bypasses the limit. When
 * UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, counters live
 * in Redis via the Upstash REST API (no extra dependencies). When they are
 * not set, we fall back to the per-instance in-memory counters and log a
 * one-time warning so the misconfiguration is visible in logs.
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const redisEnabled = !!REDIS_URL && !!REDIS_TOKEN;

let warnedNoRedis = false;
function warnNoRedis() {
  if (!warnedNoRedis) {
    warnedNoRedis = true;
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN not set — " +
        "rate limiting is per-server-instance (in-memory). Set Upstash env vars in Vercel for production."
    );
  }
}

/* ------------------------------------------------------------------ */
/* In-memory fallback (per server instance)                            */
/* ------------------------------------------------------------------ */
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryIncrement(key: string, windowMs: number): number {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

function memoryPeek(key: string): number {
  const entry = memoryStore.get(key);
  if (!entry) return 0;
  if (Date.now() > entry.resetAt) {
    memoryStore.delete(key);
    return 0;
  }
  return entry.count;
}

/* ------------------------------------------------------------------ */
/* Redis (Upstash REST) backing                                         */
/* ------------------------------------------------------------------ */

/** Single-command pipeline: INCR key + set expiry only if new key. */
async function redisIncrement(key: string, windowMs: number): Promise<number | null> {
  try {
    const res = await fetch(`${REDIS_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        // PEXPIRE with NX: only set the TTL when the key was just created.
        ["PEXPIRE", key, windowMs, "NX"],
      ]),
    });
    if (!res.ok) {
      console.error("[rate-limit] Redis pipeline failed:", res.status);
      return null;
    }
    const data = (await res.json()) as Array<{ result?: number }>;
    const count = data?.[0]?.result;
    return typeof count === "number" ? count : null;
  } catch (err) {
    console.error("[rate-limit] Redis error, falling back to memory:", err);
    return null;
  }
}

async function redisPeek(key: string): Promise<number | null> {
  try {
    const res = await fetch(`${REDIS_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: string | null };
    const n = data?.result == null ? 0 : parseInt(String(data.result), 10);
    return Number.isNaN(n) ? 0 : n;
  } catch (err) {
    console.error("[rate-limit] Redis peek error, falling back to memory:", err);
    return null;
  }
}

function redisKey(name: string, identifier: string): string {
  // Sanitize: identifiers may contain IPs/paths; keep the key safe.
  const safe = identifier.replace(/[^a-zA-Z0-9.:_-]/g, "_").slice(0, 128);
  return `ratelimit:${name}:${safe}`;
}

/**
 * Increment the counter and return TRUE when the caller is over the limit
 * (i.e. should be rejected). Counts the current call.
 */
export async function isRateLimited(
  name: string,
  identifier: string,
  max: number,
  windowMs: number
): Promise<boolean> {
  const key = redisKey(name, identifier);
  if (redisEnabled) {
    const count = await redisIncrement(key, windowMs);
    if (count !== null) return count > max;
    // Redis failed: fall back to memory for this call.
    return memoryIncrement(key, windowMs) > max;
  }
  warnNoRedis();
  return memoryIncrement(key, windowMs) > max;
}

/**
 * Check WITHOUT incrementing: returns TRUE when the identifier is already
 * over the limit. Use when you only want to count specific outcomes
 * (e.g. failed login attempts) — call `recordRateLimitHit` for those.
 */
export async function peekRateLimit(
  name: string,
  identifier: string,
  max: number
): Promise<boolean> {
  const key = redisKey(name, identifier);
  if (redisEnabled) {
    const count = await redisPeek(key);
    if (count !== null) return count >= max;
    return memoryPeek(key) >= max;
  }
  warnNoRedis();
  return memoryPeek(key) >= max;
}

/**
 * Increment the counter without checking. Pair with `peekRateLimit` for
 * failure-only counting patterns (e.g. admin login).
 */
export async function recordRateLimitHit(
  name: string,
  identifier: string,
  windowMs: number
): Promise<void> {
  const key = redisKey(name, identifier);
  if (redisEnabled) {
    const count = await redisIncrement(key, windowMs);
    if (count !== null) return;
    memoryIncrement(key, windowMs);
    return;
  }
  warnNoRedis();
  memoryIncrement(key, windowMs);
}
