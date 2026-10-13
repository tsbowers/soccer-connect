import { NextResponse } from "next/server";

import {
  deleteProfile,
  getProfileById,
  updateProfile,
} from "@/app/lib/server/profile";
import { getSessionUserId } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

// Every handler requires the signed-in user to own the profile in the URL.
async function authorize(params: Params["params"]) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return {
      id,
      error: NextResponse.json(
        { error: "Sign in to continue." },
        { status: 401 },
      ),
    };
  }
  if (userId !== id) {
    return {
      id,
      error: NextResponse.json(
        { error: "You can only change your own profile." },
        { status: 403 },
      ),
    };
  }
  return { id, error: null };
}

export async function GET(_request: Request, { params }: Params) {
  const { id, error } = await authorize(params);
  if (error) return error;

  const profile = await getProfileById(id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  return NextResponse.json(profile, { status: 200 });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id, error } = await authorize(params);
  if (error) return error;

  const body = await request.json().catch(() => null);
  const displayName =
    typeof body?.displayName === "string" ? body.displayName.trim() : "";
  if (!displayName) {
    return NextResponse.json(
      { error: "Display name is required." },
      { status: 400 },
    );
  }

  const profile = await updateProfile(id, {
    displayName,
    preferredPosition:
      typeof body?.preferredPosition === "string" ? body.preferredPosition : "",
    bio: typeof body?.bio === "string" ? body.bio : "",
  });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  return NextResponse.json(profile, { status: 200 });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id, error } = await authorize(params);
  if (error) return error;

  const success = await deleteProfile(id);
  if (!success) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  return NextResponse.json(
    { message: "Profile deleted successfully" },
    { status: 200 },
  );
}
