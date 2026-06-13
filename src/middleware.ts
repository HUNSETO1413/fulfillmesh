import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

// Edge middleware: gate the dashboard AND the data API behind a valid signed
// session cookie, and keep authenticated users out of the auth screens. Only the
// stateless token is verified here (Web Crypto) — no database access, which is
// unavailable on Edge.

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

// API routes that may be called without an authenticated session.
const PUBLIC_API = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/forms/contact",
  "/api/forms/demo",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect all data API routes except the explicitly public ones.
  if (pathname.startsWith("/api/") && !PUBLIC_API.includes(pathname)) {
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (AUTH_PAGES.includes(pathname) && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
