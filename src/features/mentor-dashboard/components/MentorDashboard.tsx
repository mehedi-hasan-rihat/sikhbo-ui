"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getMentorSubmissions,
  getMentorStats,
} from "@/features/mentor-dashboard/services/mentor.service";
import type { MentorSubmission, MentorStats, MentorSubmissionsData, StatusFilter } from "@/types/mentor";
import type { SubmissionStatus } from "@/lib/constants";

import { StatsCards } from "./StatsCards";
import { StatusFilterSelect } from "./StatusFilter";
import { SubmissionsTable, SubmissionsTableSkeleton } from "./SubmissionsTable";
import { Pagination, type PageSizeOption } from "./Pagination";
import { ReviewDialog } from "./ReviewDialog";

interface MentorDashboardProps {
  initialData: MentorSubmissionsData;
  initialStats: MentorStats;
}

export function MentorDashboard({ initialData, initialStats }: MentorDashboardProps) {
  // ── Data state — hydrated from server ─────────────────────────────────────
  const [submissions, setSubmissions] = useState<MentorSubmission[]>(
    initialData.submissions,
  );
  const [pagination, setPagination] = useState(initialData.pagination);
  const [stats, setStats] = useState<MentorStats | null>(initialStats);

  // ── UI state — no loading spinners on first paint ─────────────────────────
  const [tableLoading, setTableLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);

  // ── Dialog ────────────────────────────────────────────────────────────────
  const [dialogSubmission, setDialogSubmission] = useState<MentorSubmission | null>(null);
  const [dialogAction, setDialogAction] = useState<"APPROVED" | "REJECTED" | null>(null);

  // ── Skip first fetch — data already comes from server props ──────────────
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelled = false;

    async function load() {
      setTableLoading(true);
      setTableError(null);
      try {
        const data = await getMentorSubmissions({ page, pageSize, status: statusFilter });
        if (cancelled) return;
        setSubmissions(data.submissions);
        setPagination(data.pagination);
      } catch {
        if (!cancelled) setTableError("Failed to load submissions. Please try again.");
      } finally {
        if (!cancelled) setTableLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [page, pageSize, statusFilter]);

  // ── Fetch stats (only on subsequent updates, not initial mount) ─────────
  const refreshStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await getMentorStats();
      setStats(data);
    } catch {
      setStatsError("Failed to load statistics.");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── Filter change — reset to page 1 ──────────────────────────────────────
  function handleFilterChange(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  // ── Page change ───────────────────────────────────────────────────────────
  function handlePageChange(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Page size change — reset to page 1 ───────────────────────────────────
  function handlePageSizeChange(size: PageSizeOption) {
    setPageSize(size);
    setPage(1);
  }

  // ── Dialog ────────────────────────────────────────────────────────────────
  function openReview(sub: MentorSubmission, action: "APPROVED" | "REJECTED") {
    setDialogSubmission(sub);
    setDialogAction(action);
  }

  function closeDialog() {
    setDialogSubmission(null);
    setDialogAction(null);
  }

  // ── After successful review: update row in-place and refresh stats ────────
  function handleReviewSuccess(id: string, status: SubmissionStatus) {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    refreshStats();
  }

  return (
    <>
      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      {statsError ? (
        <p className="text-[13px] text-status-rejected">{statsError}</p>
      ) : (
        <StatsCards stats={stats} loading={statsLoading} />
      )}

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <h3 className="text-[15px] text-foreground">All submissions</h3>
        <StatusFilterSelect value={statusFilter} onChange={handleFilterChange} />
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="mt-3">
        {tableError ? (
          <p
            role="alert"
            className="rounded-xl bg-status-rejected-bg px-4 py-3 text-[13px] text-status-rejected"
          >
            {tableError}
          </p>
        ) : tableLoading ? (
          <SubmissionsTableSkeleton />
        ) : (
          <SubmissionsTable
            submissions={submissions}
            onReview={openReview}
          />
        )}
      </div>

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {!tableLoading && !tableError && (
        <div className="mt-4">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            pageSize={pageSize}
            onPage={handlePageChange}
            onPageSize={handlePageSizeChange}
          />
        </div>
      )}

      {/* ── Review dialog ─────────────────────────────────────────────────── */}
      <ReviewDialog
        submission={dialogSubmission}
        action={dialogAction}
        onClose={closeDialog}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}
