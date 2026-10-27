import { createHmac, timingSafeEqual } from "node:crypto";
const PURPOSE = "taish-newsletter-unsubscribe-v1:";
function secret() {
  const key =
    process.env.NEWSLETTER_TOKEN_SECRET ||
    process.env.USER_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET;
  if (!key) throw new Error("Newsletter token secret unavailable");
  return key;
}
function signature(payload: string) {
  return createHmac("sha256", secret())
    .update(PURPOSE + payload)
    .digest();
}
export function newsletterToken(email: string, subscribedAt: string) {
  const payload = Buffer.from(
    JSON.stringify({ email: email.trim().toLowerCase(), subscribedAt }),
  ).toString("base64url");
  return payload + "." + signature(payload).toString("base64url");
}
export function verifyNewsletterToken(
  token: string,
): { email: string; subscribedAt: string } | null {
  try {
    if (!token || token.length > 2048) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const expected = signature(parts[0]),
      actual = Buffer.from(parts[1], "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      return null;
    const p = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    if (
      typeof p.email !== "string" ||
      p.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) ||
      typeof p.subscribedAt !== "string" ||
      !Number.isFinite(Date.parse(p.subscribedAt))
    )
      return null;
    return { email: p.email, subscribedAt: p.subscribedAt };
  } catch {
    return null;
  }
}
export function newsletterUnsubscribeUrl(email: string, subscribedAt: string) {
  return (
    "https://www.taishgaming.com/unsubscribe?token=" +
    encodeURIComponent(newsletterToken(email, subscribedAt))
  );
}
