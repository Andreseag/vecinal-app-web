import { env } from "@/infrastructure/server/env";
import { ServerHttpClient } from "@/infrastructure/server/server-http-client";
import { GetCurrentUserUseCase } from "@/modules/auth/application/get-current-user.use-case";
import { LoginUseCase } from "@/modules/auth/application/login.use-case";
import { LogoutUseCase } from "@/modules/auth/application/logout.use-case";
import { RefreshSessionUseCase } from "@/modules/auth/application/refresh-session.use-case";
import { HttpAuthRepository } from "@/modules/auth/infrastructure/http-auth.repository";

/**
 * COMPOSITION ROOT del SERVIDOR (route handlers, proxy.ts, Server Components).
 * Habla directo con el backend (o con los mocks si API_MOCK=true).
 *
 * ⚠️ Nunca lo importes desde componentes de cliente.
 */
const http = new ServerHttpClient();
const authRepository = new HttpAuthRepository(http);

export const serverContainer = {
  auth: {
    login: new LoginUseCase(authRepository),
    refreshSession: new RefreshSessionUseCase(authRepository),
    getCurrentUser: new GetCurrentUserUseCase(authRepository),
    logout: new LogoutUseCase(authRepository),
  },
} as const;

/** Configuración de solo lectura para la capa de presentación del servidor. */
export const serverConfig = { mockMode: env.API_MOCK } as const;
