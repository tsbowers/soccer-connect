import { NextResponse } from "next/server";
import {
  getProfileById,
  updateProfile,
} from "@/app/lib/server/profile";
import { getSessionUserId } from "@/lib/session";
import type { ProfileInput } from "@/lib/user-types";

// GET /api/profile returns the signed-in user (or null).
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json(null, { status: 200 });

  const user = await getProfileById(userId);
  if (!user) return NextResponse.json(null, { status: 200 });

  return NextResponse.json(user, { status: 200 });
}

// PATCH /api/profile updates the signed-in user's public profile fields.
export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const input: ProfileInput = {
    displayName: typeof body?.displayName === "string" ? body.displayName : "",
    preferredPosition:
      typeof body?.preferredPosition === "string" ? body.preferredPosition : "",
    bio: typeof body?.bio === "string" ? body.bio : "",
  };

  if (!input.displayName.trim()) {
    return NextResponse.json(
      { error: "Display name is required." },
      { status: 400 },
    );
  }

  const user = await updateProfile(userId, input);
  if (!user) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
}
