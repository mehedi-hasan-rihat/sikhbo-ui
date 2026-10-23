/**
 * Server-side session helper — Server Components, layouts, proxy.ts only.
 * Reads the JWT cookie and verifies it via GET /auth/me.
 */
import { cookies } from "next/headers";
import { API_BASE_URL, AUTH_COOKIE } from "@/lib/constants";
import type { User, MeResponse } from "@/types/auth";

export async function getSession(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const body: MeResponse = await res.json();
    return body.data ?? null;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<User> {
  const { redirect } = await import("next/navigation");
  const user = await getSession();
  if (!user) redirect("/login");
  return user!;
}

export async function requireRole(role: "STUDENT" | "MENTOR"): Promise<User> {
  const { redirect } = await import("next/navigation");
  const user = await getSession();
  if (!user) redirect("/login");
  const u = user!;
  if (u.role !== role) {
    redirect(u.role === "MENTOR" ? "/mentor/submissions" : "/student/submissions");
  }
  return u;
}
