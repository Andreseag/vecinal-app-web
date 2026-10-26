import { NetworkError } from "@/core/domain/errors";
import { withQuery, type HttpClient, type HttpRequest } from "../shared/http-client";
import { mapHttpError, type ErrorBodyDto } from "../shared/http-error-mapper";

/**
 * HTTP del navegador. Siempre habla con el servidor de Next (mismo origen), que
 * reenvía al backend con el token (cookies httpOnly). No sabe nada de redirecciones
 * ni de UI: solo lanza errores de dominio.
 */
export class BrowserHttpClient implements HttpClient {
  constructor(private readonly baseUrl: string) {}

  async request<T = void>({ method = "GET", path, query, body, signal }: HttpRequest): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}${withQuery(path, query)}`, {
        method,
        signal,
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") throw e;
      throw new NetworkError("No pudimos conectar con el servidor. Revisa tu conexión.");
    }

    if (!res.ok) {
      throw mapHttpError(res.status, (await res.json().catch(() => null)) as ErrorBodyDto | null);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }
}
