import type { UseCase } from "@/core/domain/use-case";
import { Email } from "../domain/email";
import type { SessionGateway } from "../domain/repositories";
import type { User } from "../domain/user";

/** (Navegador) Inicia sesión: valida el correo y delega en el gateway de sesión. */
export class SignInUseCase implements UseCase<{ email: string; password: string }, User> {
  constructor(private readonly session: SessionGateway) {}

  execute({ email, password }: { email: string; password: string }) {
    return this.session.signIn({ email: Email.create(email), password });
  }
}
