import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, applySession, clearSession } from "@/infrastructure/server/session-cookies";
import { tryRefreshSession } from "@/modules/auth/presentation/server/try-refresh-session";

/**
 * Next.js 16: `proxy.ts` reemplaza a `middleware.ts` (corre en Node.js).
 * Hace dos cosas ANTES de renderizar:
 *   1. Protege las rutas privadas (redirige a /iniciar-sesion?next=...).
 *   2. Si el access token venció pero hay refresh token, lo renueva en silencio.
 * Nota: es una barrera de UX. La autorización real la hace el backend en cada request.
 */

const PUBLIC = ["/iniciar-sesion", "/olvide-contrasena", "/restablecer-contrasena"];
const isPublic = (p: string) => PUBLIC.some((r) => p === r || p.startsWith(`${r}/`));

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  // 1) Sesión vigente
  if (access) {
    if (isPublic(pathname) && pathname !== "/restablecer-contrasena") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2) Access vencido → intenta renovar con el refresh token
  if (refresh) {
    const tokens = await tryRefreshSession(refresh);
    if (tokens) {
      if (isPublic(pathname) && pathname !== "/restablecer-contrasena") {
        const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
        applySession(redirect, tokens);
        return redirect;
      }
      // Que los Server Components vean el token nuevo en esta misma request
      request.cookies.set(ACCESS_COOKIE, tokens.accessToken);
      const response = NextResponse.next({ request });
      applySession(response, tokens);
      return response;
    }
  }

  // 3) Sin sesión
  if (isPublic(pathname)) {
    const response = NextResponse.next();
    if (refresh) clearSession(response);
    return response;
  }

  const login = new URL("/iniciar-sesion", request.url);
  if (pathname !== "/" && pathname !== "/dashboard") login.searchParams.set("next", `${pathname}${search}`);
  const redirect = NextResponse.redirect(login);
  if (refresh) clearSession(redirect);
  return redirect;
}

export const config = {
  // Excluye API, estáticos e imágenes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
