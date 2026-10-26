import { cache } from "react";
import { cookies } from "next/headers";
import { UnauthorizedError } from "@/core/domain/errors";
import { serverContainer } from "@/di/server";
import { ACCESS_COOKIE } from "@/infrastructure/server/session-cookies";
import type { User } from "../../domain/user";

/**
 * Usuario de la sesión actual para Server Components. Memoizado por request.
 * Devuelve null si no hay sesión; si el backend falla por otra causa, propaga el
 * error (lo captura error.tsx) en vez de fingir que no hay sesión.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  try {
    return await serverContainer.auth.getCurrentUser.execute({ accessToken });
  } catch (e) {
    if (e instanceof UnauthorizedError) return null;
    throw e;
  }
});
