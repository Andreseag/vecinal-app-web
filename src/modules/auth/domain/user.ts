export type UserRole = "admin" | "operador" | "porteria" | "consejo";

/** Persona autenticada en el panel. */
export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  /** Conjunto o administradora a la que pertenece. */
  readonly organization: string;
}

/** "Mariana Gómez" → "Mariana" */
export const firstName = (user: Pick<User, "name">) => user.name.trim().split(/\s+/)[0] ?? "";
