/**
 * Centralized API client.
 *
 * - Server-side (Server Components, Route Handlers): reads the JWT from the
 *   Next.js cookie store and adds Authorization: Bearer <token>.
 * - Client-side (Client Components): reads the JWT cookie via document.cookie.
 *
 * Never import server-only APIs (next/headers) at the top level — they are
 * imported dynamically inside getToken() so this module is safe to use in
 * both environments.
 */
import { API_BASE_URL, API_TIMEOUT_MS, AUTH_COOKIE } from "@/lib/constants";
import type { ApiError } from "@/types/api";

type QueryParams = Record<string, string | number | boolean | undefined>;

// ── Token helpers ─────────────────────────────────────────────────────────────

/** Read the JWT from the Next.js cookie store (server-side only). */
async function getServerToken(): Promise<string | null> {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return store.get(AUTH_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

/** Read the JWT from document.cookie (browser only). */
function getClientToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

async function getToken(): Promise<string | null> {
  if (typeof window === "undefined") return getServerToken();
  return getClientToken();
}

// ── Core request ──────────────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: QueryParams,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      let errorBody: Partial<ApiError> = {};
      try { errorBody = await response.json(); } catch { /* ignore */ }
      throw {
        status:  response.status,
        message: errorBody.message ?? "An unexpected error occurred",
        errors:  errorBody.errors,
      } satisfies ApiError;
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw { status: 408, message: "Request timed out" } satisfies ApiError;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Public client (no auth header, for login/register) ───────────────────────

export const publicClient = {
  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>("POST", path, body);
  },
};

// ── Authenticated client ──────────────────────────────────────────────────────

export const apiClient = {
  get<T>(path: string, params?: QueryParams): Promise<T> {
    return request<T>("GET", path, undefined, params);
  },
  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>("POST", path, body);
  },
  patch<T>(path: string, body: unknown): Promise<T> {
    return request<T>("PATCH", path, body);
  },
  delete<T>(path: string): Promise<T> {
    return request<T>("DELETE", path);
  },
};
