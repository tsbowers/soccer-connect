import { notFound } from "next/navigation";
import { getGameById } from "@/app/lib/db";

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGameById(id);

  if (!game) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">{game.location}</h1>
      <p className="mt-1 font-medium">
        {game.game_date} at {game.game_time}
      </p>
      {game.description && (
        <p className="mt-2 text-muted">{game.description}</p>
      )}

      <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div className="flex gap-1">
          <dt className="text-muted">Organizer:</dt>
          <dd>{game.organizer}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-muted">Players:</dt>
          <dd>
            {game.attendeeCount} of {game.capacity}
          </dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-muted">Status:</dt>
          <dd>{game.status}</dd>
        </div>
      </dl>
    </div>
  );
}
