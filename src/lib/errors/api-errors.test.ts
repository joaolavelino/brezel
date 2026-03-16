import { describe, expect, it } from "vitest";
import { ApiError, apiError } from "./api-errors";

describe("apiError", () => {
  it("returns structured response", async () => {
    const response = apiError(400, "BAD_REQUEST", "hello there");
    const data = await response.json();

    expect(data).toStrictEqual({
      status: 400,
      code: "BAD_REQUEST",
      message: "hello there",
    });

    expect(response.status).toBe(400);
  });
});

//Now the shortcuts

describe("ApiError (shortcut)", () => {
  it('returns default response for "not-found" errors', async () => {
    const response = ApiError.notFound();
    const data = await response.json();
    expect(data).toStrictEqual({
      status: 404,
      code: "NOT_FOUND",
      message: "resource-not-found",
    });
    expect(response.status).toBe(404);
  });
  it('returns default response for "unauthorized" errors', async () => {
    const response = ApiError.unauthorized();
    const data = await response.json();
    expect(data).toStrictEqual({
      status: 401,
      code: "UNAUTHORIZED",
      message: "authentication-required",
    });
    expect(response.status).toBe(401);
  });
  it('returns default response for "forbidden" errors', async () => {
    const response = ApiError.forbidden();
    const data = await response.json();
    expect(data).toStrictEqual({
      status: 403,
      code: "FORBIDDEN",
      message: "access-denied",
    });
  });
  it('returns default response for "bad request" errors', async () => {
    const response = ApiError.badRequest();
    const data = await response.json();
    expect(data).toStrictEqual({
      status: 400,
      code: "BAD_REQUEST",
      message: "invalid-request",
    });
  });
  it('returns default response for "internal" errors', async () => {
    const response = ApiError.internal();
    const data = await response.json();
    expect(data).toStrictEqual({
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "something-went-wrong",
    });
  });
  it("returns custom message", async () => {
    const response = ApiError.internal("hello-there");
    const data = await response.json();
    expect(data).toStrictEqual({
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "hello-there",
    });
  });
});
