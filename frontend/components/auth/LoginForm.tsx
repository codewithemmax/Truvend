"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import useAuth from "@/hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    const { error: loginError } = await login(email, password);
    setSubmitting(false);

    if (loginError) {
      setError(loginError);
      return;
    }

    router.push(ROUTES.LISTINGS);
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-black/5">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-wide text-teal-deep">
          {APP_NAME}
        </h1>
        <p className="mt-2 text-sm text-gray-500">Log in to your account</p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full"
        >
          {submitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.SIGNUP}
          className="font-medium text-teal-mid hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
