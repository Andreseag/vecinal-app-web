import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from "@/core/domain/errors";

/** Cuerpo de error que esperamos del backend (ver docs/API_CONTRACT.md). */
export interface ErrorBodyDto {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/** Traduce un status HTTP + cuerpo a un error de dominio. */
export function mapHttpError(status: number, body?: ErrorBodyDto | null): AppError {
  const message = body?.message ?? "Ocurrió un error inesperado.";
  const code = body?.code;

  if (status === 401) return new UnauthorizedError(message, code);
  if (status === 403) return new ForbiddenError(message, code);
  if (status === 404) return new NotFoundError(message, code);
  if (status === 409) return new ConflictError(message, code);
  if (status === 400 || status === 422) return new ValidationError(message, body?.errors ?? {}, code);
  if (status >= 500) return new ServerError(message, code);
  return new AppError(message, code);
}
