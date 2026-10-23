import type { SubmissionStatus } from "@/lib/constants";

export interface MentorSubmission {
  id: string;
  projectName: string;
  repoUrl: string;
  liveUrl?: string | null;
  description: string;
  status: SubmissionStatus;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

export interface MentorSubmissionsData {
  submissions: MentorSubmission[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface MentorSubmissionsResponse {
  success: boolean;
  message: string;
  data: MentorSubmissionsData;
}

export interface MentorStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface MentorStatsResponse {
  success: boolean;
  message: string;
  data: MentorStats;
}

export interface ReviewStatusResponse {
  success: boolean;
  message: string;
  data: { id: string; status: SubmissionStatus; updatedAt: string };
}

export type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";
