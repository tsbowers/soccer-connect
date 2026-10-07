"use client";

import { useState } from "react";

import { GameForm, type GameFormValues } from "@/components/GameForm";
import type { CreateGameInput } from "@/lib/types";

export function CreateGameForm() {
  const [submitted, setSubmitted] = useState<CreateGameInput | null>(null);

  function handleValidSubmit(values: GameFormValues) {
    // TODO: replace with a real POST to the Create Game API once
    // issue #18 (Backend – Create Game API) is merged into main.
    setSubmitted(values);
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <GameForm submitLabel="Create Game" onValidSubmit={handleValidSubmit} />

      {submitted && (
        <div
          role="status"
          className="mt-6 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
        >
          Game details captured locally: {submitted.title} at{" "}
          {submitted.location} on {submitted.date} at {submitted.startTime}{" "}
          (capacity {submitted.maxPlayers}). This isn&apos;t saved to a database
          yet — that lands once the Create Game API (#18) is merged.
        </div>
      )}
    </div>
  );
}
