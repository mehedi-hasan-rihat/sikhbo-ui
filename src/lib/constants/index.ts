// ── Server-side only ──────────────────────────────────────────────────────────
export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:5000/api/v1";

export const API_TIMEOUT_MS = 10_000;

// ── Browser-safe — used in Client Components ──────────────────────────────────
export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

// ── JWT cookie name (set client-side after login) ─────────────────────────────
export const AUTH_COOKIE = "auth_token";

// ── Submission statuses ───────────────────────────────────────────────────────
export const SUBMISSION_STATUS = {
  PENDING:  "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type SubmissionStatus =
  (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

export const PAGE_SIZE_DEFAULT = 10;

// ── App routes ────────────────────────────────────────────────────────────────
export const ROUTES = {
  home:             "/",
  login:            "/login",
  signup:           "/signup",
  studentDashboard: "/student/dashboard",
  mentorDashboard:  "/mentor/submissions",
} as const;
