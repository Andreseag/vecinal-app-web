import type { NextResponse } from "next/server";
import type { AuthTokens } from "@/modules/auth/domain/auth-session";

/**
 * Sesión en cookies httpOnly: el JavaScript del navegador NUNCA ve los tokens
 * (mitiga el robo por XSS).
 */
export const ACCESS_COOKIE = "vecinal_at";
export const REFRESH_COOKIE = "vecinal_rt";

/** Vida de la cookie del refresh token (segundos). Ajusta según el backend. */
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;
/** Se renueva un poco antes de que expire el access token. */
const ACCESS_MARGIN = 30;

const base = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function applySession(response: NextResponse, tokens: AuthTokens) {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...base,
    maxAge: Math.max(tokens.expiresIn - ACCESS_MARGIN, 30),
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, { ...base, maxAge: REFRESH_MAX_AGE });
}

export function clearSession(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { ...base, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...base, maxAge: 0 });
}
