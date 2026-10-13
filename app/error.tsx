"use client";

import { primaryButtonClass } from "@/components/ui";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-muted">
        We couldn&apos;t load this page. Try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className={`${primaryButtonClass} mt-6`}
      >
        Try again
      </button>
    </div>
  );
}
