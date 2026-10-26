import type { AuthSession, AuthTokens, Credentials } from "./auth-session";
import type { Email } from "./email";
import type { User } from "./user";

/**
 * PUERTOS (interfaces) que el dominio necesita. Las implementaciones viven en
 * infrastructure/. El dominio no sabe si hay HTTP, mocks o lo que sea detrás.
 */

/** Autenticación contra el backend. Sin estado: los tokens se pasan explícitos. (Servidor) */
export interface AuthRepository {
  login(credentials: Credentials): Promise<AuthSession>;
  refresh(refreshToken: string): Promise<AuthTokens>;
  logout(accessToken: string): Promise<void>;
  me(accessToken: string): Promise<User>;
}

/** Recuperación de contraseña. Funciona igual en navegador y servidor. */
export interface PasswordRecoveryRepository {
  requestReset(email: Email): Promise<void>;
  reset(token: string, newPassword: string): Promise<void>;
}

/**
 * Sesión vista desde el NAVEGADOR: los tokens viven en cookies httpOnly, así que
 * el cliente solo puede "entrar" y "salir" y recibir el usuario.
 */
export interface SessionGateway {
  signIn(credentials: Credentials): Promise<User>;
  signOut(): Promise<void>;
}
