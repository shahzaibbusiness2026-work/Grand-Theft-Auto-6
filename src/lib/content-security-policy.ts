/** Staged resource policy. Collect violations before enforcing script rules. */
export const reportOnlyCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://www.youtube.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://plausible.io https://*.googlesyndication.com https://*.doubleclick.net",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://*.doubleclick.net https://*.googlesyndication.com",
  "media-src 'self' blob: https:",
  "worker-src 'self' blob:",
  "report-uri /api/csp-report",
].join("; ");
