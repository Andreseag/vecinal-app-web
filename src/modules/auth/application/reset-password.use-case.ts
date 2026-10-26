import type { UseCase } from "@/core/domain/use-case";
import { assertValidPassword } from "../domain/password-policy";
import type { PasswordRecoveryRepository } from "../domain/repositories";

/** Aplica la política de contraseñas ANTES de llamar al backend. */
export class ResetPasswordUseCase implements UseCase<{ token: string; password: string }, void> {
  constructor(private readonly recovery: PasswordRecoveryRepository) {}

  execute({ token, password }: { token: string; password: string }) {
    assertValidPassword(password);
    return this.recovery.reset(token, password);
  }
}
