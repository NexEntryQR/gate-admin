// Backend LocalDateTime fields are zoneless — treat them as local wall-clock time throughout,
// same as an HTML datetime-local input, with no timezone conversion in either direction.

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function toDatetimeLocalValue(value: string): string {
  return value.slice(0, 16);
}

export function isFutureDatetimeLocal(value: string): boolean {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
}
