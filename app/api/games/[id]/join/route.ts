import { NextResponse } from "next/server";
import { getGameById, joinGame, leaveGame } from "@/app/lib/db";
import { getSessionUserId } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

// The player is always the signed-in user from the session cookie, never an
// id sent in the request body.
export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to join a game." }, { status: 401 });
  }

  const game = await getGameById(id, userId);
  if (!game) {
    return NextResponse.json({ error: "That game no longer exists." }, { status: 404 });
  }
  if (game.joined) return NextResponse.json(game, { status: 200 }); // duplicate join
  if (game.status === "canceled") {
    return NextResponse.json({ error: "This game was canceled." }, { status: 409 });
  }
  if (game.status === "full") {
    return NextResponse.json({ error: "This game is full." }, { status: 409 });
  }

  try {
    const result = await joinGame(id, userId);
    if (!result) {
      return NextResponse.json({ error: "This game is full." }, { status: 409 });
    }
    return NextResponse.json(await getGameById(id, userId), { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Could not join the game. Try again in a moment." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to leave a game." }, { status: 401 });
  }

  if (!(await getGameById(id, userId))) {
    return NextResponse.json({ error: "That game no longer exists." }, { status: 404 });
  }

  try {
    await leaveGame(id, userId); // leaving when not joined is a harmless no-op
    return NextResponse.json(await getGameById(id, userId), { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Could not leave the game. Try again in a moment." },
      { status: 500 },
    );
  }
}
