// Normalizes gate-mgt's RFC 7807 ProblemDetail error body into one typed shape both apps
// branch on by status/detail instead of hand-parsing per screen.

export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(status: number, title: string, detail: string, fieldErrors?: Record<string, string>) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.fieldErrors = fieldErrors;
  }
}

interface ProblemDetailBody {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string>;
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let body: ProblemDetailBody | null = null;
  try {
    body = (await response.json()) as ProblemDetailBody;
  } catch {
    // Non-JSON error body (e.g. the dev server itself is down) — fall through to a generic error.
  }

  if (body && typeof body.title === "string" && typeof body.detail === "string") {
    return new ApiError(response.status, body.title, body.detail, body.errors);
  }

  return new ApiError(response.status, "Request failed", `Request failed with status ${response.status}`);
}

export function isConflict(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 409;
}

export function isNotFound(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 404;
}

export function isValidationError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 400 && !!error.fieldErrors;
}

export function isInvalidRequest(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 400 && !error.fieldErrors;
}
