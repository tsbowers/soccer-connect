export type GameStatus = "open" | "full" | "canceled";

export interface Game {
  id: string;
  location: string;
  date: string; // YYYY-MM-DD
  startTime: string; // 24h "HH:MM"
  organizer: string;
  description?: string;
  capacity: number;
  attendeeCount: number;
  status: GameStatus;
}

export interface CreateGameInput {
  location: string;
  date: string;
  startTime: string;
  capacity: number;
  description?: string;
}
