import { PageShell } from "@/components/layout/PageShell";
import { SubmissionDetail } from "@/features/submissions/components/SubmissionDetail";

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
