// Development-only stand-in for the /api/* endpoints in spec.md.
// It stores everything in this browser's localStorage, so it is NOT secure:
// never ship it. Set NEXT_PUBLIC_USE_MOCK_API=false to use the real API.
import { filterGames } from "@/lib/filters";
import type { GameFilters } from "@/lib/filters";
import type { Game } from "@/lib/types";
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

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = "soccerconnect.mock.users";
const SESSION_KEY = "soccerconnect.mock.session";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function publicUser(stored: StoredUser): User {
  const user: User = {
    id: stored.id,
    displayName: stored.displayName,
    email: stored.email,
    preferredPosition: stored.preferredPosition,
    bio: stored.bio,
  };
  return user; // password is never returned (FR-015)
}

function currentStoredUser(): StoredUser {
  const id = localStorage.getItem(SESSION_KEY);
  const user = readUsers().find((candidate) => candidate.id === id);
  if (!user) throw new ApiError(401, "Sign in to continue.");
  return user;
}

export const mockApi = {
  async signup(input: SignupInput): Promise<User> {
    await delay();
    const users = readUsers();
    const email = input.email.trim().toLowerCase();
    if (users.some((user) => user.email === email)) {
      throw new ApiError(409, "An account with that email already exists.");
    }
    const stored: StoredUser = {
      id: crypto.randomUUID(),
      displayName: input.displayName.trim(),
      email,
      password: input.password,
      preferredPosition: "",
      bio: "",
    };
    writeUsers([...users, stored]);
    localStorage.setItem(SESSION_KEY, stored.id);
    return publicUser(stored);
  },

  async login(input: LoginInput): Promise<User> {
    await delay();
    const email = input.email.trim().toLowerCase();
    const stored = readUsers().find((user) => user.email === email);
    if (!stored || stored.password !== input.password) {
      throw new ApiError(401, "Email or password is incorrect.");
    }
    localStorage.setItem(SESSION_KEY, stored.id);
    return publicUser(stored);
  },

  async logout(): Promise<void> {
    await delay(100);
    localStorage.removeItem(SESSION_KEY);
  },

  async getProfile(): Promise<User> {
    await delay(150);
    return publicUser(currentStoredUser());
  },

  async updateProfile(input: ProfileInput): Promise<User> {
    await delay();
    const current = currentStoredUser();
    const updated: StoredUser = {
      ...current,
      displayName: input.displayName.trim(),
      preferredPosition: input.preferredPosition,
      bio: input.bio.trim(),
    };
    writeUsers(
      readUsers().map((user) => (user.id === updated.id ? updated : user)),
    );
    return publicUser(updated);
  },

  async listGames(filters: GameFilters): Promise<Game[]> {
    await delay();
    return filterGames(seedGames(), filters);
  },
};

function isoDate(daysFromToday: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Sample games are dated relative to today so they are always in the future.
function seedGames(): Game[] {
  return [
    {
      id: "g1",
      title: "Riverside 7v7",
      location: "Riverside Park, Field 2",
      date: isoDate(1),
      startTime: "18:30",
      createdBy: "Marisol Vega",
      description: "Casual 7v7. Bring a light and a dark shirt.",
      maxPlayers: 14,
      attendeeCount: 9,
      status: "open",
    },
    {
      id: "g2",
      title: "Lincoln Turf Scrimmage",
      location: "Lincoln High School turf",
      date: isoDate(2),
      startTime: "20:00",
      createdBy: "Dev Patel",
      maxPlayers: 10,
      attendeeCount: 10,
      status: "open", // full is now derived by isGameFull(), not stored
    },
    {
      id: "g3",
      title: "Saturday Morning Scrimmage",
      location: "Riverside Park, Field 1",
      date: isoDate(3),
      startTime: "09:00",
      createdBy: "Jonas Eriksen",
      description: "Saturday morning scrimmage, all levels welcome.",
      maxPlayers: 12,
      attendeeCount: 5,
      status: "open",
    },
    {
      id: "g4",
      title: "Eastside Pickup",
      location: "Eastside Rec Center",
      date: isoDate(3),
      startTime: "19:00",
      createdBy: "Aiko Tanaka",
      maxPlayers: 8,
      attendeeCount: 6,
      status: "canceled",
    },
    {
      id: "g5",
      title: "Lincoln Small-Sided",
      location: "Lincoln High School turf",
      date: isoDate(5),
      startTime: "17:30",
      createdBy: "Dev Patel",
      description: "Small-sided games, goalkeepers wanted.",
      maxPlayers: 10,
      attendeeCount: 3,
      status: "open",
    },
    {
      id: "g6",
      title: "Eastside Early Pickup",
      location: "Eastside Rec Center",
      date: isoDate(1),
      startTime: "07:00",
      createdBy: "Aiko Tanaka",
      maxPlayers: 8,
      attendeeCount: 2,
      status: "open",
    },
  ];
}