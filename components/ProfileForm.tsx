"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  Field,
  FormError,
  describedBy,
  inputClass,
  primaryButtonClass,
} from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { BIO_MAX_LENGTH, POSITIONS } from "@/lib/user-types";
import type { ProfileInput } from "@/lib/user-types";
import { hasErrors, validateProfile, type FieldErrors } from "@/lib/validation";

export function ProfileForm() {
  const router = useRouter();
  const { user, loading, updateProfile } = useAuth();
  const [errors, setErrors] = useState<FieldErrors<ProfileInput>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bioLength, setBioLength] = useState<number | null>(null);

  // Profile management requires a signed-in player (FR-002).
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <p role="status" className="px-6 py-10 text-muted">
        Loading your profile…
      </p>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input: ProfileInput = {
      displayName: data.get("displayName")?.toString() ?? "",
      preferredPosition: data.get("preferredPosition")?.toString() ?? "",
      bio: data.get("bio")?.toString() ?? "",
    };

    const nextErrors = validateProfile(input);
    setErrors(nextErrors);
    setFormError(null);
    setSaved(false);
    if (hasErrors(nextErrors)) return;

    setSaving(true);
    try {
      await updateProfile(input);
      setSaved(true);
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const currentBioLength = bioLength ?? user.bio.length;
  const bioHint = `${currentBioLength} of ${BIO_MAX_LENGTH} characters`;

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">Your profile</h1>
      <p className="mt-1 text-muted">
        Other players see your display name, position, and bio on games you join.
      </p>

      <form
        onSubmit={handleSubmit}
        onChange={() => setSaved(false)}
        noValidate
        className="card mt-6 flex flex-col gap-4 p-6"
      >
        <FormError message={formError} />
        {saved && (
          <p
            role="status"
            className="rounded-md border border-turf bg-turf/10 px-3 py-2 text-sm text-turf-text"
          >
            Profile saved.
          </p>
        )}

        <Field id="displayName" label="Display name" error={errors.displayName}>
          <input
            id="displayName"
            name="displayName"
            type="text"
            defaultValue={user.displayName}
            autoComplete="nickname"
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby={describedBy("displayName", errors.displayName)}
            className={inputClass}
          />
        </Field>

        <Field id="email" label="Email" hint="Your email can't be changed here.">
          <input
            id="email"
            type="email"
            value={user.email}
            readOnly
            aria-describedby="email-hint"
            className={`${inputClass} bg-background text-muted`}
          />
        </Field>

        <Field id="preferredPosition" label="Preferred position">
          <select
            id="preferredPosition"
            name="preferredPosition"
            defaultValue={user.preferredPosition}
            className={inputClass}
          >
            <option value="">No preference</option>
            {POSITIONS.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </Field>

        <Field id="bio" label="Short bio" error={errors.bio} hint={bioHint}>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={user.bio}
            onChange={(event) => setBioLength(event.target.value.length)}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby={describedBy("bio", errors.bio, bioHint)}
            className={inputClass}
          />
        </Field>

        <button type="submit" disabled={saving} className={primaryButtonClass}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}