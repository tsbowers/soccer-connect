import { NextResponse } from "next/server";
import { getGames, createGame, } from "@/lib/server/game";

export async function GET(request: Request) {
    const games = await getGames();
    return NextResponse.json(games, { status: 200 });
}

export async function POST(request: Request) {
    const data = await request.json();
    const game = await createGame(data);
    return NextResponse.json(game, { status: 201 });
}