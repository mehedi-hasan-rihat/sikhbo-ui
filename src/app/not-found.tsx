import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-(--spacing-gutter) py-28 text-center">
      {/* Error code */}
      <p className="mb-6 text-[13px] text-muted tracking-[0.12em] uppercase">
        404
      </p>

      {/* Heading */}
      <h2 className="text-[28px] leading-8 tracking-[-0.03em] text-foreground">
        Page not found
      </h2>

      {/* Body */}
      <p className="mt-3 max-w-85 text-[15px] leading-[1.6] text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Back home */}
      <div className="mt-8">
        <Button render={<Link href="/" />}>Go home</Button>
      </div>
    </main>
  );
}
