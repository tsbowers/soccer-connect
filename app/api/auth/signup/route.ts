import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  const result = await sql`
    INSERT INTO users (email, password, name)
    VALUES (${email}, ${password}, ${name})
    RETURNING id, email, name;
  `;

  return NextResponse.json(result.rows[0], { status: 201 });
}
