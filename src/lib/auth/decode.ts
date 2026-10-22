/**
 * Decode a JWT payload without verification (client-side only).
 * We trust the token content for UI routing — the server enforces auth.
 */
import type { JwtPayload } from "@/types/auth";

export function decodeToken(token: string): JwtPayload | null {
  try {
    const [, payloadB64] = token.split(".");
    const json = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}
