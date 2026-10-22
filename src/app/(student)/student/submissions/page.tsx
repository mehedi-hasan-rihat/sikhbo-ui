import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { SubmissionHistory } from "@/features/submissions/components/SubmissionHistory";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";


export default function StudentSubmissionsPage() {
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

      <SubmissionHistory />
    </PageShell>
  );
}
