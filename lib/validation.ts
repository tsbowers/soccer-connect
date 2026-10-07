import { BIO_MAX_LENGTH } from "@/lib/user-types";
import type { LoginInput, ProfileInput, SignupInput } from "@/lib/user-types";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkDisplayName(value: string): string | undefined {
  const name = value.trim();
  if (!name) return "Enter a display name.";
  if (name.length < 2) return "Display name must be at least 2 characters.";
  if (name.length > 40) return "Display name must be 40 characters or fewer.";
  return undefined;
}

function checkEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  return undefined;
}

export function validateSignup(input: SignupInput): FieldErrors<SignupInput> {
  const errors: FieldErrors<SignupInput> = {};
  const displayName = checkDisplayName(input.displayName);
  const email = checkEmail(input.email);
  if (displayName) errors.displayName = displayName;
  if (email) errors.email = email;
  if (!input.password) errors.password = "Enter a password.";
  else if (input.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  return errors;
}

export function validateLogin(input: LoginInput): FieldErrors<LoginInput> {
  const errors: FieldErrors<LoginInput> = {};
  const email = checkEmail(input.email);
  if (email) errors.email = email;
  if (!input.password) errors.password = "Enter your password.";
  return errors;
}

export function validateProfile(
  input: ProfileInput,
): FieldErrors<ProfileInput> {
  const errors: FieldErrors<ProfileInput> = {};
  const displayName = checkDisplayName(input.displayName);
  if (displayName) errors.displayName = displayName;
  if (input.bio.length > BIO_MAX_LENGTH)
    errors.bio = `Bio must be ${BIO_MAX_LENGTH} characters or fewer.`;
  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}
