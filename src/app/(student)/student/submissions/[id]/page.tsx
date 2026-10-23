import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SubmissionDetail } from "@/features/submissions/components/SubmissionDetail";

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

  return (
    <PageShell>
      <SubmissionDetail id={id} />
    </PageShell>
  );
}
