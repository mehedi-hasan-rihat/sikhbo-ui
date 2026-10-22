/**
 * proxy.ts — Next.js 16 route guard (replaces middleware.ts).
 * Exported function must be named `proxy`.
 *
 * Checks only for cookie presence (fast, no network call).
 * Full role enforcement happens in each protected layout via requireRole().
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, ROUTES } from "@/lib/constants";

const PROTECTED = ["/student", "/mentor"];
const AUTH_PAGES = [ROUTES.login, ROUTES.signup];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(AUTH_COOKIE);

  // Already signed in — redirect away from auth pages
  if (AUTH_PAGES.includes(pathname as (typeof AUTH_PAGES)[number]) && hasSession) {
    return NextResponse.redirect(new URL(ROUTES.studentDashboard, request.url));
  }

  // Unauthenticated — redirect to login, preserve intended destination
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !hasSession) {
    const url = new URL(ROUTES.login, request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
