import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { dbUserToUser } from "@/lib/db-mappers";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json(null, { status: 200 });

  const result = await sql`SELECT * FROM users WHERE id = ${userId};`;
  if (result.rows.length === 0) return NextResponse.json(null, { status: 200 });

  return NextResponse.json(dbUserToUser(result.rows[0]), { status: 200 });
}
