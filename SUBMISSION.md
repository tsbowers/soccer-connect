# W06 Submission text (paste into Canvas)

**GitHub Repository URL:** https://github.com/tsbowers/soccer-connect
**Rendered Application URL:** [ADD VERCEL URL]

## Product Demo Summary

SoccerConnect solves a simple problem for recreational soccer players: it is hard to find other people for a pickup game. Instead of chasing group chats and word of mouth, players see every open game with its location, date, time, and how many spots are left, in one place.

The intended users are casual players who want to find a nearby game to join or organize their own. The most important flow starts with signing up and creating a short profile, then browsing the game list, narrowing it by location, date, or time, and joining a game with one click while the player count updates live. Organizers can create a game, edit its details, or cancel it from its edit page.

Under the hood this is a full-stack Next.js app: client components call API route handlers, which read and write a Postgres database. The result is a working end-to-end tool built by a four-person team on a feature-branch and pull-request workflow.

## Access Instructions

- **Authentication:** custom email and password auth with signed session cookies (passwords are stored as plain text, noted in the README) (not Auth.js or Clerk).
- **Test account:** email `[ADD TEST EMAIL]`, password `[ADD TEST PASSWORD]`
- **Steps to test:**
  1. Open the app and click **Sign up** (or log in with the test account).
  2. Go to **Find a game** and filter by location or date.
  3. Click **Join** on a game, then **Leave**, and watch the player count change.
  4. Click **Create a game**, fill in the form, and submit.
  5. Open your game's **Edit** page, change a detail and save, then use **Cancel game** to delete it.
  6. Open **Profile**, update your details, then **Log out**. While logged out, `/games/new` redirects to login.

## Lighthouse (mobile, incognito)

Performance: [__] · Accessibility: [__] · Best Practices: [__] · SEO: [__]
Strongest category: [___]. Weakest category: [___] because [___].

## CSS Overview

No color contrast errors found. [Confirm after running CSS Overview on the deployed site.]

## README Verification

The README is up to date. It includes the project description, all team members, setup and deployment instructions, API route documentation, and known issues and opportunities.
