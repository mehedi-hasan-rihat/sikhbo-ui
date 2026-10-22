import { PageShell } from "@/components/layout/PageShell";

// Phase 3 — full implementation
export default function MentorSubmissionsPage() {
  return (
    <PageShell>
      <p className="mb-4 text-[13px] text-muted tracking-[0.12em] uppercase">
        Mentor
      </p>
      <h2 className="text-[28px] leading-8 tracking-[-0.03em] text-foreground">
        Submissions
      </h2>
      <p className="mt-3 text-[15px] text-muted">
        Student submissions will appear here.
      </p>
    </PageShell>
  );
}
