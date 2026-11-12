import type { ErrorRequestHandler, RequestHandler } from "express";
import { HttpError } from "../utils/http-error.js";

export const notFound: RequestHandler = (_req, _res, next) =>
  next(new HttpError(404, "NOT_FOUND", "The requested resource was not found."));

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  void _next;
  if (error instanceof SyntaxError && "status" in error && error.status === 400) {
    res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "The request body contains invalid JSON.",
      },
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    });
    return;
  }

  if (isUniqueConstraintError(error)) {
    res.status(409).json({
      error: {
        code: "CONFLICT",
        message: "A record with this information already exists.",
      },
    });
    return;
  }

  console.error("Unhandled request error", error);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again.",
    },
  });
};
