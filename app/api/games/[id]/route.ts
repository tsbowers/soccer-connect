import { NextResponse } from "next/server";
import { getGameById, updateGame, deleteGame } from "@/app/lib/db";
import { getSessionUserId } from "@/lib/session";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
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

  const data = await request.json();
  const game = await updateGame(id, data);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  return NextResponse.json(game, { status: 200 });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
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

  const success = await deleteGame(id);
  if (!success) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  return NextResponse.json(
      { message: "Game deleted successfully" },
      { status: 200 },
  );
}
