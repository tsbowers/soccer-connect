import { sql } from "@vercel/postgres";
import type { ProfileInput } from "@/lib/user-types";

export async function createProfile(userId: string, input: ProfileInput) {
  const { displayName, preferredPosition, bio } = input;

  const result = await sql`
    INSERT INTO profile (id, name, preferred_position, bio)
    VALUES (${userId}, ${displayName}, ${preferredPosition}, ${bio})
    RETURNING *;
  `;

  return result.rows[0];
}

export async function updateProfile(userId: string, input: ProfileInput) {
  const { displayName, preferredPosition, bio } = input;

  const result = await sql`
    UPDATE profile
    SET name = ${displayName},
        preferred_position = ${preferredPosition},
        bio = ${bio}
    WHERE user_id = ${userId}
    RETURNING *;
  `;

  return result.rows[0];
}

export async function getProfileById(userId: string) {
  const result = await sql`
    SELECT * FROM profile
    WHERE user_id = ${userId};
  `;

  return result.rows[0] ?? null;
}
export async function deleteProfile(userId: string) {
  const result = await sql`
    DELETE FROM profile
    WHERE user_id = ${userId}
    RETURNING user_id;
  `;

  return result.rows.length > 0;
}