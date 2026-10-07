"use client";

import { useState } from "react";

import {
  GameForm,
  isInThePast,
  type GameFormValues,
} from "@/components/GameForm";
import type { Game, UpdateGameInput } from "@/lib/types";

interface EditGameFormProps {
  game: Game;
}

export function EditGameForm({ game }: EditGameFormProps) {
  const [submitted, setSubmitted] = useState<UpdateGameInput | null>(null);

  // A game that has already started can no longer be edited (spec edge case:
  // "An organizer attempts to edit or cancel a game after its start time").
  // This is a client-side guard for now; the real enforcement has to happen
  // server-side once PATCH /api/games/{gameId} exists.
  const alreadyStarted = isInThePast(game.date, game.startTime);

  function handleValidSubmit(values: GameFormValues) {
    // TODO: replace with a real PATCH to /api/games/{gameId} once
    // issue #22's backend counterpart is merged into main.
    setSubmitted({ id: game.id, ...values });
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      {alreadyStarted && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
        >
          This game has already started and can no longer be edited.
        </div>
      )}

      <GameForm
        submitLabel="Save Changes"
        initialValues={{
          title: game.title,
          location: game.location,
          date: game.date,
          startTime: game.startTime,
          maxPlayers: game.maxPlayers,
          description: game.description,
        }}
        onValidSubmit={handleValidSubmit}
        disabled={alreadyStarted}
      />

      {submitted && (
        <div
          role="status"
          className="mt-6 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
        >
          Changes captured locally for &quot;{submitted.title}&quot;. This
          isn&apos;t saved to a database yet — that lands once the Edit Game API
          is merged.
        </div>
      )}
    </div>
  );
}
