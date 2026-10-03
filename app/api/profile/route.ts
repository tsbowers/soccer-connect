import { createProfile, } from "@/lib/server/profile";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const profile = await createProfile(data);
    return NextResponse.json(profile, { status: 201 });
}
