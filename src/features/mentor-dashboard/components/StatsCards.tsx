import type { MentorStats } from "@/types/mentor";

interface StatsCardsProps {
  stats: MentorStats | null;
  loading: boolean;
}

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: "pending" | "approved" | "rejected";
  loading: boolean;
}

function StatCard({ label, value, accent, loading }: StatCardProps) {
  const accentClass =
    accent === "pending"
      ? "text-status-pending"
      : accent === "approved"
        ? "text-status-approved"
        : accent === "rejected"
          ? "text-status-rejected"
          : "text-foreground";

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-5">
      <span className="text-[12px] font-normal tracking-[0.08em] uppercase text-muted">
        {label}
      </span>
      {loading ? (
        <div className="h-8 w-12 animate-pulse rounded bg-canvas" />
      ) : (
        <span className={`text-[28px] leading-8 tracking-[-0.03em] ${accentClass}`}>
          {value}
        </span>
      )}
    </div>
  );
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Total"    value={stats?.total    ?? 0} loading={loading} />
      <StatCard label="Pending"  value={stats?.pending  ?? 0} accent="pending"  loading={loading} />
      <StatCard label="Approved" value={stats?.approved ?? 0} accent="approved" loading={loading} />
      <StatCard label="Rejected" value={stats?.rejected ?? 0} accent="rejected" loading={loading} />
    </div>
  );
}
