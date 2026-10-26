import type { UseCase } from "@/core/domain/use-case";
import type { AuthSession } from "../domain/auth-session";
import { Email } from "../domain/email";
import type { AuthRepository } from "../domain/repositories";

/** (Servidor) Autentica contra el backend y devuelve usuario + tokens. */
export class LoginUseCase implements UseCase<{ email: string; password: string }, AuthSession> {
  constructor(private readonly auth: AuthRepository) {}

  execute({ email, password }: { email: string; password: string }) {
    return this.auth.login({ email: Email.create(email), password });
  }
}
