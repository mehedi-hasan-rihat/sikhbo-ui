/**
 * Submission service — runs in Client Components only.
 */
import { API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth/token";
import type { ApiError } from "@/types/api";
import type { SubmissionInput } from "@/features/submissions/schemas";
import type { Submission, SubmissionResponse, SubmissionsResponse } from "@/types/submission";

async function authedRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let e: Partial<ApiError> = {};
    try {
      e = await res.json();
    } catch {
      /* ignore */
    }
    throw {
      status: res.status,
      message: e.message ?? "Unexpected error",
      errors: e.errors,
    } satisfies ApiError;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** POST /submissions — submit a project */
export async function createSubmission(
  data: SubmissionInput
): Promise<Submission> {
  const res = await authedRequest<SubmissionResponse>("POST", "/submissions", {
    ...data,
    // strip empty liveUrl so the API doesn't receive an empty string
    liveUrl: data.liveUrl?.trim() || undefined,
  });
  return res.data;
}

/** GET /submissions — fetch the student's own submissions */
export async function getMySubmissions(): Promise<Submission[]> {
  try {
    const res = await authedRequest<SubmissionsResponse>(
      "GET",
      "/submissions"
    );
    return res.data;
  } catch (err) {
    // 404 means no submissions yet — treat as empty list
    if (
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      (err as { status: number }).status === 404
    ) {
      return [];
    }
    throw err;
  }
}

/**
 * GET /submissions then find by id.
 * The API has no single-submission endpoint for students, so we fetch
 * the full list and pick the matching entry.
 */
export async function getSubmissionById(
  id: string
): Promise<Submission | null> {
  const list = await getMySubmissions();
  return list.find((s) => s.id === id) ?? null;
}
