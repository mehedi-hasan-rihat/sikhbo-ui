/**
 * Auth service — runs in Client Components only.
 */
import { API_BASE_URL } from "@/lib/constants";
import { saveToken, clearToken } from "@/lib/auth/token";
import type { LoginInput, SignupInput } from "@/features/auth/schemas";
import type { ApiError } from "@/types/api";
import type { AuthTokenResponse } from "@/types/auth";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let e: Partial<ApiError> = {};
    try { e = await res.json(); } catch { /* ignore */ }
    throw { status: res.status, message: e.message ?? "Unexpected error", errors: e.errors } satisfies ApiError;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function authedPost(path: string, token: string): Promise<void> {
  await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

/** POST /auth/login → saves token cookie, returns raw response */
export async function login(data: LoginInput): Promise<AuthTokenResponse> {
  const res = await post<AuthTokenResponse>("/auth/login", data);
  saveToken(res.data.token);
  return res;
}

/** POST /auth/register → saves token cookie, returns raw response */
export async function register(data: SignupInput): Promise<AuthTokenResponse> {
  const res = await post<AuthTokenResponse>("/auth/register", data);
  saveToken(res.data.token);
  return res;
}

/** POST /auth/logout → clears token cookie */
export async function logout(): Promise<void> {
  const { getToken } = await import("@/lib/auth/token");
  const token = getToken();
  if (token) {
    // Best-effort server-side invalidation — ignore errors
    await authedPost("/auth/logout", token).catch(() => {});
  }
  clearToken();
}
