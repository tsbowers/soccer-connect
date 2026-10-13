import Link from "next/link";

import { primaryButtonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted">
        That page doesn&apos;t exist, or the game was canceled.
      </p>
      <Link href="/games" className={`${primaryButtonClass} mt-6`}>
        Find a game
      </Link>
    </div>
  );
}
