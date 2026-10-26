import { DEMO_EMAIL, DEMO_PASSWORD, buildDashboard, demoUser } from "./data";

/**
 * "Backend falso" en memoria. Imita el contrato de docs/API_CONTRACT.md.
 * Al agregar un módulo nuevo, añade aquí sus rutas de ejemplo.
 */

interface MockRequest {
  method: string;
  /** Ruta con querystring opcional: "/dashboard" */
  path: string;
  body?: string;
  token?: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const json = (data: unknown, status = 200) => Response.json(data, { status });
const fail = (message: string, status: number, extra?: object) => json({ message, ...extra }, status);

const tokens = () => ({
  accessToken: `mock-access.${demoUser.id}`,
  refreshToken: `mock-refresh.${demoUser.id}`,
  expiresIn: 60 * 15,
});

const isAuthed = (token?: string) => !!token?.startsWith("mock-access.");

export async function handleMock({ method, path, body, token }: MockRequest): Promise<Response> {
  await sleep(250); // latencia simulada
  const route = path.split("?")[0] ?? path;
  const data = body ? (JSON.parse(body) as Record<string, string>) : {};

  // ---------- Auth (públicas) ----------
  if (method === "POST" && route === "/auth/login") {
    if (data.email?.toLowerCase() !== DEMO_EMAIL || data.password !== DEMO_PASSWORD) {
      return fail("Correo o contraseña incorrectos.", 401, { code: "INVALID_CREDENTIALS" });
    }
    return json({ ...tokens(), user: demoUser });
  }

  if (method === "POST" && route === "/auth/refresh") {
    if (!data.refreshToken?.startsWith("mock-refresh.")) return fail("Sesión expirada.", 401);
    return json(tokens());
  }

  if (method === "POST" && route === "/auth/forgot-password") {
    return new Response(null, { status: 204 }); // siempre 204: no revelar si el correo existe
  }

  if (method === "POST" && route === "/auth/reset-password") {
    if (!data.token || data.token === "expired") return fail("El enlace expiró o no es válido.", 400, { code: "INVALID_TOKEN" });
    return new Response(null, { status: 204 });
  }

  // ---------- Privadas ----------
  if (!isAuthed(token)) return fail("No autenticado.", 401);

  if (method === "POST" && route === "/auth/logout") return new Response(null, { status: 204 });
  if (method === "GET" && route === "/auth/me") return json(demoUser);
  if (method === "GET" && route === "/dashboard") return json(buildDashboard());

  return fail("Recurso no encontrado.", 404);
}
