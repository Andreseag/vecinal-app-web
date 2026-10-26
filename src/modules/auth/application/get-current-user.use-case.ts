import type { UseCase } from "@/core/domain/use-case";
import type { AuthRepository } from "../domain/repositories";
import type { User } from "../domain/user";

/** (Servidor) Usuario dueño del access token. */
export class GetCurrentUserUseCase implements UseCase<{ accessToken: string }, User> {
  constructor(private readonly auth: AuthRepository) {}

  execute({ accessToken }: { accessToken: string }) {
    return this.auth.me(accessToken);
  }
}
