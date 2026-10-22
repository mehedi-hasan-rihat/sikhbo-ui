"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-[--spacing-gutter] py-28 text-center">
      {/* Error label */}
      <p className="mb-6 text-[13px] text-muted tracking-[0.12em] uppercase">
        Error
      </p>

      {/* Heading */}
      <h2 className="text-[28px] leading-8 tracking-[-0.03em] text-foreground">
        Something went wrong
      </h2>

      {/* Body */}
      <p className="mt-3 max-w-85 text-[15px] leading-[1.6] text-muted">
        An unexpected error occurred. Try again or contact support if the issue
        persists.
      </p>

      {/* Actions */}
      <div className="mt-8 flex items-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Go home
        </Button>
      </div>
    </main>
  );
}
