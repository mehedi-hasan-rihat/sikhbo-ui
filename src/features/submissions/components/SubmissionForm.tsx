"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { submissionSchema, type SubmissionInput } from "@/features/submissions/schemas";
import { createSubmission } from "@/features/submissions/services/submission.service";
import { isApiError } from "@/types/api";
import { ROUTES } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormError =
  | { type: "duplicate" }
  | { type: "generic"; message: string }
  | null;

export function SubmissionForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<FormError>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
  });

  async function onSubmit(data: SubmissionInput) {
    setFormError(null);
    try {
      const submission = await createSubmission(data);
      // Clear all fields so if React keeps the component in memory the form
      // is blank, then invalidate the RSC cache for a clean server render
      // next visit, and navigate to the detail page.
      reset();
      router.refresh();
      router.push(ROUTES.submissionDetail(submission.id));
    } catch (err) {
      if (isApiError(err)) {
        if (err.status === 409) {
          setFormError({ type: "duplicate" });
          return;
        }

        // Map field-level API errors back onto individual inputs
        if (err.errors) {
          const fieldMap: Record<string, keyof SubmissionInput> = {
            projectName: "projectName",
            repoUrl:     "repoUrl",
            liveUrl:     "liveUrl",
            description: "description",
          };
          let hasFieldError = false;
          for (const [key, field] of Object.entries(fieldMap)) {
            const msg = err.errors[key];
            if (msg) {
              setError(field, {
                message: Array.isArray(msg) ? msg[0] : String(msg),
              });
              hasFieldError = true;
            }
          }
          if (hasFieldError) return;
        }

        setFormError({ type: "generic", message: err.message });
      } else {
        setFormError({
          type: "generic",
          message: "Something went wrong. Please try again.",
        });
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          <h1 className="text-[28px] leading-8 tracking-[-0.03em]">
            Submit your project
          </h1>
        </CardTitle>
        <CardDescription>
          Fill in your project details for mentor review.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="submission-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* ── Duplicate banner ─────────────────────────────────────────── */}
          {formError?.type === "duplicate" && (
            <div
              role="alert"
              className="rounded-xl bg-status-rejected-bg px-4 py-3 text-[13px] text-status-rejected"
            >
              You have already submitted this repository. Update the repository
              URL and try again.
            </div>
          )}

          {/* ── Generic API error ────────────────────────────────────────── */}
          {formError?.type === "generic" && (
            <p
              role="alert"
              className="rounded-xl bg-status-rejected-bg px-4 py-3 text-[13px] text-status-rejected"
            >
              {formError.message}
            </p>
          )}

          {/* ── Project name ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="projectName" className="text-[13px] text-muted">
              Project name
            </Label>
            <Input
              id="projectName"
              type="text"
              placeholder="My Awesome Project"
              aria-invalid={!!errors.projectName}
              {...register("projectName")}
            />
            {errors.projectName && (
              <p className="text-[13px] text-status-rejected">
                {errors.projectName.message}
              </p>
            )}
          </div>

          {/* ── Repository URL ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="repoUrl" className="text-[13px] text-muted">
              Repository URL
            </Label>
            <Input
              id="repoUrl"
              type="url"
              placeholder="https://github.com/username/repo"
              aria-invalid={!!errors.repoUrl}
              {...register("repoUrl")}
            />
            {errors.repoUrl && (
              <p className="text-[13px] text-status-rejected">
                {errors.repoUrl.message}
              </p>
            )}
          </div>

          {/* ── Live URL (optional) ──────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="liveUrl" className="text-[13px] text-muted">
              Live URL{" "}
              <span className="text-[11px] text-muted opacity-60">
                (optional)
              </span>
            </Label>
            <Input
              id="liveUrl"
              type="url"
              placeholder="https://my-project.vercel.app"
              aria-invalid={!!errors.liveUrl}
              {...register("liveUrl")}
            />
            {errors.liveUrl && (
              <p className="text-[13px] text-status-rejected">
                {errors.liveUrl.message}
              </p>
            )}
          </div>

          {/* ── Description ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="text-[13px] text-muted">
              Description
            </Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe what your project does, the tech stack you used, and anything else that's relevant…"
              aria-invalid={!!errors.description}
              className="min-h-24 resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-[15px] text-foreground transition-colors outline-none placeholder:text-muted placeholder:text-[13px] focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus/20 aria-invalid:border-status-rejected aria-invalid:ring-2 aria-invalid:ring-status-rejected/20 disabled:pointer-events-none disabled:opacity-50"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-[13px] text-status-rejected">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button
          type="submit"
          form="submission-form"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Submitting…" : "Submit project"}
        </Button>
      </CardFooter>
    </Card>
  );
}
