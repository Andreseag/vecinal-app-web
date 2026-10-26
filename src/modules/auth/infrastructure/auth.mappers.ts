import type { AuthSession, AuthTokens } from "../domain/auth-session";
import type { User } from "../domain/user";
import type { LoginResponseDto, TokensDto, UserDto } from "./auth.dto";

export const toUser = (dto: UserDto): User => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  role: dto.role,
  organization: dto.organization,
});

export const toTokens = (dto: TokensDto): AuthTokens => ({
  accessToken: dto.accessToken,
  refreshToken: dto.refreshToken,
  expiresIn: dto.expiresIn,
});

export const toAuthSession = (dto: LoginResponseDto): AuthSession => ({
  user: toUser(dto.user),
  tokens: toTokens(dto),
});
