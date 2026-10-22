import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/lib/constants";

interface StatusBadgeProps {
  status: SubmissionStatus;
}

const STATUS_MAP: Record<
  SubmissionStatus,
  { label: string; variant: "pending" | "approved" | "rejected" }
> = {
  PENDING:  { label: "Pending",  variant: "pending"  },
  APPROVED: { label: "Approved", variant: "approved" },
  REJECTED: { label: "Rejected", variant: "rejected" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, variant } = STATUS_MAP[status] ?? STATUS_MAP.PENDING;
  return <Badge variant={variant}>{label}</Badge>;
}
