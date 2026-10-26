import { InvalidCredentialsError, UnauthorizedError } from "@/core/domain/errors";
import type { HttpClient } from "@/infrastructure/shared/http-client";
import type { Credentials } from "../domain/auth-session";
import type { SessionGateway } from "../domain/repositories";
import type { User } from "../domain/user";
import type { UserDto } from "./auth.dto";
import { toUser } from "./auth.mappers";

/**
 * Adaptador (navegador): habla con /api/auth/*, los endpoints de Next que escriben
 * y borran las cookies httpOnly. Recibe `http` apuntando a "/api".
 */
export class BrowserSessionGateway implements SessionGateway {
  constructor(private readonly http: HttpClient) {}

  async signIn({ email, password }: Credentials): Promise<User> {
    try {
      const { user } = await this.http.request<{ user: UserDto }>({
        method: "POST",
        path: "/auth/login",
        body: { email: email.value, password },
      });
      return toUser(user);
    } catch (e) {
      if (e instanceof UnauthorizedError) throw new InvalidCredentialsError(e.message, e.code);
      throw e;
    }
  }

  signOut(): Promise<void> {
    return this.http.request({ method: "POST", path: "/auth/logout" });
  }
}
