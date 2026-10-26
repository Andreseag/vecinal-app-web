import { env } from "./env";
import { handleMock } from "./mocks/handler";

export interface BackendInit {
  method?: string;
  body?: string;
  token?: string;
}

/**
 * ÚNICO punto de salida hacia el backend (servidor).
 *   · API_MOCK=true  → responde con ./mocks (sin red).
 *   · API_MOCK=false → fetch a API_URL con el Bearer token.
 */
export async function backendFetch(path: string, init: BackendInit = {}): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();

  if (env.API_MOCK) return handleMock({ method, path, body: init.body, token: init.token });

  const headers: Record<string, string> = { Accept: "application/json" };
  if (init.body) headers["Content-Type"] = "application/json";
  if (init.token) headers.Authorization = `Bearer ${init.token}`;

  try {
    return await fetch(`${env.API_URL}${path}`, {
      method,
      headers,
      body: init.body,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return Response.json({ message: "No pudimos conectar con el servidor. Intenta de nuevo." }, { status: 502 });
  }
}
