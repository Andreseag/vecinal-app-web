/** Puerto técnico de HTTP: lo implementan el navegador y el servidor. */
export interface HttpRequest {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Ruta relativa al backend: "/dashboard". */
  path: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  signal?: AbortSignal;
  /** Solo en servidor: token a enviar como Authorization. */
  bearerToken?: string;
}

export interface HttpClient {
  request<T = void>(req: HttpRequest): Promise<T>;
}

export function withQuery(path: string, query?: HttpRequest["query"]): string {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
