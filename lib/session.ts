import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const SESSION_COOKIE = "sc_uid";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export function setSessionCookie(
  response: NextResponse,
  name: string,
  userId: string,
): NextResponse {
  response.cookies.set(name, userId, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}

export function clearSessionCookie(
  response: NextResponse,
  name: string,
): NextResponse {
  response.cookies.set(name, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return response;
}

// Returns the signed-in user's id, or null when nobody is signed in.
export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}
