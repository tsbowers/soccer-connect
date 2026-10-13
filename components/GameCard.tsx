"use client";

import Link from "next/link";

import { JoinLeaveButton } from "@/components/JoinLeaveButton";
import { formatDate, formatTime } from "@/lib/format";
import type { Game } from "@/lib/types";

const STATUS_LABEL: Record<Game["status"], string | null> = {
  open: null,
  full: "Full",
  canceled: "Canceled",
};

interface GameCardProps {
  game: Game;
  onGameChange: (game: Game) => void;
}

export function GameCard({ game, onGameChange }: GameCardProps) {
  const statusLabel = STATUS_LABEL[game.status];
  const spotsLeft = game.capacity - game.attendeeCount;

  return (
    <li className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/games/${game.id}`} className="hover:underline">
          <h3 className="text-lg font-semibold">{game.location}</h3>
        </Link>
        {statusLabel && (
          <span
            className={
              game.status === "canceled"
                ? "shrink-0 rounded-md bg-red-100 px-2 py-1 text-sm font-medium text-red-900 dark:bg-red-950 dark:text-red-200"
                : "shrink-0 rounded-md bg-amber-100 px-2 py-1 text-sm font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200"
            }
          >
            {statusLabel}
          </span>
        )}
      </div>

      <p className="mt-1 font-medium">
        {formatDate(game.game_date)} at {formatTime(game.game_time)}
      </p>
      {game.description && (
        <p className="mt-2 text-muted">{game.description}</p>
      )}

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div className="flex gap-1">
          <dt className="text-muted">Organizer:</dt>
          <dd>{game.organizer}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-muted">Players:</dt>
          <dd aria-live="polite">
            {game.attendeeCount} of {game.capacity}
            {game.status === "open" &&
              ` (${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left)`}
            {game.joined && " · You're in"}
          </dd>
        </div>
      </dl>

      <JoinLeaveButton game={game} onChange={onGameChange} />
    </li>
  );
}
