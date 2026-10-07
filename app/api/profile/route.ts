import { createProfile } from "@/app/lib/server/profile";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Profile GET works" });
}

export async function POST(request: Request) {
    const data = await request.json();
    const profile = await createProfile(data.userId, data);
    return NextResponse.json(profile, { status: 201 });
}
