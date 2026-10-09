import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { dbUserToUser } from "@/lib/db-mappers";
import { SESSION_COOKIE, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const displayName =
    typeof body?.displayName === "string" ? body.displayName.trim() : "";
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!displayName || !email || !password) {
    return NextResponse.json(
      { error: "Display name, email, and password are required." },
      { status: 400 },
    );
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 },
    );
  }

  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${displayName}, ${email}, ${password})
    RETURNING *;
  `;

  const user = dbUserToUser(result.rows[0]);
  const response = NextResponse.json(user, { status: 201 });
  return setSessionCookie(response, SESSION_COOKIE, user.id);
}
