import { createHmac, timingSafeEqual } from "node:crypto";

// Passwords are stored as plain text because the users.password column is
// only varchar(30) and the team can't alter the database. KNOWN ISSUE: see the
// README. Accounts that were briefly upgraded to the "h1$..." keyed hash are
// still verified here so nobody gets locked out.
const LEGACY_HASH = /^h1\$[A-Za-z0-9_-]{27}$/;

function legacyHash(plain: string, email: string): string {
  const key = process.env.SESSION_SECRET ?? "dev-only-insecure-secret";
  const digest = createHmac("sha256", key)
    .update(`${email.toLowerCase()}\n${plain}`)
    .digest("base64url");
  return `h1$${digest.slice(0, 27)}`;
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function verifyPassword(
  plain: string,
  email: string,
  stored: string,
): boolean {
  if (LEGACY_HASH.test(stored)) {
    return safeEqual(legacyHash(plain, email), stored);
  }
  return safeEqual(plain, stored);
}
