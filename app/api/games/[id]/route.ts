import { NextResponse } from "next/server";

import { cancelGame, getGameById, updateGame } from "@/app/lib/db";
import { getSessionUserId } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const game = await getGameById(id, await getSessionUserId());
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  return NextResponse.json(game, { status: 200 });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to edit a game." },
      { status: 401 },
    );
  }

  const existing = await getGameById(id);
  if (!existing) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  if (existing.organizerId !== userId) {
    return NextResponse.json(
      { error: "Only the organizer can edit this game." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  // The form sends `capacity`; the database column is `max_players`.
  const capacity = body.capacity ?? body.max_players;
  if (
    capacity !== undefined &&
    (!Number.isInteger(Number(capacity)) || Number(capacity) < 2)
  ) {
    return NextResponse.json(
      { error: "Capacity must be a whole number of at least 2." },
      { status: 400 },
    );
  }

  const game = await updateGame(id, {
    title: typeof body.title === "string" ? body.title : undefined,
    description:
      typeof body.description === "string" ? body.description : undefined,
    location: typeof body.location === "string" ? body.location : undefined,
    game_date: typeof body.game_date === "string" ? body.game_date : undefined,
    game_time: typeof body.game_time === "string" ? body.game_time : undefined,
    max_players: capacity === undefined ? undefined : Number(capacity),
  });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  return NextResponse.json(game, { status: 200 });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to cancel a game." },
      { status: 401 },
    );
  }

  const existing = await getGameById(id);
  if (!existing) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  if (existing.organizerId !== userId) {
    return NextResponse.json(
      { error: "Only the organizer can cancel this game." },
      { status: 403 },
    );
  }
  if (existing.status === "canceled") {
    return NextResponse.json(
      { error: "This game was already canceled." },
      { status: 409 },
    );
  }

  const success = await cancelGame(id);
  if (!success) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  return NextResponse.json(
    { message: "Game canceled successfully" },
    { status: 200 },
  );
}
