import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

function encryptionKey(): Buffer {
  const encoded = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
  if (!encoded) throw new Error("GOOGLE_TOKEN_ENCRYPTION_KEY is not configured.");
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32) throw new Error("GOOGLE_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  return key;
}

export function encryptGoogleRefreshToken(token: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptGoogleRefreshToken(value: string): string {
  const [version, ivText, tagText, encryptedText] = value.split(".");
  if (version !== "v1" || !ivText || !tagText || !encryptedText) throw new Error("Stored Search Console credential is invalid.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export const SEARCH_CONSOLE_CREDENTIAL_KEY = "search_console_refresh_token";

export function googleOAuthConfig() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  const property = process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY;
  const encodedEncryptionKey = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
  const keyIsValid = !!encodedEncryptionKey && Buffer.from(encodedEncryptionKey, "base64").length === 32;
  const missing = [
    !clientId && "GOOGLE_OAUTH_CLIENT_ID",
    !clientSecret && "GOOGLE_OAUTH_CLIENT_SECRET",
    !redirectUri && "GOOGLE_OAUTH_REDIRECT_URI",
    !property && "GOOGLE_SEARCH_CONSOLE_PROPERTY",
    !keyIsValid && "GOOGLE_TOKEN_ENCRYPTION_KEY (base64-encoded 32-byte key)",
  ].filter(Boolean) as string[];
  return { clientId, clientSecret, redirectUri, property, missing };
}
