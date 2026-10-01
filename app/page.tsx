import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
      {/* Faster One is the display font — one short statement only,
          so it stays readable. The tagline below uses bold Roboto. */}
      <h1 className="font-heading max-w-2xl text-6xl leading-[1.2] tracking-[0.02em] sm:text-7xl">
        Find a game.
      </h1>
      <p className="mt-3 text-xl font-extrabold uppercase tracking-[0.25em] text-turf-text sm:text-2xl">
        Show up. Play.
      </p>
      <p className="mt-4 max-w-xl text-lg text-muted">
        SoccerConnect puts local pickup games, their start times, and who is
        coming in one place.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/games" className="btn-primary">
          Browse games
        </Link>
        <Link href="/signup" className="btn-secondary">
          Create an account
        </Link>
      </div>
    </div>
  );
}