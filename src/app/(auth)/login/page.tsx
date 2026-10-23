import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-(--spacing-gutter) py-20">
      <p className="mb-10 text-[13px] text-muted tracking-[0.12em] uppercase">
        Sikhbo
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
