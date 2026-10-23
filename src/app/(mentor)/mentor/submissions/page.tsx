import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { MentorDashboard } from "@/features/mentor-dashboard/components/MentorDashboard";
import {
  getMentorSubmissionsServer,
  getMentorStatsServer,
} from "@/features/mentor-dashboard/services/mentor.server";

export const instant = false;

export const metadata: Metadata = {
  title: "Review Dashboard",
  description: "Review, approve, and reject student project submissions.",
};


export default async function MentorSubmissionsPage() {
  // Fetch initial data server-side so the client starts hydrated
  const [initialData, initialStats] = await Promise.all([
    getMentorSubmissionsServer({ page: 1, pageSize: 10, status: "ALL" }),
    getMentorStatsServer(),
  ]);

  return (
    <PageShell>
      <p className="mb-1 text-[13px] text-muted tracking-[0.12em] uppercase">
        Mentor
      </p>
      <h2 className="text-[28px] leading-8 tracking-[-0.03em] text-foreground">
        Submissions
      </h2>

      <div className="mt-8">
        <MentorDashboard initialData={initialData} initialStats={initialStats} />
      </div>
    </PageShell>
  );
}
