import { serverContainer } from "@/di/server";
import type { AuthTokens } from "../../domain/auth-session";

/** Renueva la sesión; devuelve null si el refresh token ya no sirve (no lanza). */
export async function tryRefreshSession(refreshToken: string): Promise<AuthTokens | null> {
  try {
    return await serverContainer.auth.refreshSession.execute({ refreshToken });
  } catch {
    return null;
  }
}
