"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  Field,
  FormError,
  describedBy,
  inputClass,
  primaryButtonClass,
} from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  hasErrors,
  validateLogin,
  validateSignup,
  type FieldErrors,
} from "@/lib/validation";
import type { SignupInput } from "@/lib/user-types";

type Mode = "signup" | "login";

const COPY = {
  signup: {
    title: "Create your account",
    intro: "Sign up to join pickup games and organize your own.",
    submit: "Create account",
    pending: "Creating account…",
    switchText: "Already have an account?",
    switchLink: "/login",
    switchLabel: "Log in",
  },
  login: {
    title: "Log in",
    intro: "Welcome back. Log in to join games and manage your profile.",
    submit: "Log in",
    pending: "Logging in…",
    switchText: "New to SoccerConnect?",
    switchLink: "/signup",
    switchLabel: "Create an account",
  },
} as const;

export function AuthForm({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const router = useRouter();
  const { user, loading, signup, login } = useAuth();
  const [errors, setErrors] = useState<FieldErrors<SignupInput>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Signed-in visitors have no reason to see these pages.
  useEffect(() => {
    if (!loading && user && !submitting) router.replace("/games");
  }, [loading, user, submitting, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input: SignupInput = {
      displayName: data.get("displayName")?.toString() ?? "",
      email: data.get("email")?.toString() ?? "",
      password: data.get("password")?.toString() ?? "",
    };

    const nextErrors =
      mode === "signup"
        ? validateSignup(input)
        : validateLogin({ email: input.email, password: input.password });
    setErrors(nextErrors);
    setFormError(null);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signup(input);
        router.push("/profile"); // finish the profile next
      } else {
        await login({ email: input.email, password: input.password });
        router.push("/games");
      }
    } catch (error) {
      setFormError(errorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">{copy.title}</h1>
      <p className="mt-1 text-muted">{copy.intro}</p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="card mt-6 flex flex-col gap-4 p-6"
      >
        <FormError message={formError} />

        {mode === "signup" && (
          <Field id="displayName" label="Display name" error={errors.displayName}
            hint="Other players see this name on games you join.">
            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="nickname"
              aria-invalid={Boolean(errors.displayName)}
              aria-describedby={describedBy("displayName", errors.displayName,
                "Other players see this name on games you join.")}
              className={inputClass}
            />
          </Field>
        )}

        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email", errors.email)}
            className={inputClass}
          />
        </Field>

        <Field id="password" label="Password" error={errors.password}
          hint={mode === "signup" ? "At least 8 characters." : undefined}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={describedBy("password", errors.password,
              mode === "signup" ? "At least 8 characters." : undefined)}
            className={inputClass}
          />
        </Field>

        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? copy.pending : copy.submit}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {copy.switchText}{" "}
        <Link href={copy.switchLink} className="font-medium text-turf-text underline">
          {copy.switchLabel}
        </Link>
      </p>
    </div>
  );
}