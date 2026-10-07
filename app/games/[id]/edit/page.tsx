import { notFound } from "next/navigation";

import { EditGameForm } from "@/components/EditGameForm";
import { getMockGameById } from "@/lib/mock-game";

export const metadata = {
  title: "Edit Game — SoccerConnect",
};

interface EditGamePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const { id } = await params;
  const game = getMockGameById(id);

  // No game with that id (e.g. a stale link, or it was deleted) → 404.
  if (!game) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Edit Pickup Game
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Update the details below.
      </p>
      <div className="mt-6">
        <EditGameForm game={game} />
      </div>
    </div>
  );
}
