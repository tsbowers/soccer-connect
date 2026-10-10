"use client";

import Link from "next/link";
import { useState } from "react";
import { accentButtonClass, secondaryButtonClass } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Game } from "@/lib/types";

interface Props {
  game: Game;
  onChange: (game: Game) => void;
}

export function JoinLeaveButton({ game, onChange }: Props) {
  const { user, loading } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading || game.status === "canceled") return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="mt-4 inline-block text-sm font-medium text-turf-text underline"
      >
        Log in to join
      </Link>
    );
  }

  async function toggle() {
    setPending(true);
    setError(null);
    try {
      onChange(
        game.joined ? await api.leaveGame(game.id) : await api.joinGame(game.id),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const full = game.status === "full" && !game.joined;
  const label = pending
    ? game.joined ? "Leaving…" : "Joining…"
    : game.joined ? "Leave game" : full ? "Game full" : "Join game";

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={toggle}
        disabled={pending || full}
        className={game.joined ? secondaryButtonClass : accentButtonClass}
      >
        {label}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
