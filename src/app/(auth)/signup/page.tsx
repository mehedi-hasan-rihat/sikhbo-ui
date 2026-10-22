import { SignupForm } from "@/features/auth/components/SignupForm";

export const metadata = { title: "Sign up — Sikhbo" };

export default function SignupPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-(--spacing-gutter) py-20">
      <p className="mb-10 text-[13px] text-muted tracking-[0.12em] uppercase">
        Sikhbo
      </p>
      <SignupForm />
    </main>
  );
}
