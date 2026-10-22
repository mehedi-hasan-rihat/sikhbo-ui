import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Consistent page padding for all dashboard screens.
 * Applies the responsive --spacing-gutter token horizontally
 * and a comfortable vertical rhythm.
 */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-344 px-(--spacing-gutter) py-8 md:py-10",
        className
      )}
    >
      {children}
    </div>
  );
}
