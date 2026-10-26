/**
 * Errores de dominio/aplicación. Los adaptadores (infraestructura) traducen los
 * fallos técnicos (HTTP, red) a estos tipos; la UI decide cómo mostrarlos.
 * Ninguna capa interna conoce códigos HTTP ni `fetch`.
 */
export type ErrorKind =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "conflict"
  | "network"
  | "server"
  | "unknown";

export class AppError extends Error {
  readonly kind: ErrorKind = "unknown";
  readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }
}

/** No hay sesión o expiró. */
export class UnauthorizedError extends AppError {
  override readonly kind = "unauthorized" as const;
}

/** Credenciales de acceso incorrectas (caso particular de no autorizado en el login). */
export class InvalidCredentialsError extends UnauthorizedError {}

export class ForbiddenError extends AppError {
  override readonly kind = "forbidden" as const;
}

export class NotFoundError extends AppError {
  override readonly kind = "not_found" as const;
}

export class ConflictError extends AppError {
  override readonly kind = "conflict" as const;
}

/** Datos inválidos. `fieldErrors` mapea campo → mensajes. */
export class ValidationError extends AppError {
  override readonly kind = "validation" as const;
  readonly fieldErrors: Readonly<Record<string, string[]>>;

  constructor(message: string, fieldErrors: Record<string, string[]> = {}, code?: string) {
    super(message, code);
    this.fieldErrors = fieldErrors;
  }
}

/** Sin conexión / backend inalcanzable. */
export class NetworkError extends AppError {
  override readonly kind = "network" as const;
}

/** Error 5xx del backend. */
export class ServerError extends AppError {
  override readonly kind = "server" as const;
}

/** Errores que reintentar no arregla. */
export const isClientError = (e: unknown): e is AppError =>
  e instanceof AppError && ["unauthorized", "forbidden", "not_found", "validation", "conflict"].includes(e.kind);
