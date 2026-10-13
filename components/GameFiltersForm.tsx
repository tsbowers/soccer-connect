"use client";

import { useState, type FormEvent } from "react";
import {
  Field,
  describedBy,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/ui";
import {
  EMPTY_FILTERS,
  hasActiveFilters,
  validateFilters,
  type GameFilters,
} from "@/lib/filters";

interface GameFiltersFormProps {
  applied: GameFilters;
  onApply: (filters: GameFilters) => void;
}

export function GameFiltersForm({ applied, onApply }: GameFiltersFormProps) {
  const [draft, setDraft] = useState<GameFilters>(applied);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof GameFilters, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = validateFilters(draft);
    setError(problem);
    if (!problem) onApply({ ...draft, location: draft.location.trim() });
  }

  function handleClear() {
    setDraft(EMPTY_FILTERS);
    setError(null);
    onApply(EMPTY_FILTERS);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Filter games"
      noValidate
      className="card p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field id="filter-location" label="Location">
          <input
            id="filter-location"
            type="text"
            value={draft.location}
            onChange={(event) => update("location", event.target.value)}
            placeholder="Park or field name"
            className={inputClass}
          />
        </Field>
        <Field id="filter-date" label="Date">
          <input
            id="filter-date"
            type="date"
            value={draft.date}
            onChange={(event) => update("date", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field
          id="filter-time-from"
          label="Earliest start"
          error={error ?? undefined}
        >
          <input
            id="filter-time-from"
            type="time"
            value={draft.timeFrom}
            onChange={(event) => update("timeFrom", event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy(
              "filter-time-from",
              error ?? undefined,
            )}
            className={inputClass}
          />
        </Field>
        <Field id="filter-time-to" label="Latest start">
          <input
            id="filter-time-to"
            type="time"
            value={draft.timeTo}
            onChange={(event) => update("timeTo", event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy("filter-time-to", error ?? undefined)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" className={primaryButtonClass}>
          Apply filters
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasActiveFilters(draft) && !hasActiveFilters(applied)}
          className={secondaryButtonClass}
        >
          Clear filters
        </button>
      </div>
    </form>
  );
}
