import { NextResponse } from "next/server";
import { getGames, addGame, } from "@/app/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const location = searchParams.get("location");
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    let games = await getGames();
    
    if (location) {
        games = games.filter((game) => game.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (date) {
        games = games.filter((game) => game.game_date.toLowerCase().includes(date.toLowerCase()));
    }
    if (time) {
        games = games.filter((game) => game.game_time.toLowerCase().includes(time.toLowerCase()));
    }

    return NextResponse.json(games, { status: 200 });
}

export async function POST(request: Request) {
    const data = await request.json();
    const game = await addGame(data);
    return NextResponse.json(game, { status: 201 });
}