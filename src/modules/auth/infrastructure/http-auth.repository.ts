import { InvalidCredentialsError, UnauthorizedError } from "@/core/domain/errors";
import type { HttpClient } from "@/infrastructure/shared/http-client";
import type { AuthSession, AuthTokens, Credentials } from "../domain/auth-session";
import type { AuthRepository } from "../domain/repositories";
import type { User } from "../domain/user";
import type { LoginResponseDto, TokensDto, UserDto } from "./auth.dto";
import { toAuthSession, toTokens, toUser } from "./auth.mappers";

/** Adaptador: AuthRepository sobre el backend REST. */
export class HttpAuthRepository implements AuthRepository {
  constructor(private readonly http: HttpClient) {}

  async login({ email, password }: Credentials): Promise<AuthSession> {
    try {
      const dto = await this.http.request<LoginResponseDto>({
        method: "POST",
        path: "/auth/login",
        body: { email: email.value, password },
      });
      return toAuthSession(dto);
    } catch (e) {
      // En el login, un 401 significa "credenciales incorrectas", no "sesión vencida".
      if (e instanceof UnauthorizedError) throw new InvalidCredentialsError(e.message, e.code);
      throw e;
    }
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const dto = await this.http.request<TokensDto>({ method: "POST", path: "/auth/refresh", body: { refreshToken } });
    return toTokens(dto);
  }

  logout(accessToken: string): Promise<void> {
    return this.http.request({ method: "POST", path: "/auth/logout", bearerToken: accessToken });
  }

  async me(accessToken: string): Promise<User> {
    return toUser(await this.http.request<UserDto>({ path: "/auth/me", bearerToken: accessToken }));
  }
}
