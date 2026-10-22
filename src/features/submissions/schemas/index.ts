import { z } from "zod";

export const submissionSchema = z.object({
  projectName: z
    .string()
    .min(1, "Project name is required")
    .min(3, "At least 3 characters")
    .max(100, "At most 100 characters"),

  repoUrl: z
    .string()
    .min(1, "Repository URL is required")
    .url("Enter a valid URL")
    .refine(
      (url) => {
        try {
          return new URL(url).hostname.replace(/^www\./, "") === "github.com";
        } catch {
          return false;
        }
      },
      { message: "Must be a github.com URL" }
    ),

  liveUrl: z
    .string()
    .optional()
    .transform((v) => (v?.trim() === "" ? undefined : v))
    .pipe(
      z
        .string()
        .url("Enter a valid URL")
        .optional()
    ),

  description: z
    .string()
    .min(1, "Description is required")
    .min(20, "At least 20 characters")
    .max(500, "At most 500 characters"),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
