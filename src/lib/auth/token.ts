/**
 * Client-side token helpers.
 * Stores the JWT in a cookie so Server Components can read it via next/headers.
 * Never import this in Server Components — use session.ts instead.
 */
"use client";

import { AUTH_COOKIE } from "@/lib/constants";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function saveToken(token: string): void {
  document.cookie = [
    `${AUTH_COOKIE}=${encodeURIComponent(token)}`,
    `path=/`,
    `max-age=${COOKIE_MAX_AGE}`,
    `SameSite=Lax`,
    // Secure in production — next/headers reads it server-side only
    ...(process.env.NODE_ENV === "production" ? ["Secure"] : []),
  ].join("; ");
}

export function clearToken(): void {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getToken(): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}
