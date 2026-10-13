import { redirect } from "next/navigation";

import { CreateGameForm } from "@/components/CreateGameForm";
import { getSessionUserId } from "@/lib/session";

export const metadata = {
  title: "Create a Game — SoccerConnect",
};

export default async function NewGamePage() {
  // Checked on the server so signed-out visitors never see the form.
  if (!(await getSessionUserId())) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Create a Pickup Game
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Fill in the details below to organize a new pickup game.
      </p>
      <div className="mt-6">
        <CreateGameForm />
      </div>
    </div>
  );
}
