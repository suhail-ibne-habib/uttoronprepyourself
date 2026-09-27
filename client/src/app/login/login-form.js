"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAdmin, useAuth } from "@/hooks/use-auth";
import { loginSchema } from "@/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/Field";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedNext = searchParams.get("next");
  const { user, loading, signIn } = useAuth();

  function destination(nextUser) {
    if (requestedNext) {
      if (requestedNext.startsWith("/dashboard") && !isAdmin(nextUser)) {
        return "/profile";
      }
      return requestedNext;
    }
    return isAdmin(nextUser) ? "/dashboard" : "/profile";
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    router.replace(destination(user));
  }, [loading, user, router, requestedNext]);

  async function onSubmit(values) {
    setSaving(true);
    try {
      const nextUser = await signIn(values);
      toast.success("Welcome back");
      router.replace(destination(nextUser));
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-full items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-background p-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Uttoron
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to use your account. Admins can also open the dashboard.
        </p>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
          </Field>
          <Field label="Password" htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
          </Field>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
