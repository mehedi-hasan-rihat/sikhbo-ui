import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { MentorDashboard } from "@/features/mentor-dashboard/components/MentorDashboard";

export const metadata: Metadata = {
  title: "Review Dashboard",
  description: "Review, approve, and reject student project submissions.",
};

/**
 * No 'use cache' — dynamic by default with cacheComponents enabled.
 */
export default function MentorSubmissionsPage() {
  return (
    <PageShell>
      <p className="mb-1 text-[13px] text-muted tracking-[0.12em] uppercase">
        Mentor
      </p>
      <h2 className="text-[28px] leading-8 tracking-[-0.03em] text-foreground">
        Submissions
      </h2>

      <div className="mt-8">
        <MentorDashboard />
      </div>
    </PageShell>
  );
}
