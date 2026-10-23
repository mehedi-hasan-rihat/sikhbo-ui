import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import {
  SubmissionHistory,
  SubmissionHistoryEmpty,
  SubmissionHistoryError,
} from "@/features/submissions/components/SubmissionHistory";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { getMySubmissionsServer } from "@/features/submissions/services/submission.server";
import type { Submission } from "@/types/submission";

export const instant = false;

export const metadata: Metadata = {
  title: "My Submissions",
  description: "Track the status of your submitted projects.",
};

export default async function StudentSubmissionsPage() {
  let submissions: Submission[] | null = null;
  let error = false;

  try {
    submissions = await getMySubmissionsServer();
  } catch {
    error = true;
  }

  let content: React.ReactNode;
  if (error) {
    content = <SubmissionHistoryError message="Failed to load submissions. Please refresh." />;
  } else if (submissions && submissions.length === 0) {
    content = <SubmissionHistoryEmpty />;
  } else if (submissions) {
    content = <SubmissionHistory submissions={submissions} />;
  }

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] leading-8 tracking-[-0.03em] text-foreground">
            Submissions
          </h2>
        </div>

        <Button render={<Link href={ROUTES.newSubmission} />} size="sm">
          New submission
        </Button>
      </div>

      {content}
    </PageShell>
  );
}
