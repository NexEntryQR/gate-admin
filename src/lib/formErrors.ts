import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function applyFieldErrors<T extends FieldValues>(
  fieldErrors: Record<string, string> | undefined,
  setError: UseFormSetError<T>,
) {
  if (!fieldErrors) return;
  for (const [field, message] of Object.entries(fieldErrors)) {
    setError(field as Path<T>, { message });
  }
}
