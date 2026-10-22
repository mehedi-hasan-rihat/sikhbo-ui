import { API_BASE_URL, API_TIMEOUT_MS } from "@/lib/constants";
import type { ApiError } from "@/types/api";

type QueryParams = Record<string, string | number | boolean | undefined>;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: QueryParams): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: QueryParams
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const response = await fetch(this.buildUrl(path, params), {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorBody: Partial<ApiError> = {};
        try {
          errorBody = await response.json();
        } catch {
          // ignore parse failure — use defaults below
        }
        const err: ApiError = {
          status: response.status,
          message: errorBody.message ?? "An unexpected error occurred",
          errors: errorBody.errors,
        };
        throw err;
      }

      if (response.status === 204) {
        return undefined as T;
      }

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

  get<T>(path: string, params?: QueryParams): Promise<T> {
    return this.request<T>("GET", path, undefined, params);
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
