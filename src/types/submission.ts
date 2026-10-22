import type { SubmissionStatus } from "@/lib/constants";

export interface Submission {
  id: string;
  projectName: string;
  repoUrl: string;
  liveUrl?: string | null;
  description: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface SubmissionsResponse {
  success: boolean;
  message: string;
  data: Submission[];
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  data: Submission;
}
