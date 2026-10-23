"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { getMySubmissions } from "@/features/submissions/services/submission.service";
import type { Submission } from "@/types/submission";
import { ROUTES } from "@/lib/constants";
import { EmbedLink } from "@/components/shared/EmbedLink";
import { StatusBadge } from "./StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FetchState =
  | { type: "loading" }
  | { type: "empty" }
  | { type: "loaded"; submissions: Submission[] }
  | { type: "error"; message: string };

export function SubmissionHistory() {
  const [state, setState] = useState<FetchState>({ type: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getMySubmissions();
        if (cancelled) return;
        setState(data.length === 0 ? { type: "empty" } : { type: "loaded", submissions: data });
      } catch {
        if (!cancelled) {
          setState({ type: "error", message: "Failed to load submissions. Please refresh." });
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // ── Loading — skeleton table ─────────────────────────────────────────────
  if (state.type === "loading") {
    return (
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-surface">
              <TableHead className="px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted">Project</TableHead>
              <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted sm:table-cell">GitHub</TableHead>
              <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted lg:table-cell">Live</TableHead>
              <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted md:table-cell">Submitted</TableHead>
              <TableHead className="px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted">Status</TableHead>
              <TableHead className="px-4 py-3"><span className="sr-only">Details</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i} className="border-b border-border last:border-0">
                {/* Project */}
                <TableCell className="px-4 py-3">
                  <div className="h-3.5 w-32 animate-pulse rounded bg-surface" />
                </TableCell>
                {/* GitHub */}
                <TableCell className="hidden px-4 py-3 sm:table-cell">
                  <div className="h-3.5 w-40 animate-pulse rounded bg-surface" />
                </TableCell>
                {/* Live */}
                <TableCell className="hidden px-4 py-3 lg:table-cell">
                  <div className="h-3.5 w-28 animate-pulse rounded bg-surface" />
                </TableCell>
                {/* Date */}
                <TableCell className="hidden px-4 py-3 md:table-cell">
                  <div className="h-3.5 w-20 animate-pulse rounded bg-surface" />
                </TableCell>
                {/* Status */}
                <TableCell className="px-4 py-3">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-surface" />
                </TableCell>
                {/* View */}
                <TableCell className="px-4 py-3 text-right">
                  <div className="ml-auto h-3.5 w-6 animate-pulse rounded bg-surface" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (state.type === "error") {
    return (
      <p
        role="alert"
        className="mt-6 rounded-xl bg-status-rejected-bg px-4 py-3 text-[13px] text-status-rejected"
      >
        {state.message}
      </p>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (state.type === "empty") {
    return (
      <p className="mt-6 text-[15px] text-muted">
        You haven&apos;t submitted a project yet.
      </p>
    );
  }

  // ── Table ────────────────────────────────────────────────────────────────
  const { submissions } = state;

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-surface">
            <TableHead className="px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted">
              Project
            </TableHead>
            <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted sm:table-cell">
              GitHub
            </TableHead>
            <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted lg:table-cell">
              Live
            </TableHead>
            <TableHead className="hidden px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted md:table-cell">
              Submitted
            </TableHead>
            <TableHead className="px-4 py-3 text-[12px] font-normal tracking-[0.08em] uppercase text-muted">
              Status
            </TableHead>
            <TableHead className="px-4 py-3">
              <span className="sr-only">Details</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {submissions.map((sub) => (
            <TableRow key={sub.id} className="border-b border-border last:border-0">

              {/* Project name */}
              <TableCell className="px-4 py-3">
                <span className="text-[14px] text-foreground">
                  {sub.projectName}
                </span>
                {/* Mobile: show both links stacked under project name */}
                <div className="mt-1 flex flex-col gap-0.5 sm:hidden">
                  <EmbedLink href={sub.repoUrl} label="Repo URL" />
                  {sub.liveUrl && (
                    <EmbedLink href={sub.liveUrl} label="Live URL" />
                  )}
                </div>
              </TableCell>

              {/* GitHub — sm+ */}
              <TableCell className="hidden px-4 py-3 sm:table-cell">
                <EmbedLink href={sub.repoUrl} label="Repo URL" />
              </TableCell>

              {/* Live — lg+ */}
              <TableCell className="hidden px-4 py-3 lg:table-cell">
                {sub.liveUrl
                  ? <EmbedLink href={sub.liveUrl} label="Live URL" />
                  : <span className="text-[13px] text-muted opacity-40">—</span>
                }
              </TableCell>

              {/* Date */}
              <TableCell className="hidden px-4 py-3 text-[13px] text-muted md:table-cell whitespace-nowrap">
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

              {/* Details */}
              <TableCell className="px-4 py-3 text-right">
                <Link
                  href={ROUTES.submissionDetail(sub.id)}
                  className="text-[13px] text-muted underline underline-offset-2 decoration-1 whitespace-nowrap"
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
