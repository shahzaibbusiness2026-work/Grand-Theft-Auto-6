import { NextResponse } from "next/server";

/**
 * Frame protection lives here (not in next.config headers) so the public
 * /embed/* routes stay frameable: the countdown widget hands out iframe
 * code for /embed/countdown, and a global DENY would render it blank
 * everywhere it is embedded.
 */
export function middleware() {
  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Content-Security-Policy", "frame-ancestors 'none';");
  return res;
}

export const config = {
  matcher: ["/((?!embed|_next/static|_next/image|favicon.ico).*)"],
};
