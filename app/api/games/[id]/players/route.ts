import { NextResponse } from "next/server";

import { getGameAttendees, joinGame, leaveGame } from "@/app/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const attendees = await getGameAttendees(id);
  return NextResponse.json(attendees, { status: 200 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await request.json();
  const result = await joinGame(id, data.user_id);

  if (!result) {
    return NextResponse.json({ error: "Failed to join game" }, { status: 400 });
  }
  return NextResponse.json(result, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await request.json();
  const result = await leaveGame(id, data.user_id);

  if (!result) {
    return NextResponse.json(
      { error: "Failed to leave game" },
      { status: 400 },
    );
  }
  return NextResponse.json(result, { status: 200 });
}
