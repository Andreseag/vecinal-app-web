import { ValidationError } from "@/core/domain/errors";

export const PASSWORD_MIN_LENGTH = 8;

/**
 * Política de contraseñas: ÚNICA fuente de verdad. La UI (formularios) y los casos
 * de uso la usan; si cambia la regla, cambia aquí.
 * Devuelve la lista de reglas incumplidas (vacía = válida).
 */
export function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < PASSWORD_MIN_LENGTH) errors.push(`Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`);
  if (!/[A-Za-z]/.test(password)) errors.push("Incluye al menos una letra.");
  if (!/\d/.test(password)) errors.push("Incluye al menos un número.");
  return errors;
}

export function assertValidPassword(password: string): void {
  const errors = validatePassword(password);
  if (errors.length) throw new ValidationError(errors[0] ?? "Contraseña inválida.", { password: errors });
}
