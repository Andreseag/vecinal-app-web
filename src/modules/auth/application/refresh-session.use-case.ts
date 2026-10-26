import type { UseCase } from "@/core/domain/use-case";
import type { AuthTokens } from "../domain/auth-session";
import type { AuthRepository } from "../domain/repositories";

/** (Servidor) Renueva los tokens. Lanza UnauthorizedError si el refresh ya no sirve. */
export class RefreshSessionUseCase implements UseCase<{ refreshToken: string }, AuthTokens> {
  constructor(private readonly auth: AuthRepository) {}

  execute({ refreshToken }: { refreshToken: string }) {
    return this.auth.refresh(refreshToken);
  }
}
