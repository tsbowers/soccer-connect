import { NextResponse } from "next/server";
import { addGame, getGames } from "@/app/lib/db";
import { getSessionUserId } from "@/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const location = searchParams.get("location");
  const date = searchParams.get("date");
  const timeFrom = searchParams.get("timeFrom");
  const timeTo = searchParams.get("timeTo");

  let games = await getGames();

  if (location) {
    games = games.filter((game) =>
      game.location.toLowerCase().includes(location.toLowerCase()),
    );
  }
  if (date) {
    games = games.filter((game) => game.game_date === date);
  }
  if (timeFrom) {
    games = games.filter((game) => game.game_time >= timeFrom);
  }
  if (timeTo) {
    games = games.filter((game) => game.game_time <= timeTo);
  }

  return NextResponse.json(games, { status: 200 });
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to create a game." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const location =
    typeof body?.location === "string" ? body.location.trim() : "";
  const gameDate = typeof body?.game_date === "string" ? body.game_date : "";
  const gameTime = typeof body?.game_time === "string" ? body.game_time : "";
  const capacity = Number(body?.capacity ?? body?.max_players);
  const title =
    typeof body?.title === "string" && body.title.trim()
      ? body.title.trim()
      : location;

  if (!location || !gameDate || !gameTime || !Number.isInteger(capacity) || capacity < 2) {
    return NextResponse.json(
      { error: "Location, date, time, and a capacity of at least 2 are required." },
      { status: 400 },
    );
  }

  try {
    const game = await addGame({
      title,
      description:
        typeof body?.description === "string" ? body.description : undefined,
      location,
      game_date: gameDate,
      game_time: gameTime,
      max_players: capacity,
      created_by: userId,
    });
    return NextResponse.json(game, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create the game. Try again in a moment." },
      { status: 500 },
    );
  }
}
