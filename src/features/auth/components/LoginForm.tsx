"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { login } from "@/features/auth/services/auth.service";
import { decodeToken } from "@/lib/auth/decode";
import { isApiError } from "@/types/api";
import { ROUTES } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardHeader,
  CardTitle, CardDescription, CardFooter,
} from "@/components/ui/card";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    try {
      const res = await login(data);
      const payload = decodeToken(res.data.token);
      const role = payload?.role;
      const destination =
        next ?? (role === "MENTOR" ? ROUTES.mentorDashboard : ROUTES.studentSubmissions);
      router.push(destination);
      router.refresh();
    } catch (err) {
      if (isApiError(err)) {
        setServerError(err.status === 401 ? "Invalid email or password." : err.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <Card className="w-full max-w-110">
      <CardHeader>
        <CardTitle>
          <h1 className="text-[28px] leading-8 tracking-[-0.03em]">Log in</h1>
        </CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {serverError && (
            <p role="alert" className="rounded-xl bg-status-rejected-bg px-4 py-3 text-[13px] text-status-rejected">
              {serverError}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-[13px] text-muted">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com"
              aria-invalid={!!errors.email} {...register("email")} />
            {errors.email && <p className="text-[13px] text-status-rejected">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-[13px] text-muted">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••"
              aria-invalid={!!errors.password} {...register("password")} />
            {errors.password && <p className="text-[13px] text-status-rejected">{errors.password.message}</p>}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-3">
        <Button type="submit" form="login-form" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
        <p className="text-center text-[13px] text-muted">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.signup} className="text-foreground underline underline-offset-2 decoration-1 hover:text-muted transition-colors">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
