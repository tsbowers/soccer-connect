# SoccerConnect

Find, organize, and join local pickup soccer games.

**Live app:** https://soccer-connect-6vz263odz-cse-340.vercel.app/ · **Repository:** https://github.com/tsbowers/soccer-connect

## Team

- Erick Flores
- Angela Hubbard
- Trevor Bowers
- Álvaro Condorí

## Problem and solution

Recreational players struggle to find others for a pickup game. SoccerConnect puts game details (location, date, time, and who is going) in one place. Players sign up, browse and filter open games, join or leave with one click, and organize their own games.

**Audience:** recreational soccer players who want to find or run local pickup games.

## Features

- Sign up, log in, log out, and edit your profile (display name, preferred position, bio)
- Browse games and filter by location, date, and time range
- Create, edit, and cancel (delete) your own games
- Join or leave a game, with live player counts and a full-game check
- Responsive layout, light and dark mode, form validation, and loading, error, and empty states

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Postgres via `@vercel/postgres`, HMAC-signed session cookies. Hosted on Vercel.

**Authentication:** custom email and password auth (not Auth.js or Clerk). The session cookie is signed with `SESSION_SECRET`. **Passwords are currently stored as plain text** (see Known issues).

## Getting started

Requires Node 20+ and a Postgres database (for example Neon through the Vercel Marketplace).

```bash
npm install
cp .env.example .env.local # then fill in the two values below
npm run dev # http://localhost:3000
```

| Variable | Purpose |
| --- | --- |
| `POSTGRES_URL` | Postgres connection string |
| `SESSION_SECRET` | Random string that signs session cookies (`openssl rand -base64 32`). Required in production. |

Expected tables:

- `users` (`id`, `name`, `email` unique, `password` varchar(30), `preferred_position`, `bio`)
- `pickup_game` (`id`, `title`, `description`, `location`, `game_date`, `game_time`, `max_players`, `created_by` → `users.id`, `created_at`)
- `game_player` (`id`, `game_id` → `pickup_game.id`, `user_id` → `users.id`, `status`, `joined_at`)

Scripts: `npm run lint`, `npm run format`, `npm run format:check`, `npm run build`.

## Deployment (Vercel)

1. Import the GitHub repo into Vercel.
2. Add a Postgres database and confirm `POSTGRES_URL` is set.
3. Add `SESSION_SECRET` under Project Settings → Environment Variables.
4. Deploy. Every push to `main` redeploys automatically.

## Project structure

```
app/ Pages (App Router) and API route handlers under app/api
app/lib/ Database queries (db.ts, server/profile.ts)
components/ Reusable UI (GameCard, GameDirectory, forms, SiteNav, ui.tsx)
lib/ API client, session and password helpers, validation, types
```

The request cycle is: `GameDirectory` (client component) → `api.listGames` → `GET /api/games` → Postgres.

## API reference

All bodies are JSON. Errors return `{ "error": "message" }`.

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | – | Create an account (`displayName`, `email`, `password` of 8+ chars) and sign in |
| POST | `/api/auth/login` | – | Sign in with `email` and `password` |
| POST | `/api/auth/logout` | – | Clear the session |
| GET | `/api/auth/current` | – | Current user, or `null` |
| GET | `/api/profile` | – | Signed-in user's profile, or `null` |
| PATCH | `/api/profile` | Required | Update `displayName`, `preferredPosition`, `bio` |
| GET / PATCH / DELETE | `/api/profile/[id]` | Owner only | Read, update, or delete your own profile |
| GET | `/api/games` | – | List games. Optional query: `location`, `date` (`YYYY-MM-DD`), `timeFrom`, `timeTo` (`HH:MM`) |
| POST | `/api/games` | Required | Create a game (`location`, `game_date`, `game_time`, `capacity` of 2+, optional `title`, `description`) |
| GET | `/api/games/[id]` | – | One game |
| PATCH | `/api/games/[id]` | Organizer | Update a game |
| DELETE | `/api/games/[id]` | Organizer | Delete (cancel) a game |
| POST | `/api/games/[id]/join` | Required | Join a game (409 if full) |
| DELETE | `/api/games/[id]/join` | Required | Leave a game |

## Known issues and opportunities

- **Auth doesn't meet the project spec.** Passwords are stored in plain text; there's no Auth.js v5 or Clerk integration. Tracked in [#53](https://github.com/tsbowers/soccer-connect/issues/53). The `users.password` column is varchar(30), but widening it is a normal migration (we've already run one for #30), not a blocker.
- Lowering a game's capacity below its current player count is not blocked.
- Game times are stored without a time zone.
- There's no real "cancel a game" API yet — deleting a game removes it outright instead of marking it canceled, so the `canceled` status is never shown. Tracked in [#20](https://github.com/tsbowers/soccer-connect/issues/20).
- Run `npm run format` once across the repo (some older files use different quote styles and line endings).
- No automated tests yet.
