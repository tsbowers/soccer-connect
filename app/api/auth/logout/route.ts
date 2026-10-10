import { NextResponse } from "next/server";
import { SESSION_COOKIE, clearSessionCookie } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  return clearSessionCookie(response, SESSION_COOKIE);
}
