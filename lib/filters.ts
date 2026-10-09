export interface GameFilters {
  location: string;
  date: string; // YYYY-MM-DD, empty = any date
  timeFrom: string; // "HH:MM", empty = no lower bound
  timeTo: string; // "HH:MM", empty = no upper bound
}

export const EMPTY_FILTERS: GameFilters = {
  location: "",
  date: "",
  timeFrom: "",
  timeTo: "",
};

export function hasActiveFilters(filters: GameFilters): boolean {
  return Object.values(filters).some((value) => value.trim() !== "");
}

export function validateFilters(filters: GameFilters): string | null {
  if (filters.timeFrom && filters.timeTo && filters.timeFrom > filters.timeTo) {
    return "The earliest start time must be before the latest start time.";
  }
  return null;
}

export function toQueryString(filters: GameFilters): string {
  const params = new URLSearchParams();
  if (filters.location.trim()) params.set("location", filters.location.trim());
  if (filters.date) params.set("date", filters.date);
  if (filters.timeFrom) params.set("timeFrom", filters.timeFrom);
  if (filters.timeTo) params.set("timeTo", filters.timeTo);
  const query = params.toString();
  return query ? `?${query}` : "";
}
