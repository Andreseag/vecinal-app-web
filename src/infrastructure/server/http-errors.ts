import { NextResponse } from "next/server";
import { AppError, ValidationError } from "@/core/domain/errors";

const STATUS: Record<AppError["kind"], number> = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  validation: 422,
  conflict: 409,
  network: 502,
  server: 500,
  unknown: 500,
};

/** Convierte un error de dominio en la respuesta JSON de un route handler. */
export function errorToResponse(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        message: error.message,
        ...(error.code ? { code: error.code } : {}),
        ...(error instanceof ValidationError && Object.keys(error.fieldErrors).length ? { errors: error.fieldErrors } : {}),
      },
      { status: STATUS[error.kind] },
    );
  }
  return NextResponse.json({ message: "Ocurrió un error inesperado." }, { status: 500 });
}
