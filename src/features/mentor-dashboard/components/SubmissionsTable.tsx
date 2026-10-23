"use client";

import { type MentorSubmission } from "@/types/mentor";
import { EmbedLink } from "@/components/shared/EmbedLink";
import { StatusBadge } from "@/features/submissions/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function SubmissionsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-surface">
            <TableHead className="px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted">Project</TableHead>
            <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted sm:table-cell">Student</TableHead>
            <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted md:table-cell">Repository</TableHead>
            <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted lg:table-cell">Submitted</TableHead>
            <TableHead className="px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted">Status</TableHead>
            <TableHead className="px-4 py-3"><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i} className="border-b border-border last:border-0">
              <TableCell className="px-4 py-3">
                <div className="h-3.5 w-32 animate-pulse rounded bg-surface" />
              </TableCell>
              <TableCell className="hidden px-4 py-3 sm:table-cell">
                <div className="h-3.5 w-28 animate-pulse rounded bg-surface" />
                <div className="mt-1 h-3 w-36 animate-pulse rounded bg-surface" />
              </TableCell>
              <TableCell className="hidden px-4 py-3 md:table-cell">
                <div className="h-3.5 w-44 animate-pulse rounded bg-surface" />
              </TableCell>
              <TableCell className="hidden px-4 py-3 lg:table-cell">
                <div className="h-3.5 w-20 animate-pulse rounded bg-surface" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="h-5 w-16 animate-pulse rounded-full bg-surface" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <div className="h-8 w-20 animate-pulse rounded-full bg-surface" />
                  <div className="h-8 w-16 animate-pulse rounded-full bg-surface" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────

interface SubmissionsTableProps {
  submissions: MentorSubmission[];
  onReview: (submission: MentorSubmission, action: "APPROVED" | "REJECTED") => void;
}

export function SubmissionsTable({ submissions, onReview }: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <p className="text-[15px] text-muted">No submissions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-surface">
            <TableHead className="px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted">
              Project
            </TableHead>
            <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted sm:table-cell">
              Student
            </TableHead>
            <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted md:table-cell">
              Repository
            </TableHead>
            <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted lg:table-cell">
              Submitted
            </TableHead>
            <TableHead className="px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted">
              Status
            </TableHead>
            <TableHead className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {submissions.map((sub) => (
            <TableRow key={sub.id} className="border-b border-border last:border-0">

              {/* Project */}
              <TableCell className="px-4 py-3">
                <span className="text-[14px] text-foreground">{sub.projectName}</span>
                {/* Mobile: student under project name */}
                <div className="mt-0.5 sm:hidden">
                  <span className="text-[12px] text-muted">{sub.student.name}</span>
                </div>
              </TableCell>

              {/* Student */}
              <TableCell className="hidden px-4 py-3 sm:table-cell">
                <span className="block text-[14px] text-foreground">{sub.student.name}</span>
                <span className="block text-[12px] text-muted">{sub.student.email}</span>
              </TableCell>

              {/* Repository */}
              <TableCell className="hidden px-4 py-3 md:table-cell">
                <div className="flex flex-col gap-0.5">
                  <EmbedLink href={sub.repoUrl} label="Repo URL" />
                  {sub.liveUrl && (
                    <EmbedLink href={sub.liveUrl} label="Live URL" />
                  )}
                </div>
              </TableCell>

              {/* Date */}
              <TableCell className="hidden px-4 py-3 text-[13px] text-muted whitespace-nowrap lg:table-cell">
                {new Date(sub.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>

              {/* Status */}
              <TableCell className="px-4 py-3">
                <StatusBadge status={sub.status} />
              </TableCell>

              {/* Actions */}
              <TableCell className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  {sub.status === "PENDING" ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => onReview(sub, "APPROVED")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onReview(sub, "REJECTED")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span className="text-[12px] text-muted opacity-50 pr-1">
                      Reviewed
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
