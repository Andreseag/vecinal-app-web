import type { UseCase } from "@/core/domain/use-case";
import type { SessionGateway } from "../domain/repositories";

/** (Navegador) Cierra la sesión. */
export class SignOutUseCase implements UseCase<void, void> {
  constructor(private readonly session: SessionGateway) {}

  execute() {
    return this.session.signOut();
  }
}
