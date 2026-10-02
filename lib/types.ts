// A game is either open for signups or canceled by its organizer.
// "full" is NOT a stored status — it's derived from attendeeCount vs.
// maxPlayers (see isGameFull below), so it can never drift out of sync.
export type GameStatus = "open" | "canceled";

export interface Game {
  id: string;
  title: string;
  location: string;
  date: string; // YYYY-MM-DD
  startTime: string; // 24h "HH:MM"
  createdBy: string; // organizer's user id (display until auth exists)
  description?: string;
  maxPlayers: number;
  attendeeCount: number;
  status: GameStatus;
}

/**
 * A game is full when attendance has reached capacity.
 * Always compute this — never store it as a separate field.
 */
export function isGameFull(
  game: Pick<Game, "attendeeCount" | "maxPlayers">,
): boolean {
  return game.attendeeCount >= game.maxPlayers;
}

export interface CreateGameInput {
  title: string;
  location: string;
  date: string;
  startTime: string;
  maxPlayers: number;
  description?: string;
}

export interface UpdateGameInput extends CreateGameInput {
  id: string;
}
