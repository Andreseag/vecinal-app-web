import { describe, expect, it, vi } from "vitest";
import { ValidationError } from "@/core/domain/errors";
import type { AuthSession } from "../domain/auth-session";
import type { AuthRepository } from "../domain/repositories";
import { LoginUseCase } from "./login.use-case";

const session: AuthSession = {
  user: { id: "1", name: "Mariana Gómez", email: "demo@vecinal.co", role: "admin", organization: "Los Pinos" },
  tokens: { accessToken: "a", refreshToken: "r", expiresIn: 900 },
};

function fakeRepo(): AuthRepository {
  return {
    login: vi.fn().mockResolvedValue(session),
    refresh: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  };
}

describe("LoginUseCase", () => {
  it("normaliza el correo y devuelve la sesión del repositorio", async () => {
    const repo = fakeRepo();
    const result = await new LoginUseCase(repo).execute({ email: " DEMO@vecinal.co ", password: "x" });

    expect(result).toBe(session);
    expect(repo.login).toHaveBeenCalledWith({ email: expect.objectContaining({ value: "demo@vecinal.co" }), password: "x" });
  });

  it("no llama al backend si el correo es inválido", async () => {
    const repo = fakeRepo();
    expect(() => new LoginUseCase(repo).execute({ email: "nope", password: "x" })).toThrow(ValidationError);
    expect(repo.login).not.toHaveBeenCalled();
  });
});
