export interface User {
  id: string;
  name: string;
  email: string;
  preferredPosition: string;
  bio: string;
}

export interface SignupInput {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ProfileInput {
  displayName: string;
  preferredPosition: string;
  bio: string;
}

export const POSITIONS = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
  "Any position",
] as const;

export const BIO_MAX_LENGTH = 280;
