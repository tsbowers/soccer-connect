import { EditGameForm } from "@/components/EditGameForm";
import { getGameById } from "@/app/lib/db";
import { getSessionUserId } from "@/lib/session";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Edit Game — SoccerConnect",
};

interface EditGamePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: EditGamePageProps) {
    const { id } = await params;
    const [game, userId] = await Promise.all([
        getGameById(id),
        getSessionUserId(),
    ]);

    // No game with that id (e.g. a stale link, or it was deleted) → 404.
    if (!game) {
        notFound();
    }

    const isOrganizer = !!userId && userId === game.organizerId;

    return (
        <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Edit Pickup Game
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Update the details below.
            </p>
            <div className="mt-6">
                {isOrganizer ? (
                    <EditGameForm game={game} />
                ) : (
                    <div
                        role="alert"
                        className="mx-auto w-full max-w-lg rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    >
                        {userId
                            ? "Only the organizer who created this game can edit it."
                            : "Sign in as the organizer to edit this game."}
                    </div>
                )}
            </div>
        </div>
    );
}
