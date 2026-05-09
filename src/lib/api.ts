import { NextResponse } from "next/server";

export type ApiErrorPayload = {
  error: string;
};

type MySqlLikeError = Error & {
  sqlMessage?: string;
  code?: string;
};

export function parseOptionalNumber(value: string | null): number | null {
  if (value === null || value.trim() === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseRequiredNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function ok<T>(data: T) {
  return NextResponse.json({ data });
}

export function badRequest(message: string) {
  return NextResponse.json<ApiErrorPayload>({ error: message }, { status: 400 });
}

export function handleRouteError(error: unknown) {
  const dbError = error as MySqlLikeError;
  const message =
    dbError.sqlMessage ||
    dbError.message ||
    "The database operation could not be completed.";

  return NextResponse.json<ApiErrorPayload>({ error: message }, { status: 500 });
}
