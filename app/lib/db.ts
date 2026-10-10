import { sql } from "@vercel/postgres";

import type { Attendee, Game, GameStatus } from "@/lib/types";

// Rows come back from Postgres with Date objects for date/timestamp columns
// and "HH:MM:SS" strings for time columns; the API returns plain strings.
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value == null ? "" : String(value).slice(0, 10);
}

function toTimeString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(11, 16);
  }
  return value == null ? "" : String(value).slice(0, 5);
}

// Minimal shape of a joined pickup_game row coming back from Postgres.
// Typed loosely because @vercel/postgres returns QueryResultRow.
export function mapGame(row: Record<string, unknown>): Game {
  const capacity = Number(row.max_players);
  const attendeeCount = Number(row.attendee_count ?? 0);
  const status: GameStatus = attendeeCount >= capacity ? "full" : "open";

  return {
    id: String(row.id),
    title: (row.title as string | null | undefined) ?? undefined,
    location: (row.location as string | undefined) ?? "",
    game_date: toDateString(row.game_date),
    game_time: toTimeString(row.game_time),
    organizer: (row.organizer as string | null | undefined) ?? "Unknown",
    description: (row.description as string | null | undefined) ?? undefined,
    capacity,
    attendeeCount,
    status,
  };
}

// Get all games, newest first.
export async function getGames(): Promise<Game[]> {
  const result = await sql`
    SELECT p.*, u.name AS organizer, COUNT(gp.id)::int AS attendee_count
    FROM pickup_game p
    LEFT JOIN users u ON u.id = p.created_by
    LEFT JOIN game_player gp ON gp.game_id = p.id
    GROUP BY p.id, u.name
    ORDER BY p.game_date, p.game_time;
  `;

  return result.rows.map(mapGame);
}

export async function getGameById(id: string): Promise<Game | null> {
  const result = await sql`
    SELECT p.*, u.name AS organizer, COUNT(gp.id)::int AS attendee_count
    FROM pickup_game p
    LEFT JOIN users u ON u.id = p.created_by
    LEFT JOIN game_player gp ON gp.game_id = p.id
    WHERE p.id = ${id}
    GROUP BY p.id, u.name;
  `;

  if (result.rows.length === 0) return null;
  return mapGame(result.rows[0]);
}

export interface NewGameInput {
  title: string;
  description?: string;
  location: string;
  game_date: string;
  game_time: string;
  max_players: number;
  created_by: string;
}

// Add a game.
export async function addGame(game: NewGameInput): Promise<Game> {
  const result = await sql`
    INSERT INTO pickup_game
      (title, description, location, game_date, game_time, max_players, created_by)
    VALUES
      (${game.title}, ${game.description ?? null}, ${game.location},
       ${game.game_date}, ${game.game_time}, ${game.max_players}, ${game.created_by})
    RETURNING id;
  `;

  const created = await getGameById(String(result.rows[0].id));
  if (!created) throw new Error("Game was created but could not be loaded.");
  return created;
}

// Update a game: only the fields present in `data` are changed.
export async function updateGame(
  id: string,
  data: Partial<NewGameInput>,
): Promise<Game | null> {
  const current = await getGameById(id);
  if (!current) return null;

  const merged: NewGameInput = {
    title: data.title ?? current.title ?? current.location,
    description: data.description ?? current.description,
    location: data.location ?? current.location,
    game_date: data.game_date ?? current.game_date,
    game_time: data.game_time ?? current.game_time,
    max_players: data.max_players ?? current.capacity,
    created_by: data.created_by ?? "",
  };
  if (!merged.created_by) {
    const owner =
      await sql`SELECT created_by FROM pickup_game WHERE id = ${id};`;
    merged.created_by = String(owner.rows[0]?.created_by ?? "");
  }

  await sql`
    UPDATE pickup_game
    SET
      title = ${merged.title},
      description = ${merged.description ?? null},
      location = ${merged.location},
      game_date = ${merged.game_date},
      game_time = ${merged.game_time},
      max_players = ${merged.max_players}
    WHERE id = ${id};
  `;

  return getGameById(id);
}

// Delete a game.
export async function deleteGame(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM pickup_game
    WHERE id = ${id}
    RETURNING id;
  `;

  return result.rows.length > 0;
}

// Join a game.
export async function joinGame(game_id: string, user_id: string) {
  // Already joined? Return the existing row without re-checking capacity.
  const existing = await sql`
    SELECT * FROM game_player
    WHERE game_id = ${game_id} AND user_id = ${user_id};
  `;
  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  // Atomic capacity check + insert: FOR UPDATE locks the game's row so
  // two concurrent join attempts for the same game can't both pass the
  // capacity check when there's exactly one spot left. ON CONFLICT still
  // covers the duplicate-join race from a user joining twice at once.
  const result = await sql`
    INSERT INTO game_player (game_id, user_id, status, joined_at)
    SELECT ${game_id}, ${user_id}, 'joined', NOW()
    FROM pickup_game p
    WHERE p.id = ${game_id}
      AND (
            SELECT COUNT(*) FROM game_player gp WHERE gp.game_id = p.id
          ) < p.max_players
      FOR UPDATE OF p
          ON CONFLICT (game_id, user_id) DO NOTHING
            RETURNING *;
  `;

  if (result.rows.length === 0) {
    // Game missing, full, or we lost a race for the last spot — all three
    // look the same from here, so the caller just sees "couldn't join."
    return null;
  }

  return result.rows[0];
}

// Leave a game.
export async function leaveGame(game_id: string, user_id: string) {
  const result = await sql`
    DELETE FROM game_player
    WHERE game_id = ${game_id} AND user_id = ${user_id}
    RETURNING *;
  `;

  return result.rows[0] || null;
}

// Get the list of players attending a game, oldest join first.
export async function getGameAttendees(gameId: string): Promise<Attendee[]> {
  const result = await sql`
    SELECT u.id, u.name, gp.joined_at, gp.status
    FROM game_player gp
    JOIN users u ON u.id = gp.user_id
    WHERE gp.game_id = ${gameId}
    ORDER BY gp.joined_at;
  `;

  return result.rows.map((row) => ({
    id: String(row.id),
    name: (row.name as string | undefined) ?? "Unknown",
    joinedAt:
      row.joined_at instanceof Date
        ? row.joined_at.toISOString()
        : String(row.joined_at),
    status: (row.status as string | undefined) ?? "joined",
  }));
}
