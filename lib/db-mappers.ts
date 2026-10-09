import type { User } from "@/lib/user-types";

export function dbUserToUser(db: any): User {
  return {
    id: String(db.id),
    name: db.name,
    email: db.email,
    preferredPosition: db.preferred_position ?? "",
    bio: db.bio ?? "",
  };
}
