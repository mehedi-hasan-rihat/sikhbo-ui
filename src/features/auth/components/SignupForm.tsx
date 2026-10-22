"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { signupSchema, type SignupInput } from "@/features/auth/schemas";
import { register as registerUser } from "@/features/auth/services/auth.service";
import { isApiError } from "@/types/api";
import { ROUTES } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardHeader,
  CardTitle, CardDescription, CardFooter,
} from "@/components/ui/card";

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(data: SignupInput) {
    setServerError(null);
    try {
      await registerUser(data);
      // Register always creates a STUDENT — go straight to student dashboard
      router.push(ROUTES.studentDashboard);
      router.refresh();
    } catch (err) {
      if (isApiError(err)) {
        if (err.status === 409) {
          setServerError("An account with this email already exists.");
        } else if (err.errors) {
          setServerError(Object.values(err.errors).flat()[0] ?? err.message);
        } else {
          setServerError(err.message);
        }
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <Card className="w-full max-w-110">
      <CardHeader>
        <CardTitle>
          <h1 className="text-[28px] leading-8 tracking-[-0.03em]">Create account</h1>
        </CardTitle>
        <CardDescription>Sign up to submit your projects for review.</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="signup-form" onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {serverError && (
            <p role="alert" className="rounded-xl bg-status-rejected-bg px-4 py-3 text-[13px] text-status-rejected">
              {serverError}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-[13px] text-muted">Full name</Label>
            <Input id="name" type="text" autoComplete="name" placeholder="Your name"
              aria-invalid={!!errors.name} {...register("name")} />
            {errors.name && <p className="text-[13px] text-status-rejected">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-[13px] text-muted">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com"
              aria-invalid={!!errors.email} {...register("email")} />
            {errors.email && <p className="text-[13px] text-status-rejected">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-[13px] text-muted">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" placeholder="At least 6 characters"
              aria-invalid={!!errors.password} {...register("password")} />
            {errors.password && <p className="text-[13px] text-status-rejected">{errors.password.message}</p>}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-3">
        <Button type="submit" form="signup-form" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-[13px] text-muted">
          Already have an account?{" "}
          <Link href={ROUTES.login} className="text-foreground underline underline-offset-2 decoration-1 hover:text-muted transition-colors">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
