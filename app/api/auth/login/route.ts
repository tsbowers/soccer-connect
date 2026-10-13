import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

import { dbUserToUser } from "@/lib/db-mappers";
import { verifyPassword } from "@/lib/password";
import { SESSION_COOKIE, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const result = await sql`SELECT * FROM users WHERE email = ${email};`;
  const row = result.rows[0];
  const stored = row ? String(row.password ?? "") : "";

  if (!row || !verifyPassword(password, email, stored)) {
    return NextResponse.json(
      { error: "Email or password is incorrect." },
      { status: 401 },
    );
  }

  const user = dbUserToUser(row);
  const response = NextResponse.json(user, { status: 200 });
  return setSessionCookie(response, SESSION_COOKIE, user.id);
}
