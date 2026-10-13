import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const SESSION_COOKIE = "sc_session";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is not set.");
  }
  return "dev-only-insecure-secret"; // local development only
}

function signature(userId: string): string {
  return createHmac("sha256", secret()).update(userId).digest("base64url");
}

// Cookie value is "<userId>.<HMAC>" so a user id can't be forged by editing
// the cookie in the browser.
function sign(userId: string): string {
  return `${userId}.${signature(userId)}`;
}

function verify(value: string | undefined): string | null {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;

  const userId = value.slice(0, dot);
  const given = Buffer.from(value.slice(dot + 1));
  const expected = Buffer.from(signature(userId));
  if (given.length !== expected.length) return null;
  return timingSafeEqual(given, expected) ? userId : null;
}

export function setSessionCookie(
  response: NextResponse,
  name: string,
  userId: string,
): NextResponse {
  response.cookies.set(name, sign(userId), {
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

// Returns the signed-in user's id, or null when nobody is signed in (or the
// cookie's signature is invalid).
export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  return verify(store.get(SESSION_COOKIE)?.value);
}
