import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import type { Submission } from "@/types/submission";
import { ROUTES } from "@/lib/constants";
import { StatusBadge } from "./StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SubmissionDetailNotFound() {
  return (
    <div className="flex flex-col gap-4">
      <BackLink />
      <p className="text-[15px] text-muted">Submission not found.</p>
    </div>
  );
}

export function SubmissionDetailError({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-4">
      <BackLink />
      <p
        role="alert"
        className="rounded-xl bg-status-rejected-bg px-4 py-3 text-[13px] text-status-rejected"
      >
        {message}
      </p>
    </div>
  );
}

interface SubmissionDetailProps {
  submission: Submission;
}

export function SubmissionDetail({ submission }: SubmissionDetailProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <BackLink />

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>
                <h2 className="text-[22px] leading-7 tracking-[-0.02em]">
                  {submission.projectName}
                </h2>
              </CardTitle>
              <CardDescription>
                Submitted on{" "}
                {new Date(submission.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </CardDescription>
            </div>
            <StatusBadge status={submission.status} />
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-5">
            {/* Links */}
            <div className="flex flex-col gap-2.5">
              <Row label="Repository">
                <a
                  href={submission.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[14px] text-foreground underline underline-offset-2 decoration-1 hover:text-muted transition-colors"
                >
                  {submission.repoUrl.replace(/^https?:\/\/(www\.)?/, "")}
                  <ExternalLink size={12} className="shrink-0" />
                </a>
              </Row>

              {submission.liveUrl ? (
                <Row label="Live URL">
                  <a
                    href={submission.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[14px] text-foreground underline underline-offset-2 decoration-1 hover:text-muted transition-colors"
                  >
                    {submission.liveUrl.replace(/^https?:\/\/(www\.)?/, "")}
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                </Row>
              ) : (
                <Row label="Live URL">
                  <span className="text-[14px] text-muted opacity-50">Not provided</span>
                </Row>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Description */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-normal tracking-[0.08em] uppercase text-muted">
                Description
              </span>
              <p className="text-[15px] text-foreground leading-6 whitespace-pre-wrap">
                {submission.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href={ROUTES.studentSubmissions}
      className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors w-fit"
    >
      <ArrowLeft size={14} />
        Back to submissions
    </Link>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <span className="w-28 shrink-0 text-[13px] text-muted">{label}</span>
      <span className="text-[14px] text-foreground">{children}</span>
    </div>
  );
}
