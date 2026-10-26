import type { UseCase } from "@/core/domain/use-case";
import type { AuthRepository } from "../domain/repositories";

/** (Servidor) Invalida la sesión en el backend. */
export class LogoutUseCase implements UseCase<{ accessToken: string }, void> {
  constructor(private readonly auth: AuthRepository) {}

  execute({ accessToken }: { accessToken: string }) {
    return this.auth.logout(accessToken);
  }
}
