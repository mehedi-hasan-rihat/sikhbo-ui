"use client";

import { useState } from "react";
import { reviewSubmission } from "@/features/mentor-dashboard/services/mentor.service";
import { isApiError } from "@/types/api";
import type { MentorSubmission } from "@/types/mentor";
import type { SubmissionStatus } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ReviewDialogProps {
  submission: MentorSubmission | null;
  action: "APPROVED" | "REJECTED" | null;
  onClose: () => void;
  onSuccess: (id: string, status: SubmissionStatus) => void;
}

export function ReviewDialog({
  submission,
  action,
  onClose,
  onSuccess,
}: ReviewDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = submission !== null && action !== null;

  async function handleConfirm() {
    if (!submission || !action) return;
    setLoading(true);
    setError(null);
    try {
      await reviewSubmission(submission.id, action);
      onSuccess(submission.id, action);
      onClose();
    } catch (err) {
      setError(
        isApiError(err) ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const isApprove = action === "APPROVED";
  const actionLabel = isApprove ? "Approve" : "Reject";
  const actionVariant = isApprove ? "success" : "destructive";

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>
            {actionLabel} submission?
          </DialogTitle>
          <DialogDescription>
            {isApprove
              ? "This will mark the project as approved."
              : "This will mark the project as rejected."}
            {" "}
            <strong className="text-foreground font-normal">
              {submission?.projectName}
            </strong>
            {" "}by{" "}
            <strong className="text-foreground font-normal">
              {submission?.student.name}
            </strong>
            .
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-status-rejected-bg px-3 py-2.5 text-[13px] text-status-rejected"
          >
            {error}
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant={actionVariant}
            size="sm"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? `${actionLabel}ing…` : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
