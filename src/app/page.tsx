import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Home",
  description: "Submit your project for mentor review, or sign in to start evaluating submissions.",
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-(--spacing-gutter) py-28 text-center">
      {/* Wordmark */}
      <p className="mb-8 text-[13px] text-muted tracking-[0.12em] uppercase">
        Sikhbo
      </p>

      {/* Heading */}
      <h1 className="max-w-140 tracking-[-0.03em] text-foreground">
        Project Review Portal
      </h1>

      {/* Sub-copy */}
      <p className="mt-4 max-w-100 text-[15px] leading-[1.6] text-muted">
        Submit your project for mentor review, or sign in to start evaluating
        submissions.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex items-center gap-3">
        <Button render={<Link href="/login" />}>Log in</Button>
        <Button variant="outline" render={<Link href="/signup" />}>Sign up</Button>
      </div>

      {/* Divider */}
      <div className="mt-16 h-px w-16 bg-border" />

      {/* Footer note */}
      <p className="mt-6 text-[13px] text-muted">
        Students submit. Mentors review. Results are clear.
      </p>
    </main>
  );
}
