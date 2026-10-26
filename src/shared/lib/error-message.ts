import { AppError } from "@/core/domain/errors";

/**
 * Mensaje seguro para mostrar al usuario a partir de cualquier error.
 * Los errores de dominio ya traen un mensaje en español; el resto cae al `fallback`.
 */
export function errorMessage(error: unknown, fallback = "Ocurrió un error inesperado. Intenta de nuevo."): string {
  return error instanceof AppError ? error.message : fallback;
}
