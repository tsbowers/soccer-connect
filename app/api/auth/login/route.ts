import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const result = await sql`
    SELECT id, email, name
    FROM users
    WHERE email = ${email} AND password = ${password};
  `;

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json(result.rows[0], { status: 200 });
}
