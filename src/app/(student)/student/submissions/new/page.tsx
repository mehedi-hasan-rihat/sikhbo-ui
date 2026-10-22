import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SubmissionForm } from "@/features/submissions/components/SubmissionForm";
import { ROUTES } from "@/lib/constants";


export default function NewSubmissionPage() {
  return (
    <PageShell>
      <Link
        href={ROUTES.studentSubmissions}
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} />
        Back to submissions
      </Link>

      <SubmissionForm />
    </PageShell>
  );
}
