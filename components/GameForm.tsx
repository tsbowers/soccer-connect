"use client";

import { useState, type FormEvent } from "react";

// Shape of the data this form collects, shared by Create and Edit flows.
export interface GameFormValues {
  title: string;
  location: string;
  date: string;
  startTime: string;
  maxPlayers: number;
  description?: string;
}

interface GameFormErrors {
  title?: string;
  location?: string;
  date?: string;
  startTime?: string;
  maxPlayers?: string;
}

interface GameFormProps {
  // Pre-fills the fields; used by EditGameForm to load the existing game.
  initialValues?: Partial<GameFormValues>;
  // Label for the submit button, e.g. "Create Game" or "Save Changes".
  submitLabel: string;
  // Called with the validated values once the form passes client-side checks.
  onValidSubmit: (values: GameFormValues) => void;
  // Disables every field (e.g. editing a game that has already started).
  disabled?: boolean;
}

// Exported so EditGameForm can reuse the same "already started" check
// without duplicating the date-math logic.
export function isInThePast(date: string, startTime: string): boolean {
  if (!date || !startTime) return false;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = startTime.split(":").map(Number);
  const gameDateTime = new Date(year, month - 1, day, hour, minute);
  return gameDateTime.getTime() < Date.now();
}

export function GameForm({
  initialValues,
  submitLabel,
  onValidSubmit,
  disabled = false,
}: GameFormProps) {
  const [errors, setErrors] = useState<GameFormErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const title = formData.get("title")?.toString().trim() ?? "";
    const location = formData.get("location")?.toString().trim() ?? "";
    const date = formData.get("date")?.toString() ?? "";
    const startTime = formData.get("startTime")?.toString() ?? "";
    const maxPlayersRaw = formData.get("maxPlayers")?.toString() ?? "";
    const description = formData.get("description")?.toString().trim();

    const nextErrors: GameFormErrors = {};
    if (!title) nextErrors.title = "Title is required.";
    if (!location) nextErrors.location = "Location is required.";
    if (!date) nextErrors.date = "Date is required.";
    if (!startTime) nextErrors.startTime = "Start time is required.";

    const maxPlayers = Number(maxPlayersRaw);
    if (!maxPlayersRaw || !Number.isInteger(maxPlayers) || maxPlayers < 2) {
      nextErrors.maxPlayers = "Capacity must be a whole number of at least 2.";
    }

    if (
      !nextErrors.date &&
      !nextErrors.startTime &&
      isInThePast(date, startTime)
    ) {
      nextErrors.date = "Game date and time must be in the future.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onValidSubmit({
        title,
        location,
        date,
        startTime,
        maxPlayers,
        description,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* fieldset + disabled lets us freeze the whole form in one place
          (used by EditGameForm when the game has already started) */}
      <fieldset disabled={disabled} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={initialValues?.title}
            aria-invalid={Boolean(errors.title)}
            aria-describedby="title-error"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p id="title-error" className="mt-1 text-sm text-red-600">
            {errors.title}
          </p>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={initialValues?.location}
            aria-invalid={Boolean(errors.location)}
            aria-describedby="location-error"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p id="location-error" className="mt-1 text-sm text-red-600">
            {errors.location}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={initialValues?.date}
              aria-invalid={Boolean(errors.date)}
              aria-describedby="date-error"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <p id="date-error" className="mt-1 text-sm text-red-600">
              {errors.date}
            </p>
          </div>

          <div className="flex-1">
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
              Start time
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              defaultValue={initialValues?.startTime}
              aria-invalid={Boolean(errors.startTime)}
              aria-describedby="startTime-error"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <p id="startTime-error" className="mt-1 text-sm text-red-600">
              {errors.startTime}
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="maxPlayers"
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            Capacity
          </label>
          <input
            id="maxPlayers"
            name="maxPlayers"
            type="number"
            min={2}
            defaultValue={initialValues?.maxPlayers}
            aria-invalid={Boolean(errors.maxPlayers)}
            aria-describedby="maxPlayers-error"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p id="maxPlayers-error" className="mt-1 text-sm text-red-600">
            {errors.maxPlayers}
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={initialValues?.description}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </fieldset>
    </form>
  );
}
