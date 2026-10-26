import { describe, expect, it, vi } from "vitest";
import { InvalidCredentialsError, ServerError, UnauthorizedError } from "@/core/domain/errors";
import type { HttpClient } from "@/infrastructure/shared/http-client";
import { Email } from "../domain/email";
import { HttpAuthRepository } from "./http-auth.repository";

const credentials = { email: Email.create("demo@vecinal.co"), password: "x" };

const httpThrowing = (error: Error): HttpClient => ({ request: vi.fn().mockRejectedValue(error) });

describe("HttpAuthRepository", () => {
  it("mapea la respuesta del backend (DTO) a la sesión de dominio", async () => {
    const http: HttpClient = {
      request: vi.fn().mockResolvedValue({
        accessToken: "a",
        refreshToken: "r",
        expiresIn: 900,
        user: { id: "1", name: "Mariana", email: "demo@vecinal.co", role: "admin", organization: "Los Pinos" },
      }),
    };

    const session = await new HttpAuthRepository(http).login(credentials);

    expect(session.user.name).toBe("Mariana");
    expect(session.tokens).toEqual({ accessToken: "a", refreshToken: "r", expiresIn: 900 });
    expect(http.request).toHaveBeenCalledWith(expect.objectContaining({ method: "POST", path: "/auth/login" }));
  });

  it("un 401 en el login es InvalidCredentialsError, no sesión vencida", async () => {
    const repo = new HttpAuthRepository(httpThrowing(new UnauthorizedError("Correo o contraseña incorrectos.")));
    await expect(repo.login(credentials)).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("un 401 en otras llamadas sigue siendo UnauthorizedError", async () => {
    const repo = new HttpAuthRepository(httpThrowing(new UnauthorizedError("Sesión expirada.")));
    const error = await repo.me("token").catch((e) => e);
    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error).not.toBeInstanceOf(InvalidCredentialsError);
  });

  it("propaga otros errores sin tocarlos", async () => {
    const repo = new HttpAuthRepository(httpThrowing(new ServerError("boom")));
    await expect(repo.login(credentials)).rejects.toBeInstanceOf(ServerError);
  });
});
