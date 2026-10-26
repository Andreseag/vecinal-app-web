import type { Email } from "./email";
import type { User } from "./user";

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  /** Segundos de vida del accessToken. */
  readonly expiresIn: number;
}

/** Resultado de autenticarse contra el backend (solo existe en el servidor). */
export interface AuthSession {
  readonly user: User;
  readonly tokens: AuthTokens;
}

export interface Credentials {
  readonly email: Email;
  readonly password: string;
}
