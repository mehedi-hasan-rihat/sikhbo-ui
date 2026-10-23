import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import {
  SubmissionDetail,
  SubmissionDetailError,
  SubmissionDetailNotFound,
} from "@/features/submissions/components/SubmissionDetail";
import { getSubmissionByIdServer } from "@/features/submissions/services/submission.server";
import type { Submission } from "@/types/submission";

export const instant = false;

export const metadata: Metadata = {
  title: "Submission Details",
  description: "View your project submission details and review status.",
};

interface SubmissionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const { id } = await params;

  let submission: Submission | null = null;
  let error = false;

  try {
    submission = await getSubmissionByIdServer(id);
  } catch {
    error = true;
  }

  let content: React.ReactNode;
  if (error) {
    content = <SubmissionDetailError message="Failed to load submission. Please try again." />;
  } else if (submission) {
    content = <SubmissionDetail submission={submission} />;
  } else {
    content = <SubmissionDetailNotFound />;
  }

  return <PageShell>{content}</PageShell>;
}
