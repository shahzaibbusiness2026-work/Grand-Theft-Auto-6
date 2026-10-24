import { NextResponse, type NextRequest } from "next/server";

/**
 * Frame protection for every route EXCEPT the public /embed/* routes: the
 * countdown widget hands out iframe code for /embed/countdown, and a DENY
 * would render it blank everywhere it is embedded. The exemption is a plain
 * pathname check in code (no lookahead regex) so it cannot silently fail.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/embed/")) return res;
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Content-Security-Policy", "frame-ancestors 'none';");
  return res;
}

export const config = {
  matcher: ["/:path*"],
};
