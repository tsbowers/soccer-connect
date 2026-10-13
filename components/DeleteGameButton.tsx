"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  dangerButtonClass,
  FormError,
  secondaryButtonClass,
} from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import type { Game } from "@/lib/types";

interface DeleteGameButtonProps {
  game: Game;
}

function hasStarted(date: string, time: string): boolean {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute).getTime() < Date.now();
}

export function DeleteGameButton({ game }: DeleteGameButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Same rule as editing: a game that already started can't be canceled.
  const started = hasStarted(game.game_date, game.game_time);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await api.deleteGame(game.id);
      router.push("/games");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
      setDeleting(false);
    }
  }

  return (
    <section
      aria-labelledby="cancel-game-heading"
      className="mx-auto mt-8 w-full max-w-lg"
    >
      <h2 id="cancel-game-heading" className="text-lg font-semibold">
        Cancel this game
      </h2>
      <p className="mt-1 text-sm text-muted">
        {started
          ? "This game has already started, so it can no longer be canceled."
          : "Canceling permanently removes the game and its player list."}
      </p>

      <div className="mt-3 space-y-3">
        <FormError message={error} />
        {!confirming ? (
          <button
            type="button"
            className={dangerButtonClass}
            disabled={started}
            onClick={() => setConfirming(true)}
          >
            Cancel game
          </button>
        ) : (
          <div
            role="alertdialog"
            aria-label="Confirm cancel game"
            className="flex flex-wrap items-center gap-3"
          >
            <span className="text-sm font-medium">
              Delete this game for good?
            </span>
            <button
              type="button"
              className={dangerButtonClass}
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : "Yes, delete it"}
            </button>
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={deleting}
              onClick={() => setConfirming(false)}
            >
              Keep game
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
