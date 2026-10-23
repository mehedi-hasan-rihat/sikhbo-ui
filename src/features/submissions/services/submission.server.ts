/**
 * Server-side submission data fetching.
 * Uses next/headers to read the auth cookie — Server Components only.
 */
import { cookies } from "next/headers";
import { API_BASE_URL, AUTH_COOKIE } from "@/lib/constants";
import type { Submission, SubmissionsResponse } from "@/types/submission";

async function serverFetch<T>(path: string): Promise<T> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;

  const res = await fetch(`${API_BASE_URL}${path}`, {
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

/** GET /submissions — fetch the student's own submissions (server-side) */
export async function getMySubmissionsServer(): Promise<Submission[]> {
  try {
    const res = await serverFetch<SubmissionsResponse>("/submissions");
    return res.data;
  } catch (err) {
    if (err instanceof Error && err.message.includes("404")) {
      return [];
    }
    throw err;
  }
}

/** GET /submissions and filter by id (server-side) */
export async function getSubmissionByIdServer(id: string): Promise<Submission | null> {
  const list = await getMySubmissionsServer();
  return list.find((s) => s.id === id) ?? null;
}
