import { NetworkError } from "@/core/domain/errors";
import { backendFetch } from "./backend-gateway";
import { withQuery, type HttpClient, type HttpRequest } from "../shared/http-client";
import { mapHttpError, type ErrorBodyDto } from "../shared/http-error-mapper";

/** HTTP del servidor hacia el backend REST. Mismo contrato que el del navegador. */
export class ServerHttpClient implements HttpClient {
  async request<T = void>({ method = "GET", path, query, body, bearerToken }: HttpRequest): Promise<T> {
    const res = await backendFetch(withQuery(path, query), {
      method,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      token: bearerToken,
    });

    if (!res.ok) {
      // 502 de backendFetch = backend inalcanzable
      if (res.status === 502) throw new NetworkError("No pudimos conectar con el servidor.");
      throw mapHttpError(res.status, (await res.json().catch(() => null)) as ErrorBodyDto | null);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }
}
