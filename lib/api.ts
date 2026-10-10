// Typed client for the endpoints in spec.md. Pages and components call this
// module only, so all HTTP details live here.
import { toQueryString } from "@/lib/filters";
import type { GameFilters } from "@/lib/filters";
import type { Attendee, CreateGameInput, Game } from "@/lib/types";
import type {
  LoginInput,
  ProfileInput,
  SignupInput,
  User,
} from "@/lib/user-types";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const NETWORK_MESSAGE =
  "Can't reach the server. Check your connection and try again.";
const GENERIC_MESSAGE = "Something went wrong. Try again in a moment.";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(0, NETWORK_MESSAGE);
  }

  if (!response.ok) {
    let message = GENERIC_MESSAGE;
    try {
      const body = await response.json();
      if (typeof body?.error === "string") message = body.error;
    } catch {
      // Keep the generic message when the body isn't JSON.
    }
    throw new ApiError(response.status, message);
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

const post = <T>(path: string, body?: unknown) =>
  request<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

export const api = {
  signup: (input: SignupInput): Promise<User> =>
    post<User>("/api/auth/signup", input),

  login: (input: LoginInput): Promise<User> =>
    post<User>("/api/auth/login", input),

  logout: (): Promise<void> => post<void>("/api/auth/logout"),

  // Resolves to null when nobody is signed in.
  async getCurrentUser(): Promise<User | null> {
    try {
      return await request<User | null>("/api/auth/current");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  },

  updateProfile: (input: ProfileInput): Promise<User> =>
    request<User>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  listGames: (filters: GameFilters): Promise<Game[]> =>
    request<Game[]>(`/api/games${toQueryString(filters)}`),

  createGame: (input: CreateGameInput): Promise<Game> =>
    post<Game>("/api/games", input),
  getGameAttendees: (id: string): Promise<Attendee[]> =>
    request<Attendee[]>(`/api/games/${id}/players`),
};

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : GENERIC_MESSAGE;
}
