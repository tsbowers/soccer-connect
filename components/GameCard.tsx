import { isGameFull, type Game } from "@/lib/types";

function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function GameCard({ game }: { game: Game }) {
  const full = isGameFull(game);
  // "Full" is now derived, not stored — GameStatus only has "open" | "canceled".
  const statusLabel =
      game.status === "canceled" ? "Canceled" : full ? "Full" : null;
  const spotsLeft = game.maxPlayers - game.attendeeCount;

  return (
      <li className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">{game.title}</h3>
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

        <p className="mt-1 text-sm text-muted">{game.location}</p>
        <p className="mt-1 font-medium">
          {formatDate(game.date)} at {formatTime(game.startTime)}
        </p>
        {game.description && <p className="mt-2 text-muted">{game.description}</p>}

        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <div className="flex gap-1">
            <dt className="text-muted">Organizer:</dt>
            <dd>{game.createdBy}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="text-muted">Players:</dt>
            <dd>
              {game.attendeeCount} of {game.maxPlayers}
              {game.status === "open" &&
                  !full &&
                  ` (${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left)`}
            </dd>
          </div>
        </dl>
      </li>
  );
}