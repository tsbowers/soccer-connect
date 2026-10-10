import type { User } from "@/lib/user-types";

// Postgres rows come back as loose key/value records (QueryResultRow).
export function dbUserToUser(db: Record<string, unknown>): User {
  return {
    id: String(db.id),
    name: (db.name as string | undefined) ?? "",
    email: (db.email as string | undefined) ?? "",
    preferredPosition:
      (db.preferred_position as string | null | undefined) ?? "",
    bio: (db.bio as string | null | undefined) ?? "",
  };
}
