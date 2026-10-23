/**
 * Mentor dashboard service — Client Components only.
 */
import { API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth/token";
import type { ApiError } from "@/types/api";
import type {
  MentorStats,
  MentorStatsResponse,
  MentorSubmissionsData,
  MentorSubmissionsResponse,
  ReviewStatusResponse,
  StatusFilter,
} from "@/types/mentor";
import type { SubmissionStatus } from "@/lib/constants";

async function authedRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let e: Partial<ApiError> = {};
    try { e = await res.json(); } catch { /* ignore */ }
    throw {
      status: res.status,
      message: e.message ?? "Unexpected error",
      errors: e.errors,
    } satisfies ApiError;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface GetSubmissionsParams {
  page?: number;
  pageSize?: number;
  status?: StatusFilter;
}

/** GET /mentor/submissions */
export async function getMentorSubmissions(
  params: GetSubmissionsParams = {}
): Promise<MentorSubmissionsData> {
  const { page = 1, pageSize = 10, status = "ALL" } = params;
  const res = await authedRequest<MentorSubmissionsResponse>(
    "GET",
    "/mentor/submissions",
    undefined,
    { page, pageSize, status }
  );
  return res.data;
}

/** GET /mentor/submissions/stats */
export async function getMentorStats(): Promise<MentorStats> {
  const res = await authedRequest<MentorStatsResponse>(
    "GET",
    "/mentor/submissions/stats"
  );
  return res.data;
}

/** PATCH /mentor/submissions/:id/status */
export async function reviewSubmission(
  id: string,
  status: Extract<SubmissionStatus, "APPROVED" | "REJECTED">
): Promise<ReviewStatusResponse["data"]> {
  const res = await authedRequest<ReviewStatusResponse>(
    "PATCH",
    `/mentor/submissions/${id}/status`,
    { status }
  );
  return res.data;
}
