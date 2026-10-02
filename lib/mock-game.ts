import { Game } from "@/lib/types";

export const mockGames: Game[] = [
  {
    id: "1",
    title: "Riverside 7v7",
    location: "Riverside Park Field 2",
    date: "2026-10-12",
    startTime: "18:00",
    createdBy: "Angela Hubbard",
    description: "Casual 7v7, bring a light and dark shirt.",
    maxPlayers: 14,
    attendeeCount: 9,
    status: "open",
  },
  {
    id: "2",
    title: "Saturday Morning Pickup",
    location: "Westside Community Courts",
    date: "2026-10-20",
    startTime: "09:30",
    createdBy: "Trevor Bowers",
    maxPlayers: 10,
    attendeeCount: 10,
    status: "open", // full cupo, pero el status sigue siendo "open" — use isGameFull() to check
  },
];

export function getMockGameById(id: string): Game | undefined {
  return mockGames.find((game) => game.id === id);
}
