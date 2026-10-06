import type { ReactNode } from "react";

export const inputClass =
  "mt-1 block w-full rounded-lg border border-line bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted aria-[invalid=true]:border-danger";

// Button colors and hover states live in globals.css (.btn-* classes), so
// light/dark mode stays consistent app-wide. These constants only add the
// layout pieces (flex, touch-target height, disabled states).
export const primaryButtonClass =
  "btn-primary inline-flex min-h-11 items-center justify-center disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
  "btn-secondary inline-flex min-h-11 items-center justify-center disabled:cursor-not-allowed disabled:opacity-60";

// Join Game — lighter accent green, dark text (white fails contrast on it).
export const accentButtonClass =
  "btn-accent inline-flex min-h-11 items-center justify-center disabled:cursor-not-allowed disabled:opacity-60";

// Cancel Game — destructive.
export const dangerButtonClass =
  "btn-danger inline-flex min-h-11 items-center justify-center disabled:cursor-not-allowed disabled:opacity-60";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

// Pairs a control with its label, hint and error. The control inside must set
// id={id}, aria-invalid, and aria-describedby using describedBy(id, ...).
export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(
  id: string,
  error?: string,
  hint?: string,
): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
    >
      {message}
    </p>
  );
}