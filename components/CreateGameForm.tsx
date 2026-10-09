"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { FormError } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { CreateGameInput } from "@/lib/types";

interface FormErrors {
  location?: string;
  date?: string;
  startTime?: string;
  capacity?: string;
}

function isInThePast(date: string, startTime: string): boolean {
  if (!date || !startTime) return false;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = startTime.split(":").map(Number);
  const gameDateTime = new Date(year, month - 1, day, hour, minute);
  return gameDateTime.getTime() < Date.now();
}

export function CreateGameForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<CreateGameInput | null>(null);

  // Creating a game requires a signed-in organizer.
  if (!loading && !user) {
    router.replace("/login");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const location = formData.get("location")?.toString().trim() ?? "";
    const date = formData.get("date")?.toString() ?? "";
    const startTime = formData.get("startTime")?.toString() ?? "";
    const capacityRaw = formData.get("capacity")?.toString() ?? "";
    const description = formData.get("description")?.toString().trim();

    const nextErrors: FormErrors = {};
    if (!location) nextErrors.location = "Location is required.";
    if (!date) nextErrors.date = "Date is required.";
    if (!startTime) nextErrors.startTime = "Start time is required.";

    const capacity = Number(capacityRaw);
    if (!capacityRaw || !Number.isInteger(capacity) || capacity < 2) {
      nextErrors.capacity = "Capacity must be a whole number of at least 2.";
    }

    if (
      !nextErrors.date &&
      !nextErrors.startTime &&
      isInThePast(date, startTime)
    ) {
      nextErrors.date = "Game date and time must be in the future.";
    }

    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    const input: CreateGameInput = {
      location,
      game_date: date,
      game_time: startTime,
      capacity,
      description,
    };

    setSubmitting(true);
    try {
      await api.createGame(input);
      setSubmitted(input);
      event.currentTarget.reset();
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormError message={formError} />

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
            htmlFor="capacity"
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            Capacity
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={2}
            aria-describedby="capacity-error"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p id="capacity-error" className="mt-1 text-sm text-red-600">
            {errors.capacity}
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
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
        >
          {submitting ? "Creating…" : "Create Game"}
        </button>
      </form>

      {submitted && (
        <div
          role="status"
          className="mt-6 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
        >
          Game created: {submitted.location} on {submitted.game_date} at{" "}
          {submitted.game_time} (capacity {submitted.capacity}).
        </div>
      )}
    </div>
  );
}
