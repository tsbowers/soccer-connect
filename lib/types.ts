export type GameStatus = "open" | "full" | "canceled";

export interface Game {
  id: string;
  title?: string;
  location: string;
  game_date: string; // YYYY-MM-DD
  game_time: string; // 24h "HH:MM"
  organizer: string;
  description?: string;
  capacity: number;
  attendeeCount: number;
  status: GameStatus;
}

export interface CreateGameInput {
  location: string;
  game_date: string;
  game_time: string;
  capacity: number;
  description?: string;
}

export interface Attendee {
  id: string;
  name: string;
  joinedAt: string; // ISO timestamp
  status: string;
}
