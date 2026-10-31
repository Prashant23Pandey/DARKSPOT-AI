/**
 * Standardized Error System for DARKSPOT AI
 */

export type DarkspotErrorCode =
  | "EXTRACTION_FAILED"
  | "INVALID_SCHEMA"
  | "RATE_LIMIT_EXCEEDED"
  | "EMPTY_SOURCES"
  | "GEMINI_API_ERROR"
  | "NETWORK_ERROR"
  | "UNAUTHORIZED"
  | "UNKNOWN_ERROR";

export class DarkspotAppError extends Error {
  public readonly code: DarkspotErrorCode;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, code: DarkspotErrorCode = "UNKNOWN_ERROR", status: number = 500, details?: unknown) {
    super(message);
    this.name = "DarkspotAppError";
    this.code = code;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, DarkspotAppError.prototype);
  }
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof DarkspotAppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred during information gap analysis.";
}
