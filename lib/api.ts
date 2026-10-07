// Typed client for the endpoints in spec.md. Pages and components call this
// module only, so switching from the mock to the real API changes nothing else.
import { toQueryString } from "@/lib/filters";
import type { GameFilters } from "@/lib/filters";
import { ApiError, mockApi } from "@/lib/mock-api";
import type { Game } from "@/lib/types";
import type {
  LoginInput,
  ProfileInput,
  SignupInput,
  User,
} from "@/lib/user-types";

export { ApiError };

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

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
    USE_MOCK ? mockApi.signup(input) : post("/api/auth/signup", input),

  login: (input: LoginInput): Promise<User> =>
    USE_MOCK ? mockApi.login(input) : post("/api/auth/login", input),

  logout: (): Promise<void> =>
    USE_MOCK ? mockApi.logout() : post("/api/auth/logout"),

  // Resolves to null when nobody is signed in.
  async getCurrentUser(): Promise<User | null> {
    try {
      return USE_MOCK
        ? await mockApi.getProfile()
        : await request<User>("/api/profile");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  },

  updateProfile: (input: ProfileInput): Promise<User> =>
    USE_MOCK
      ? mockApi.updateProfile(input)
      : request<User>("/api/profile", {
          method: "PATCH",
          body: JSON.stringify(input),
        }),

  listGames: (filters: GameFilters): Promise<Game[]> =>
    USE_MOCK
      ? mockApi.listGames(filters)
      : request<Game[]>(`/api/games${toQueryString(filters)}`),
};

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : GENERIC_MESSAGE;
}
