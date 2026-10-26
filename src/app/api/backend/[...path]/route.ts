import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { backendFetch } from "@/infrastructure/server/backend-gateway";
import { ACCESS_COOKIE, REFRESH_COOKIE, applySession, clearSession } from "@/infrastructure/server/session-cookies";
import type { AuthTokens } from "@/modules/auth/domain/auth-session";
import { tryRefreshSession } from "@/modules/auth/presentation/server/try-refresh-session";

/**
 * BFF / proxy hacia el backend REST (adaptador de transporte, sin lógica de negocio).
 *   Navegador → /api/backend/<ruta>  →  <API_URL>/<ruta>  (con Authorization)
 * Los tokens nunca tocan el JS del navegador. Si el backend responde 401,
 * intenta UNA renovación con el refresh token.
 */

// Estas rutas manejan tokens: solo se usan desde /api/auth/*.
const BLOCKED = new Set(["auth/login", "auth/refresh", "auth/logout"]);

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, { params }: Ctx) {
  const { path } = await params;
  if (path.some((s) => !s || s === "." || s === "..") || BLOCKED.has(path.join("/"))) {
    return NextResponse.json({ message: "No encontrado." }, { status: 404 });
  }

  const backendPath = `/${path.join("/")}${request.nextUrl.search}`;
  const method = request.method;
  const body = method === "GET" || method === "HEAD" ? undefined : await request.text();

  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  const refresh = store.get(REFRESH_COOKIE)?.value;

  let res = await backendFetch(backendPath, { method, body, token: access });
  let renewed: AuthTokens | null = null;

  if (res.status === 401 && refresh) {
    renewed = await tryRefreshSession(refresh);
    if (renewed) res = await backendFetch(backendPath, { method, body, token: renewed.accessToken });
  }

  const out = new NextResponse(res.status === 204 ? null : res.body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });

  if (renewed) applySession(out, renewed);
  else if (res.status === 401 && refresh) clearSession(out); // refresh inválido → sesión muerta

  return out;
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
