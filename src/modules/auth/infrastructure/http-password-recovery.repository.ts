import type { HttpClient } from "@/infrastructure/shared/http-client";
import type { Email } from "../domain/email";
import type { PasswordRecoveryRepository } from "../domain/repositories";

/** Adaptador: recuperación de contraseña sobre el backend REST. */
export class HttpPasswordRecoveryRepository implements PasswordRecoveryRepository {
  constructor(private readonly http: HttpClient) {}

  requestReset(email: Email): Promise<void> {
    return this.http.request({ method: "POST", path: "/auth/forgot-password", body: { email: email.value } });
  }

  reset(token: string, newPassword: string): Promise<void> {
    return this.http.request({ method: "POST", path: "/auth/reset-password", body: { token, password: newPassword } });
  }
}
