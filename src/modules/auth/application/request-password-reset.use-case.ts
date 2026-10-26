import type { UseCase } from "@/core/domain/use-case";
import { Email } from "../domain/email";
import type { PasswordRecoveryRepository } from "../domain/repositories";

export class RequestPasswordResetUseCase implements UseCase<{ email: string }, void> {
  constructor(private readonly recovery: PasswordRecoveryRepository) {}

  execute({ email }: { email: string }) {
    return this.recovery.requestReset(Email.create(email));
  }
}
