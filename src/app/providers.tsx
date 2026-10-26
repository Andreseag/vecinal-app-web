"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { InvalidCredentialsError, UnauthorizedError, isClientError } from "@/core/domain/errors";

/**
 * Manejo GLOBAL de sesión vencida (responsabilidad de presentación, no del HTTP):
 * cualquier 401 que no sea "credenciales incorrectas" lleva a iniciar sesión.
 */
function onSessionExpired(error: unknown) {
  if (error instanceof UnauthorizedError && !(error instanceof InvalidCredentialsError) && typeof window !== "undefined") {
    const next = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
    window.location.assign(`/iniciar-sesion?next=${next}`);
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: onSessionExpired }),
        mutationCache: new MutationCache({ onError: onSessionExpired }),
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            // No reintentar errores del cliente (401/403/404/422); sí hasta 2 veces red/5xx.
            retry: (failureCount, error) => !isClientError(error) && failureCount < 2,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
