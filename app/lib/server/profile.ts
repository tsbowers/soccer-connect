import { sql } from "@vercel/postgres";
import { dbUserToUser } from "@/lib/db-mappers";
import type { ProfileInput } from "@/lib/user-types";
import type { User } from "@/lib/user-types";

// The database has no separate "profile" table: profile fields live on the
// users table, so these helpers read and write users directly.

export async function getProfileById(userId: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE id = ${userId};
  `;
  return result.rows.length > 0 ? dbUserToUser(result.rows[0]) : null;
}

export async function updateProfile(
  userId: string,
  input: ProfileInput,
): Promise<User | null> {
  const result = await sql`
    UPDATE users
    SET name = ${input.displayName},
        preferred_position = ${input.preferredPosition},
        bio = ${input.bio}
    WHERE id = ${userId}
    RETURNING *;
  `;
  return result.rows.length > 0 ? dbUserToUser(result.rows[0]) : null;
}

export async function deleteProfile(userId: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM users
    WHERE id = ${userId}
    RETURNING id;
  `;
  return result.rows.length > 0;
}
