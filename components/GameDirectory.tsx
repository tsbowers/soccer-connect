"use client";

import { useEffect, useState } from "react";
import { GameCard } from "@/components/GameCard";
import { GameFiltersForm } from "@/components/GameFiltersForm";
import { secondaryButtonClass } from "@/components/ui";
import { errorMessage, api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  EMPTY_FILTERS,
  hasActiveFilters,
  type GameFilters,
} from "@/lib/filters";
import type { Game } from "@/lib/types";

interface Result {
  key: string;
  games: Game[] | null;
  error: string | null;
}

export function GameDirectory() {
  const [filters, setFilters] = useState<GameFilters>(EMPTY_FILTERS);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const { user } = useAuth();

  // Results are tagged with the request that produced them, so "loading" is
  // simply "the latest result doesn't match the current request".
  // Includes the user so `joined` refreshes after logging in or out.
  const key = `${attempt}:${user?.id ?? "anon"}:${JSON.stringify(filters)}`;
  const loading = result?.key !== key;

  useEffect(() => {
    let cancelled = false;
    api
      .listGames(filters)
      .then((games) => {
        if (!cancelled) setResult({ key, games, error: null });
      })
      .catch((error) => {
        if (!cancelled)
          setResult({ key, games: null, error: errorMessage(error) });
      });
    return () => {
      cancelled = true;
    };
  }, [key, filters]);

  // Swap in the game returned by join/leave so its count updates in place.
  function handleGameChange(updated: Game) {
    setResult((current) =>
      current?.games
        ? {
            ...current,
            games: current.games.map((g) => (g.id === updated.id ? updated : g)),
          }
        : current,
    );
  }

  const games = result?.games ?? [];
  const filtered = hasActiveFilters(filters);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">Find a pickup game</h1>
      <p className="mt-1 text-muted">
        Upcoming games near you. Narrow the list by location, date, or start
        time.
      </p>

      <div className="mt-6">
        <GameFiltersForm applied={filters} onApply={setFilters} />
      </div>

      <div className="mt-6" aria-live="polite">
        {loading && (
          <p role="status" className="text-muted">
            Loading games…
          </p>
        )}

        {!loading && result?.error && (
          <div
            role="alert"
            className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          >
            <p>{result.error}</p>
            <button
              type="button"
              onClick={() => setAttempt((count) => count + 1)}
              className={`${secondaryButtonClass} mt-3`}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !result?.error && games.length === 0 && (
          <div className="rounded-xl border border-dashed border-line p-6">
            <p className="font-medium">
              {filtered
                ? "No games match these filters."
                : "No upcoming games yet."}
            </p>
            <p className="mt-1 text-muted">
              {filtered
                ? "Try a different location, date, or time range, or clear the filters."
                : "Check back soon, or organize the first game yourself."}
            </p>
          </div>
        )}

        {!loading && !result?.error && games.length > 0 && (
          <>
            <p className="mb-3 text-sm text-muted">
              {games.length} {games.length === 1 ? "game" : "games"}
              {filtered && " match your filters"}
            </p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onGameChange={handleGameChange}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
