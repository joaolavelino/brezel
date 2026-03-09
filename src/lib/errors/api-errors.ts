export type ApiErrorCode =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export type ApiErrorResponse = {
  status: number;
  code: ApiErrorCode;
  message: string;
};

export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string
): Response {
  const body: ApiErrorResponse = { status, code, message };
  return Response.json(body, { status });
}

// Shortcuts
export const ApiError = {
  notFound: (message = "Resource not found") =>
    apiError(404, "NOT_FOUND", message),

  unauthorized: (message = "Authentication required") =>
    apiError(401, "UNAUTHORIZED", message),

  forbidden: (message = "Access denied") => apiError(403, "FORBIDDEN", message),

  badRequest: (message = "Invalid request") =>
    apiError(400, "BAD_REQUEST", message),

  internal: (message = "Something went wrong") =>
    apiError(500, "INTERNAL_SERVER_ERROR", message),
};
