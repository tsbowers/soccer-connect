"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const linkClass =
  "rounded-md px-3 py-2 text-sm font-medium hover:bg-background";

export function SiteNav() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="border-b border-line bg-surface">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-3"
      >
        {/* Brand in the display font (opt-in `font-heading` from globals.css).
            No font-semibold — Faster One only ships weight 400. */}
        <Link href="/" className="font-heading text-xl text-turf-text">
          SoccerConnect
        </Link>
        <div className="flex flex-wrap items-center gap-1">
          <Link href="/games" className={linkClass}>
            Games
          </Link>
          {!loading && user && (
            <>
              <Link href="/profile" className={linkClass}>
                {user.name}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={linkClass}
              >
                Log out
              </button>
            </>
          )}
          {!loading && !user && (
            <>
              <Link href="/login" className={linkClass}>
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-turf px-3 py-2 text-sm font-medium text-white hover:bg-turf-dark"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
