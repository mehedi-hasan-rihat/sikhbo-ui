// Server-side only — never prefix with NEXT_PUBLIC_
export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:5000/api/v1";

export const API_TIMEOUT_MS = 10_000;

export const SUBMISSION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type SubmissionStatus =
  (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

export const PAGE_SIZE_DEFAULT = 20;
