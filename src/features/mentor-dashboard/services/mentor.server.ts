/**
 * Server-side mentor data fetching.
 * Uses next/headers to read the auth cookie — Server Components only.
 */
import { cookies } from "next/headers";
import { API_BASE_URL, AUTH_COOKIE } from "@/lib/constants";
import type {
  MentorStats,
  MentorStatsResponse,
  MentorSubmissionsData,
  MentorSubmissionsResponse,
  StatusFilter,
} from "@/types/mentor";

async function serverFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface GetSubmissionsServerParams {
  page?: number;
  pageSize?: number;
  status?: StatusFilter;
}

/** GET /mentor/submissions (server-side) */
export async function getMentorSubmissionsServer(
  params: GetSubmissionsServerParams = {},
): Promise<MentorSubmissionsData> {
  const { page = 1, pageSize = 10, status = "ALL" } = params;
  const res = await serverFetch<MentorSubmissionsResponse>(
    "/mentor/submissions",
    { page, pageSize, status },
  );
  return res.data;
}

/** GET /mentor/submissions/stats (server-side) */
export async function getMentorStatsServer(): Promise<MentorStats> {
  const res = await serverFetch<MentorStatsResponse>(
    "/mentor/submissions/stats",
  );
  return res.data;
}
